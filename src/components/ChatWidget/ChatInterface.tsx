import { Message } from '@/types/chat';
import { MessageList } from './MessageList';
import { IoSend } from "react-icons/io5";

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ChatInterface = ({ 
  messages, 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit, 
  onClose,
  inputRef 
}: ChatInterfaceProps) => {
  console.log('ChatInterface isLoading:', isLoading);
  
  return (
    <>
      <MessageList messages={messages} isLoading={isLoading} />
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 pr-10 border rounded text-black"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <button
            onClick={onSubmit}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            <IoSend size={20} />
          </button>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </>
  );
}; 