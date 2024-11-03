export interface FAQ {
  question: string;
  answer: string;
}

export interface BotConfig {
  botName: string;
  businessName: string;
  businessBackground: string;
  faqs: FAQ[];
  fallbackResponse: string;
  contactUrl: string;
  signUpUrl: string;
  botGoal: string;
  welcomeMessage: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isUser?: boolean;
} 