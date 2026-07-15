// TypeScript interfaces for Nalar.AI

export type HintLevel = 1 | 2 | 3;

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isEureka?: boolean;
  eurekaSummary?: EurekaSummary;
  jailbreakBlocked?: boolean;
}

export interface EurekaSummary {
  misconception: string;
  conceptMastered: string;
  keyTakeaway: string;
}

export interface MisconceptionEntry {
  topic: string;
  count: number;
  lastSeen: number;
  icon: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  hintLevel: HintLevel;
}

export interface ChatResponse {
  content: string;
  isEureka: boolean;
  eurekaSummary?: EurekaSummary;
  misconceptions?: string[];
  jailbreakBlocked?: boolean;
}

export interface ChatSessionInfo {
  id: string;
  name: string;
  updatedAt: number;
}

