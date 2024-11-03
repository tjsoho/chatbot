import { UserDetails, Message } from '@/types/chat';
import { MessageList } from './MessageList';

interface MobileFormProps {
  userDetails: UserDetails;
  onUserDetailsChange: (details: Partial<UserDetails>) => void;
  onSubmit: (e: React.FormEvent) => void;
  messages: Message[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const MobileForm = ({ userDetails, onUserDetailsChange, onSubmit, messages, inputRef }: MobileFormProps) => {
  return (
    <div className="p-4">
      <MessageList messages={messages} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            ref={inputRef}
            type="tel"
            value={userDetails.mobile}
            onChange={(e) => onUserDetailsChange({ mobile: e.target.value })}
            className="w-full p-2 border rounded-md text-black"
            placeholder="Your mobile number"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Done
        </button>
      </form>
    </div>
  );
}; 