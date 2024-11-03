"use client";

/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react"; // or use any other icon library you prefer
import { FaStar } from "react-icons/fa";

/*********************************************************************
                            INTERFACES
*********************************************************************/
interface Message {
  text: string;
  isUser: boolean;
  timestamp: any;
}

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
}

interface Chat {
  id: string;
  messages: Message[];
  userDetails: UserDetails;
  createdAt: any;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  rating?: number;
  satisfaction?: {
    rating: number;
    submittedAt: Date;
    feedback: string | null;
  };
  status?: "active" | "closed";
  closedAt?: Date;
}

/*********************************************************************
                        MAIN COMPONENT
*********************************************************************/
export default function ChatHistory() {
  /*********************************************************************
                            STATE
  *********************************************************************/
  const [mounted, setMounted] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*********************************************************************
                            EFFECTS
  *********************************************************************/
  useEffect(() => {
    setMounted(true);
    fetchChats();
  }, []);

  /*********************************************************************
                            FUNCTIONS
  *********************************************************************/
  const fetchChats = async () => {
    try {
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedChats: Chat[] = [];
      querySnapshot.forEach((doc) => {
        fetchedChats.push({ id: doc.id, ...doc.data() } as Chat);
      });

      setChats(fetchedChats);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats");
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Timestamp | string | any) => {
    if (!timestamp) return "";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Australia/Brisbane",
    };

    // Handle Firestore Timestamp
    if (timestamp && typeof timestamp.toDate === "function") {
      return new Intl.DateTimeFormat("en-AU", options).format(
        timestamp.toDate()
      );
    }

    // Handle ISO string
    if (typeof timestamp === "string") {
      return new Intl.DateTimeFormat("en-AU", options).format(
        new Date(timestamp)
      );
    }

    return "";
  };

  const formatDuration = (duration: number | null | undefined) => {
    if (!duration) return "N/A";

    const milliseconds = Number(duration);
    if (isNaN(milliseconds)) return "N/A";

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const handleConfirmDelete = async () => {
      try {
        await deleteDoc(doc(db, "chats", chatId));
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
        if (selectedChat?.id === chatId) {
          setSelectedChat(null);
        }
        toast.success("Chat deleted successfully", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Error deleting chat:", error);
        toast.error("Failed to delete chat", {
          position: "top-right",
        });
      }
    };

    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <p className="text-black">
            Are you sure you want to delete this chat?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-md"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md"
              onClick={async () => {
                await handleConfirmDelete();
                toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-right",
      }
    );
  };

  /*********************************************************************
                        CONDITIONAL RENDERS
  *********************************************************************/
  if (!mounted) return null;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (isLoading)
    return <div className="flex justify-center p-4">Loading chats...</div>;

  /*********************************************************************
                            RENDER
  *********************************************************************/
  console.log(
    "Formatted timestamps:",
    chats.map((chat) => ({
      name: chat.userDetails.name,
      createdAt: chat.createdAt,
      formattedTime: formatTimestamp(chat.createdAt),
    }))
  );
  console.log(
    "Chat data:",
    chats.map((chat) => ({
      name: chat.userDetails.name,
      createdAt: chat.createdAt,
      duration: chat.duration,
    }))
  );
  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white rounded-lg shadow-md overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-black">Chat History</h2>
        </div>
        <div className="divide-y">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                selectedChat?.id === chat.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <p className="font-medium text-black pr-8">
                {chat.userDetails.name}
              </p>
              <p className="text-sm text-black">
                {formatTimestamp(chat.createdAt)}
              </p>
              <p className="text-sm text-black">
                Duration: {formatDuration(chat.duration)}
              </p>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      chat.rating && index < chat.rating
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                    size={12}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Chat Details */}
      <div className="flex-1 bg-white rounded-lg shadow-md overflow-y-auto">
        {selectedChat ? (
          <div className="p-6">
            {/* Chat Header with User Details */}
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold text-black mb-2">
                Chat Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-black">
                <div>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedChat.userDetails.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedChat.userDetails.email}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span>{" "}
                    {selectedChat.userDetails.mobile}
                  </p>
                  <p>
                    <p>{formatTimestamp(selectedChat.createdAt)}</p>
                  </p>
                  <p className="flex">
                    {selectedChat.rating ? (
                      <span className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={
                              index < selectedChat.rating!
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }
                            size={16}
                          />
                        ))}
                      </span>
                    ) : (
                      "No rating"
                    )}
                  </p>
                  {selectedChat.satisfaction?.feedback && (
                    <p>
                      <span className="font-medium">Feedback:</span>{" "}
                      {selectedChat.satisfaction.feedback}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3">
              {selectedChat.messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.isUser ? "bg-blue-100 ml-auto" : "bg-gray-100"
                  }`}
                >
                  <p className="text-xs text-black mt-1">
                    {message.isUser ? "User" : "AI"}
                  </p>
                  <p className="text-sm text-black">{message.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-black">
            Select a chat to view details
          </div>
        )}
      </div>
    </div>
  );
}
