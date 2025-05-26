export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
}

export enum MessageSender {
  USER = 'user',
  AI = 'ai'
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed'
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isConnected: boolean;
}
