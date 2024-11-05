import { Message } from "@/types/chat";
import { MessageList } from "./MessageList";
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
  inputRef,
}: ChatInterfaceProps) => {
  console.log("ChatInterface isLoading:", isLoading);

  return (
    <>
      <MessageList messages={messages} isLoading={isLoading} />
      <div className="flex gap-2"></div>
    </>
  );
};
