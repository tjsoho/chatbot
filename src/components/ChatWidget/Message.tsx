import { BotConfig } from '@/types/botConfig';

interface MessageProps {
  message: {
    text: string;
    isUser: boolean;
  };
  config: BotConfig;
}

const Message: React.FC<MessageProps> = ({ message, config }) => {
  const renderTextWithLinks = (text: string): (JSX.Element | string)[] => {
    // Replace specific URL patterns with more natural language
    const processedText = text
      .replace(
        new RegExp(config.signUpUrl, 'g'), 
        '[[SIGNUP_LINK]]here[[/SIGNUP_LINK]]'
      )
      .replace(
        new RegExp(config.contactUrl, 'g'), 
        '[[CONTACT_LINK]]here[[/CONTACT_LINK]]'
      );

    // Split by custom markers
    const parts = processedText.split(/(\[\[SIGNUP_LINK\]\].*?\[\[\/SIGNUP_LINK\]\]|\[\[CONTACT_LINK\]\].*?\[\[\/CONTACT_LINK\]\])/g);

    return parts.map((part: string, index: number) => {
      if (part.startsWith('[[SIGNUP_LINK]]')) {
        return (
          <a
            key={index}
            href={config.signUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
            onClick={(e) => e.stopPropagation()}
          >
            here
          </a>
        );
      }
      if (part.startsWith('[[CONTACT_LINK]]')) {
        return (
          <a
            key={index}
            href={config.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
            onClick={(e) => e.stopPropagation()}
          >
            here
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex ${
        message.isUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {renderTextWithLinks(message.text)}
      </div>
    </div>
  );
};

export default Message; 