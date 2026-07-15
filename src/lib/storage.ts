import { ChatMessage, MisconceptionEntry, ChatSessionInfo } from '@/lib/types';

export interface StorageAdapter {
  /**
   * Get saved chat messages for a given session/user
   */
  getMessages(sessionId: string): Promise<ChatMessage[]>;

  /**
   * Save or update chat messages
   */
  saveMessages(sessionId: string, messages: ChatMessage[]): Promise<void>;

  /**
   * Get saved misconceptions for the radar
   */
  getMisconceptions(userId: string): Promise<MisconceptionEntry[]>;

  /**
   * Save or update misconceptions
   */
  saveMisconceptions(userId: string, misconceptions: MisconceptionEntry[]): Promise<void>;

  /**
   * Clear stored data for a specific session
   */
  clearSession(sessionId: string): Promise<void>;

  /**
   * List all available sessions for current user/guest
   */
  listSessions(): Promise<ChatSessionInfo[]>;

  /**
   * Create a new chat session
   */
  createSession(name?: string): Promise<ChatSessionInfo>;

  /**
   * Delete a chat session and its messages
   */
  deleteSession(sessionId: string): Promise<void>;
}

