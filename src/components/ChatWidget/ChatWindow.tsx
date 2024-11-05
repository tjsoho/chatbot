"use client";

/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useEffect, useState, useRef } from "react";
import {
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { BotConfig } from "../../types/botConfig";
import { InitialForm } from "./InitialForm";
import { MobileForm } from "./MobileForm";
import { ChatInterface } from "./ChatInterface";
import { RatingModal } from "./RatingModal";
import ChatToggleButton from "./ChatToggleButton";
import MenuBar from "./MenuBar";
import ChatInput from "./ChatInput";
import { toast } from "@/components/Toast/CustomToast";
import "./ChatWindow.css";

/*********************************************************************
                            TYPES
*********************************************************************/
interface UserDetails {
  name: string;
  email: string;
  mobile: string;
}

type FormStep = "initial" | "mobile" | "chat";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

function ChatWindow() {
  /*********************************************************************
                              STATE
  *********************************************************************/
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<FormStep>("initial");
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    mobile: "",
  });
  const [botConfig, setBotConfig] = useState<BotConfig>({
    botName: "",
    businessName: "",
    businessBackground: "",
    faqs: [],
    fallbackResponse: "",
    contactUrl: "",
    signUpUrl: "",
    botGoal: "",
    welcomeMessage: "",
    logoUrl: "",
    profilePhotoUrl: "",
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRatedBefore, setHasRatedBefore] = useState(() => {
    return localStorage.getItem("hasRatedChat") === "true";
  });
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [hasSubmittedMobile, setHasSubmittedMobile] = useState(false);

  /*********************************************************************
                            USE EFFECTS
  *********************************************************************/
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBotConfig = async () => {
      try {
        const configRef = doc(db, "botConfig", "settings");
        const configSnap = await getDoc(configRef);

        if (configSnap.exists()) {
          setBotConfig(configSnap.data() as BotConfig);
        }
      } catch (error) {
        console.error("Error fetching bot configuration:", error);
      }
    };

    fetchBotConfig();
  }, []);

  useEffect(() => {
    const lastActivity = localStorage.getItem("lastChatActivity");
    const savedDetails = localStorage.getItem("userDetails");

    if (lastActivity && savedDetails) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceLastActivity < 30 * 60 * 1000) {
        // 30 minutes
        setHasSubmittedMobile(true);
        setUserDetails(JSON.parse(savedDetails));
        setMessages((prev) => [
          ...prev,
          {
            text: "Welcome back! Continuing your conversation...",
            isUser: false,
          },
        ]);
      } else {
        // Clear expired session
        localStorage.removeItem("userDetails");
        localStorage.removeItem("lastChatActivity");
        localStorage.removeItem("chatMessages");
      }
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (chatId && !showRatingModal) {
        e.preventDefault();
        e.returnValue = "";
        setShowRatingModal(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [chatId, showRatingModal]);

  useEffect(() => {
    if (formStep === "mobile" && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [formStep]);

  useEffect(() => {
    if (formStep === "chat" && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [formStep]);

  useEffect(() => {
    if (!isLoading && chatInputRef.current && formStep === "chat") {
      chatInputRef.current.focus();
    }
  }, [isLoading, messages, formStep]);

  useEffect(() => {
    const hasRated = localStorage.getItem("hasRatedChat");
    if (hasRated) {
      setHasRatedBefore(true);
    }
  }, []);

  /*********************************************************************
                          EVENT HANDLERS
  *********************************************************************/
  const handleInitialDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) {
      alert("Please fill in all fields");
      return;
    }

    const initialMessage = {
      text: `Thanks ${userDetails.name}, one more thing, could you please pop in your mobile number? If we get disconnected I can quickly send you a link so we can pick up from where we left off.`,
      isUser: false,
    };

    try {
      // Create the initial chat document
      const newChatId = await createNewChat(initialMessage);
      if (newChatId) {
        setChatId(newChatId);
      }

      // Update UI
      setFormStep("mobile");
      setMessages([initialMessage]);
    } catch (error) {
      console.error("Error in initial details submit:", error);
      alert("There was an error starting the chat. Please try again.");
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobile = userDetails.mobile; // Get mobile from userDetails

    try {
      if (!mobile) {
        alert("Please enter your mobile number");
        return;
      }

      const welcomeMessage = {
        text: `Great! How can I help you today?`,
        isUser: false,
      };

      if (chatId) {
        // Update existing chat with mobile number and welcome message
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
          "userDetails.mobile": mobile,
          messages: arrayUnion(welcomeMessage),
          lastUpdated: new Date(),
        });
      }

      // Update UI
      setFormStep("chat");
      setMessages((prev) => [...prev, welcomeMessage]);
      setHasSubmittedMobile(true);

      // Save to localStorage
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      localStorage.setItem("lastChatActivity", Date.now().toString());
    } catch (error) {
      console.error("Error submitting mobile:", error);
      alert("There was an error starting the chat. Please try again.");
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!chatId) return; // Make sure we have a chat ID

    // Create new message object
    const newMessage: Message = {
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    // Update UI immediately
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Update Firestore with user message
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
        lastUpdated: new Date()
      });

      // Send to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("API response was not ok");
      }

      const data = await response.json();

      // Create AI response
      const aiResponse: Message = {
        text: data.message,
        isUser: false,
        timestamp: new Date()
      };

      // Update UI
      setMessages((prev) => [...prev, aiResponse]);

      // Update Firestore with AI response
      await updateDoc(chatRef, {
        messages: arrayUnion(aiResponse),
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async (initialMessage: Message) => {
    try {
      const newChatRef = doc(collection(db, "chats"));
      const chatData = {
        userDetails: {
          name: userDetails.name,
          email: userDetails.email,
          mobile: userDetails.mobile, // Make sure mobile is included
        },
        createdAt: new Date(),
        messages: [initialMessage],
        status: "active",
        lastUpdated: new Date(),
      };

      await setDoc(newChatRef, chatData);
      return newChatRef.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  const handleRatingSubmit = async (rating: number, feedback?: string) => {
    try {
      if (chatId) {
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
          rating,
          feedback: feedback || "",
          closedAt: new Date(),
        });
      }

      // Set has rated in localStorage and state
      localStorage.setItem("hasRatedChat", "true");
      setHasRatedBefore(true);

      // Close immediately
      setShowRatingModal(false);
      setIsOpen(false);

      toast({
        message: "Thank you for your feedback!",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
            variant: "primary",
          },
        ],
      });
    } catch (error) {
      console.error("Error saving rating:", error);
      toast({
        message: "Could not save your feedback. Please try again.",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
            variant: "danger",
          },
        ],
      });
    }
  };

  const handleToggleChat = () => {
    if (isOpen && hasSubmittedMobile) {
      setShowRatingModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  /*********************************************************************
                            RENDER
  *********************************************************************/
  if (!mounted) {
    return null;
  }

  return (
    <>
      <ChatToggleButton isOpen={isOpen} onClick={handleToggleChat} />

      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-0 w-full md:w-[470px] h-[87%] md:h-[700px] bg-gradient-to-b from-[#00BF63] to-white rounded-none md:rounded-2xl shadow-xl border overflow-hidden flex flex-col z-50">
          <div className="chat-header">
            <div className="flex justify-between items-center px-4 py-2">
              <div className="w-16 h-16 md:w-20 md:h-20">
                <img
                  src="/images/logo1.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
                <img
                  src="/images/profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="px-4 md:p-4">
              <h2 className="text-3xl font-semibold mb-4 text-white leading-tight">
                Hi there 👋 <br></br>
                Welcome to {botConfig.businessName}
              </h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto chat-window-content relative">
            {formStep === "initial" ? (
              <InitialForm
                botConfig={botConfig}
                userDetails={userDetails}
                onUserDetailsChange={(details) =>
                  setUserDetails((prev) => ({ ...prev, ...details }))
                }
                onSubmit={handleInitialDetailsSubmit}
              />
            ) : formStep === "mobile" ? (
              <MobileForm
                userDetails={userDetails}
                onUserDetailsChange={(details) =>
                  setUserDetails((prev) => ({ ...prev, ...details }))
                }
                onSubmit={handleMobileSubmit}
                messages={messages}
                inputRef={mobileInputRef}
              />
            ) : (
              <ChatInterface messages={messages} isLoading={isLoading} />
            )}
          </div>
          {formStep === "chat" && (
            <div className="relative z-[51]">
              <ChatInput
                onSendMessage={handleSendMessage}
                onClose={() => setIsOpen(false)}
                inputRef={chatInputRef}
              />
            </div>
          )}
          <div className="chat-footer">
            <MenuBar
              activeTab={activeTab}
              signUpUrl={botConfig.signUpUrl}
              contactUrl={botConfig.contactUrl}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      )}

      {showRatingModal && hasSubmittedMobile && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          hasRatedBefore={hasRatedBefore}
          onAlreadyRated={() => {
            setShowRatingModal(false);
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}

export default ChatWindow;
