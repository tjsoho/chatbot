import { UserDetails } from '@/types/chat';
import { BotConfig } from '@/types/botConfig';

interface InitialFormProps {
  botConfig: BotConfig;
  userDetails: UserDetails;
  onUserDetailsChange: (details: Partial<UserDetails>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InitialForm = ({ botConfig, userDetails, onUserDetailsChange, onSubmit }: InitialFormProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Welcome to {botConfig.businessName}
      </h2>
      <p className="text-gray-600 mb-4">
        {botConfig.welcomeMessage || "Please share your details to get started."}
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => onUserDetailsChange({ name: e.target.value })}
            className="w-full p-2 border rounded-md text-black"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => onUserDetailsChange({ email: e.target.value })}
            className="w-full p-2 border rounded-md text-black"
            placeholder="your@email.com"
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