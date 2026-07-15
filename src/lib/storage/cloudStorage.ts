import { StorageAdapter } from '@/lib/storage';
import { ChatMessage, MisconceptionEntry, ChatSessionInfo } from '@/lib/types';
import { localStorageAdapter } from './localStorage';
import { createClient } from '@/lib/supabase/client';

/**
 * CloudStorageAdapter — Hybrid Persistence & Multi-Session Management for Nalar.AI.
 * Automatically synchronizes with Supabase PostgreSQL (`chat_sessions`, `chat_messages`, `user_misconceptions`)
 * when authenticated via Google, while falling back seamlessly to LocalStorageAdapter when offline/Guest.
 */
export class CloudStorageAdapter implements StorageAdapter {
  private getSupabase() {
    try {
      return createClient();
    } catch {
      return null;
    }
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const supabase = this.getSupabase();
    if (!supabase) return localStorageAdapter.getMessages(sessionId);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return localStorageAdapter.getMessages(sessionId);
    }

    try {
      let querySessionId = sessionId;
      if (sessionId.startsWith('guest_') || sessionId === 'default_guest_session') {
        const sessions = await this.listSessions();
        if (sessions.length > 0) {
          querySessionId = sessions[0].id;
        }
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', querySessionId)
        .order('timestamp', { ascending: true });

      if (error || !data || data.length === 0) {
        // Pure isolation: when logged into Google, start with empty array if no cloud messages found
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        role: row.role as 'user' | 'assistant' | 'system',
        content: row.content,
        timestamp: Number(row.timestamp),
        isEureka: row.is_eureka,
        eurekaSummary: row.eureka_summary,
        jailbreakBlocked: row.jailbreak_blocked,
      }));
    } catch {
      return localStorageAdapter.getMessages(sessionId);
    }
  }

  async saveMessages(sessionId: string, messages: ChatMessage[]): Promise<void> {
    const supabase = this.getSupabase();
    if (!supabase) {
      await localStorageAdapter.saveMessages(sessionId, messages);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      await localStorageAdapter.saveMessages(sessionId, messages);
      return;
    }

    if (messages.length === 0) return;

    try {
      let dbSessionId = sessionId;
      if (sessionId.startsWith('guest_') || sessionId === 'default_guest_session') {
        const { data: sessions } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (!sessions || sessions.length === 0) {
          const newSess = await this.createSession();
          dbSessionId = newSess.id;
        } else {
          dbSessionId = sessions[0].id;
        }
      } else {
        const { data: existing } = await supabase
          .from('chat_sessions')
          .select('id, session_name')
          .eq('id', sessionId)
          .single();

        if (!existing) {
          await supabase.from('chat_sessions').insert({
            id: sessionId,
            user_id: user.id,
            session_name: 'Sesi Belajar Sokratis',
          });
        } else if (existing.session_name.startsWith('Sesi Belajar') || existing.session_name === 'Percakapan Baru') {
          const firstUserMsg = messages.find((m) => m.role === 'user');
          if (firstUserMsg) {
            const newTitle = firstUserMsg.content.slice(0, 28) + (firstUserMsg.content.length > 28 ? '...' : '');
            await supabase
              .from('chat_sessions')
              .update({ session_name: newTitle, updated_at: new Date().toISOString() })
              .eq('id', sessionId);
          }
        }
      }

      const rows = messages.map((m) => ({
        id: m.id,
        session_id: dbSessionId,
        user_id: user.id,
        role: m.role,
        content: m.content,
        is_eureka: Boolean(m.isEureka),
        eureka_summary: m.eurekaSummary || null,
        jailbreak_blocked: Boolean(m.jailbreakBlocked),
        timestamp: m.timestamp || Date.now(),
      }));

      await supabase.from('chat_messages').upsert(rows, { onConflict: 'id' });
    } catch (err) {
      console.error('Error syncing messages to Supabase:', err);
    }
  }

  async getMisconceptions(userId: string): Promise<MisconceptionEntry[]> {
    const supabase = this.getSupabase();
    if (!supabase) return localStorageAdapter.getMisconceptions(userId);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return localStorageAdapter.getMisconceptions(userId);
    }

    try {
      const { data, error } = await supabase
        .from('user_misconceptions')
        .select('*')
        .eq('user_id', user.id);

      if (error || !data || data.length === 0) {
        // Pure isolation: when logged into Google, return empty misconceptions for new account
        return [];
      }

      return data.map((row) => ({
        topic: row.topic,
        count: row.count,
        lastSeen: Number(row.last_seen),
        icon: row.icon || '📌',
      }));
    } catch {
      return localStorageAdapter.getMisconceptions(userId);
    }
  }

  async saveMisconceptions(userId: string, misconceptions: MisconceptionEntry[]): Promise<void> {
    const supabase = this.getSupabase();
    if (!supabase) {
      await localStorageAdapter.saveMisconceptions(userId, misconceptions);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      await localStorageAdapter.saveMisconceptions(userId, misconceptions);
      return;
    }

    if (misconceptions.length === 0) return;

    try {
      const rows = misconceptions.map((m) => ({
        user_id: user.id,
        topic: m.topic,
        count: m.count,
        last_seen: m.lastSeen || Date.now(),
        icon: m.icon || '📌',
      }));

      await supabase
        .from('user_misconceptions')
        .upsert(rows, { onConflict: 'user_id, topic' });
    } catch (err) {
      console.error('Error syncing misconceptions to Supabase:', err);
    }
  }

  async clearSession(sessionId: string): Promise<void> {
    await localStorageAdapter.clearSession(sessionId);

    const supabase = this.getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase.from('chat_messages').delete().eq('session_id', sessionId);
    } catch (err) {
      console.error('Error clearing messages on Supabase:', err);
    }
  }

  async listSessions(): Promise<ChatSessionInfo[]> {
    const supabase = this.getSupabase();
    if (!supabase) return localStorageAdapter.listSessions();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return localStorageAdapter.listSessions();
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, session_name, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const defaultSess = await this.createSession('Sesi Belajar #1');
        return [defaultSess];
      }

      return data.map((row) => ({
        id: row.id,
        name: row.session_name || 'Percakapan Baru',
        updatedAt: new Date(row.updated_at).getTime() || Date.now(),
      }));
    } catch {
      return localStorageAdapter.listSessions();
    }
  }

  async createSession(name?: string): Promise<ChatSessionInfo> {
    const supabase = this.getSupabase();
    if (!supabase) return localStorageAdapter.createSession(name);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return localStorageAdapter.createSession(name);
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          session_name: name || 'Percakapan Baru',
        })
        .select('id, session_name, updated_at')
        .single();

      if (error || !data) {
        return localStorageAdapter.createSession(name);
      }

      return {
        id: data.id,
        name: data.session_name || 'Percakapan Baru',
        updatedAt: new Date(data.updated_at).getTime() || Date.now(),
      };
    } catch {
      return localStorageAdapter.createSession(name);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    await localStorageAdapter.deleteSession(sessionId);

    const supabase = this.getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await supabase.from('chat_sessions').delete().eq('id', sessionId).eq('user_id', user.id);
    } catch (err) {
      console.error('Error deleting session on Supabase:', err);
    }
  }
}

export const cloudStorageAdapter = new CloudStorageAdapter();
