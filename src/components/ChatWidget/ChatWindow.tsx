"use client";

/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useEffect, useState, useRef, useCallback } from "react";
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
import ChatInput from './ChatInput';
import '@/styles/scrollbar.css';

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
  const [input, setInput] = useState("");
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
  const [rating, setRating] = useState<number>(0);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

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
    if (!userDetails.mobile) {
      alert("Please enter your mobile number");
      return;
    }

    const welcomeMessage = {
      text: `Great! How can I help you today?`,
      isUser: false,
    };

    try {
      if (chatId) {
        // Update existing chat with mobile number and welcome message
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
          "userDetails.mobile": userDetails.mobile, // Add this line to update mobile
          messages: arrayUnion(welcomeMessage),
          lastUpdated: new Date(),
        });
      } else {
        // Create new chat if none exists
        const newChatId = await createNewChat(welcomeMessage);
        if (newChatId) {
          setChatId(newChatId);
        }
      }

      // Update UI
      setFormStep("chat");
      setMessages((prev) => [...prev, welcomeMessage]);
    } catch (error) {
      console.error("Error in mobile submit:", error);
      alert("There was an error starting the chat. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const newUserMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);
    console.log("Loading started:", isLoading);

    try {
      // Update chat with user message
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        messages: arrayUnion(newUserMessage),
        lastUpdated: new Date(),
      });

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          userDetails,
          botConfig,
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        text: data.message,
        isUser: false,
      };

      // Update UI and database with AI response
      setMessages((prev) => [...prev, aiMessage]);
      await updateDoc(chatRef, {
        messages: arrayUnion(aiMessage),
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Chat Error:", error);
      const fallbackMessage = {
        text:
          botConfig.fallbackResponse ||
          "Sorry, there was an error processing your request.",
        isUser: false,
      };

      setMessages((prev) => [...prev, fallbackMessage]);

      if (chatId) {
        const chatRef = doc(db, "chats", chatId);
        await updateDoc(chatRef, {
          messages: arrayUnion(fallbackMessage),
        });
      }
    } finally {
      setIsLoading(false);
      console.log("Loading ended:", isLoading);
      // Refocus the input field after the response
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
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

  const handleCloseChat = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating: number, feedback?: string) => {
    try {
      if (chatId) {
        const chatRef = doc(db, "chats", chatId);

        // Create update object
        const updateData: any = {
          status: "closed",
          rating,
          closedAt: new Date(),
        };

        // Only add feedback if it exists and isn't empty
        if (feedback?.trim()) {
          updateData.feedback = feedback;
        }

        await updateDoc(chatRef, updateData);
      }
      setShowRatingModal(false);
      // Optional: Add a thank you message
      setMessages((prev) => [
        ...prev,
        {
          text: "Thank you for your feedback! Have a great day!",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleSendMessage = async (message: string) => {
    console.log('Message received in ChatWindow:', message); // Debug log

    // Create new message object
    const newMessage: Message = {
      text: message,
      isUser: true
    };

    // Update UI immediately
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('API response was not ok');
      }

      const data = await response.json();

      // Add AI response to messages
      const aiResponse: Message = {
        text: data.message,
        isUser: false
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        text: "Sorry, I couldn't process that request. Please try again.",
        isUser: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
      <ChatToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="chat-window absolute bottom-16 right-0 w-[470px] h-[700px] bg-gradient-to-b from-[#00BF63] to-white rounded-2xl shadow-xl border overflow-hidden flex flex-col">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="w-20 h-20">
              <img
                src="/images/logo1.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img
                src="/images/profile.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-3xl font-semibold mb-4 text-white leading-tight">
              Hi there 👋 <br></br>
              Welcome to {botConfig.businessName}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
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
              <ChatInterface
                messages={messages}
                input={input}
                isLoading={isLoading}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                onClose={handleCloseChat}
                inputRef={chatInputRef}
              />
            )}

            {showRatingModal && (
              <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleRatingSubmit}
              />
            )}
          </div>

          {formStep === 'chat' && (
            <ChatInput 
              onSendMessage={handleSendMessage}
              onClose={() => setIsOpen(false)}
              inputRef={chatInputRef}
            />
          )}
          <MenuBar
            activeTab={activeTab}
            signUpUrl={botConfig.signUpUrl}
            contactUrl={botConfig.contactUrl}
            onTabChange={setActiveTab}
          />

        </div>
      )}
    </>
  );
}

export default ChatWindow;
