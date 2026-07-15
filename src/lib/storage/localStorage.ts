import { StorageAdapter } from '@/lib/storage';
import { ChatMessage, MisconceptionEntry, ChatSessionInfo } from '@/lib/types';

const MESSAGES_PREFIX = 'nalar_messages_';
const MISCONCEPTIONS_PREFIX = 'nalar_misconceptions_';
const SESSIONS_LIST_KEY = 'nalar_sessions_list';

export class LocalStorageAdapter implements StorageAdapter {
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(MESSAGES_PREFIX + sessionId);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
      return [];
    }
  }

  async saveMessages(sessionId: string, messages: ChatMessage[]): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MESSAGES_PREFIX + sessionId, JSON.stringify(messages));
      // Update session updatedAt
      const sessions = await this.listSessions();
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx >= 0) {
        sessions[idx].updatedAt = Date.now();
        // If name is still default and we have user message, rename
        const firstUserMsg = messages.find((m) => m.role === 'user');
        if (firstUserMsg && sessions[idx].name.startsWith('Sesi Belajar')) {
          sessions[idx].name = firstUserMsg.content.slice(0, 28) + (firstUserMsg.content.length > 28 ? '...' : '');
        }
        localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
    }
  }

  async getMisconceptions(userId: string): Promise<MisconceptionEntry[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(MISCONCEPTIONS_PREFIX + userId);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load misconceptions from localStorage:', error);
      return [];
    }
  }

  async saveMisconceptions(userId: string, misconceptions: MisconceptionEntry[]): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MISCONCEPTIONS_PREFIX + userId, JSON.stringify(misconceptions));
    } catch (error) {
      console.error('Failed to save misconceptions to localStorage:', error);
    }
  }

  async clearSession(sessionId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(MESSAGES_PREFIX + sessionId);
    } catch (error) {
      console.error('Failed to clear session from localStorage:', error);
    }
  }

  async listSessions(): Promise<ChatSessionInfo[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SESSIONS_LIST_KEY);
      if (data) {
        return JSON.parse(data);
      }
      const defaultSessions: ChatSessionInfo[] = [
        { id: 'default_guest_session', name: 'Sesi Belajar #1', updatedAt: Date.now() },
      ];
      localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(defaultSessions));
      return defaultSessions;
    } catch (error) {
      console.error('Failed to list sessions from localStorage:', error);
      return [{ id: 'default_guest_session', name: 'Sesi Belajar #1', updatedAt: Date.now() }];
    }
  }

  async createSession(name?: string): Promise<ChatSessionInfo> {
    const sessions = await this.listSessions();
    const newId = `guest_session_${Date.now()}`;
    const newSession: ChatSessionInfo = {
      id: newId,
      name: name || `Sesi Belajar #${sessions.length + 1}`,
      updatedAt: Date.now(),
    };
    const updated = [newSession, ...sessions];
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(updated));
    }
    return newSession;
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      await this.clearSession(sessionId);
      const sessions = await this.listSessions();
      const filtered = sessions.filter((s) => s.id !== sessionId);
      localStorage.setItem(SESSIONS_LIST_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete session from localStorage:', error);
    }
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
