import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-96 overflow-y-auto mb-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
        >
          <div
            className={`inline-block p-4 rounded-lg ${
              message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}; 