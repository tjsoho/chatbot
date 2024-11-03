"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust this import based on your firebase config location

interface Conversation {
  id: string;
  // Add other conversation properties as needed
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string | null) => void;
  selectedConversation: string | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function ConversationList({
  onSelectConversation,
  selectedConversation,
  isLoading,
  setIsLoading,
  error,
  setError,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        setIsLoading(true);
        setError(null);
        
        const conversationsRef = collection(db, "conversations");
        const snapshot = await getDocs(conversationsRef);
        const conversationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setConversations(conversationsData);
      } catch (err) {
        setError("Failed to fetch conversations");
        console.error("Error fetching conversations:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : isLoading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conversation: Conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? "bg-blue-50" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              {/* Add conversation preview content here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
