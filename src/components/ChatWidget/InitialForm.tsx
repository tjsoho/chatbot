import { UserDetails } from "@/types/chat";
import { BotConfig } from "@/types/botConfig";

interface InitialFormProps {
  botConfig: BotConfig;
  userDetails: UserDetails;
  onUserDetailsChange: (details: Partial<UserDetails>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InitialForm = ({
  botConfig,
  userDetails,
  onUserDetailsChange,
  onSubmit,
}: InitialFormProps) => {
  return (
    <div className="p-4">
      <div className="p-4 bg-white rounded-xl shadow-lg mb-4 ">
        <p className="text-brand-green-dark">
          {botConfig.welcomeMessage ||
            "Please share your details to get started."}
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-4 bg-white rounded-xl shadow-lg mb-4 ">
        <div>
          <label className="block text-sm font-medium text-brand-green-dark mb-1">
            Name
          </label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => onUserDetailsChange({ name: e.target.value })}
            className="w-full p-2 border rounded-lg text-brand-green-dark focus:outline-none focus:ring-1 focus:ring-[#00BF63] focus:border-transparent"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-green-dark mb-1">
            Email
          </label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => onUserDetailsChange({ email: e.target.value })}
            className="w-full p-2 border rounded-lg text-brand-green-dark focus:outline-none focus:ring-1 focus:ring-[#00BF63] focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>
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
