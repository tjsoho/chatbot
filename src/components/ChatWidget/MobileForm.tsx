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
    <div className="p-4 h-contain">
      
      <MessageList messages={messages} />
      
      <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-4 bg-white rounded-xl shadow-lg mb-4 ">
          <label className="block text-sm font-medium text-brand-green-dark mb-2">
            Mobile Number
          </label>
          <input
            ref={inputRef}
            type="tel"
            value={userDetails.mobile}
            onChange={(e) => onUserDetailsChange({ mobile: e.target.value })}
            className="w-full p-2 border rounded-lg text-brand-green-dark focus:outline-none focus:ring-1 focus:ring-[#00BF63] focus:border-transparent"
            placeholder="Your mobile number"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-brand-green text-white rounded-full hover:bg-brand-green-dark hover:text-brand-logo uppercase  transition-colors"
        >
          Done
        </button>
      </form>
    </div>
  );
}; 