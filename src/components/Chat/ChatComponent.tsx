'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BotConfig, Message } from '@/types/botConfig';
import { createSystemPrompt } from '@/utils/aiConfig';

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configRef = doc(db, 'botConfig', 'settings');
        const configSnap = await getDoc(configRef);
        
        if (configSnap.exists()) {
          const config = configSnap.data() as BotConfig;
          setBotConfig(config);
          if (config.welcomeMessage) {
            setMessages([{
              role: 'assistant',
              content: config.welcomeMessage,
              timestamp: new Date(),
              isUser: false
            }]);
          }
        }
      } catch (error) {
        console.error('Error fetching bot config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const sendMessageToBot = async (message: string) => {
    if (!botConfig) return;

    const systemPrompt = createSystemPrompt(botConfig);
    
    try {
      setMessages(prev => [...prev, {
        role: 'user',
        content: message,
        timestamp: new Date(),
        isUser: true
      }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          systemPrompt,
        }),
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        isUser: false
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botConfig.fallbackResponse || "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        isUser: false
      }]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <div className="border-t p-4 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
            if (input.value.trim()) {
              sendMessageToBot(input.value.trim());
              input.value = '';
            }
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent; 