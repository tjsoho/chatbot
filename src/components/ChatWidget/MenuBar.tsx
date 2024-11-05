/*********************************************************************
                            IMPORTS
*********************************************************************/
import React from "react";
import {
  IoChatboxOutline,
  IoPersonAddOutline,
  IoMailOutline,
} from "react-icons/io5";

/*********************************************************************
                            TYPES
*********************************************************************/
interface MenuBarProps {
  activeTab: string;
  signUpUrl: string;
  contactUrl: string;
  onTabChange: (tab: string) => void;
}

/*********************************************************************
                        COMPONENT DEFINITION
*********************************************************************/
const MenuBar: React.FC<MenuBarProps> = ({
  activeTab,
  signUpUrl,
  contactUrl,
  onTabChange,
}) => {
  return (
    <div className="flex justify-around items-center h-12 md:h-20 border-t bg-white">
      {/* Chat Button */}
      <button
        onClick={() => onTabChange("chat")}
        className={`flex flex-col items-center p-2 transition-colors duration-200
          ${
            activeTab === "chat"
              ? "text-[#00BF63] font-semibold"
              : "text-gray-600"
          }
          hover:text-[#00BF63]`}
      >
        <IoChatboxOutline className="text-2xl mb-1 w-5 h-5 md:w-7 md:h-7 stroke-[2]" />
        <span className="text-xs md:text-sm font-medium">Chat</span>
      </button>

      {/* Sign Up Button */}
      <a
        href={signUpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center p-2 text-gray-600 transition-colors duration-200 hover:text-[#00BF63]"
      >
        <IoPersonAddOutline className="text-2xl mb-1 w-5 h-5 md:w-7 md:h-7 stroke-[5]" />
        <span className="text-xs md:text-sm font-medium">Get Started</span>
      </a>

      {/* Contact Button */}
      <a
        href={contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center p-2 text-gray-600 transition-colors duration-200 hover:text-[#00BF63]"
      >
        <IoMailOutline className="text-2xl mb-1 w-5 h-5 md:w-7 md:h-7 stroke-[1.5]" />
        <span className="text-xs md:text-sm font-medium">Contact</span>
      </a>
    </div>
  );
};

export default MenuBar;
