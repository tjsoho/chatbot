export interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  userInfo: UserInfo;
  startedAt: Date;
  lastMessageAt: Date;
  status: 'active' | 'closed';
} 