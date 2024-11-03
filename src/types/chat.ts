import { BotConfig } from './botConfig';

export interface UserDetails {
  name: string;
  email: string;
  mobile: string;
}

export interface Message {
  text: string;
  isUser: boolean;
} 