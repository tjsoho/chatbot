import { Message } from "@/types/chat";
import { MessageList } from "./MessageList";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatInterface = ({
  messages,
  isLoading,
}: ChatInterfaceProps) => {
  return (
    <>
      <MessageList messages={messages} isLoading={isLoading} />
    </>
  );
};
