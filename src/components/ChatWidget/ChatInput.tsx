/*********************************************************************
                            IMPORTS
*********************************************************************/
import React, { useState, RefObject } from "react";
import { IoSend } from "react-icons/io5";

/*********************************************************************
                            TYPES
*********************************************************************/
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClose: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

/*********************************************************************
                        COMPONENT DEFINITION
*********************************************************************/
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, inputRef }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message); // Debug log
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  /*********************************************************************
                        USER INPUT
*********************************************************************/

  return (
    <div className="border-t border-gray-200 p-4 ">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md text-black
            focus:outline-none focus:ring-2 focus:ring-[#00BF63] focus:border-transparent"
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-[#00BF63] text-white hover:bg-[#00A854] transition-colors"
        >
          <IoSend size={20} />
        </button>
        {/* <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
        >
          <IoClose size={20} />
        </button> */}
      </form>
    </div>
  );
};

export default ChatInput;
