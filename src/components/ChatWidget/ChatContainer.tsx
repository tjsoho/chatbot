/*********************************************************************
                            IMPORTS
*********************************************************************/
import { Message } from '@/types/chat';
import { MessageList } from './MessageList';
import ChatInput from './ChatInput';

/*********************************************************************
                            TYPES
*********************************************************************/
interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

/*********************************************************************
                        COMPONENT DEFINITION
*********************************************************************/
export const ChatContainer = ({ 
  messages, 
  isLoading, 
  onSendMessage,
  onClose,
  inputRef 
}: ChatContainerProps) => {
  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput 
        onSendMessage={onSendMessage}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
}; 