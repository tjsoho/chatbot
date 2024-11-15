/*********************************************************************
                            IMPORTS
*********************************************************************/
import React, { useEffect, useState } from 'react';

/*********************************************************************
                            TYPES
*********************************************************************/
interface ChatToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/*********************************************************************
                        COMPONENT DEFINITION
*********************************************************************/
const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ isOpen, onClick }) => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-3">
      {/* Click me bubble */}
      {showBubble && !isOpen && (
        <div className="animate-fade-in relative bg-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-gray-800">Click me</span>
          {/* Triangle pointer */}
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 
            border-t-8 border-t-transparent
            border-l-8 border-l-white
            border-b-8 border-b-transparent">
          </div>
        </div>
      )}

      {/* Button with spinning border */}
      <div className="relative">
        {/* Spinning border */}
        <div className={`absolute inset-0 rounded-full border-2 border-[#C1FF72] ${isOpen ? 'animate-spin' : ''}`}></div>
        
        {/* Main button */}
        <button
          onClick={onClick}
          className="relative bg-[#00BF63] text-white p-4 rounded-full hover:bg-[#00A854] transition-colors duration-200 shadow-xl border-2 border-[#C1FF72]"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatToggleButton; 