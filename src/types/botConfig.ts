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
  logoUrl: string;
  profilePhotoUrl: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isUser?: boolean;
} 