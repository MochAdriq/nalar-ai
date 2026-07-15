'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import ChatArea from '@/components/chat/ChatArea';
import ChatInput from '@/components/chat/ChatInput';
import HintMeter from '@/components/hint-meter/HintMeter';
import MisconceptionRadar from '@/components/radar/MisconceptionRadar';
import EurekaExportModal from '@/components/chat/EurekaExportModal';
import { ChatMessage, HintLevel, MisconceptionEntry, ChatResponse, ChatSessionInfo } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { cloudStorageAdapter } from '@/lib/storage/cloudStorage';
import { MessageSquare, MessageCircle, Trash2, FileText, Plus, Settings } from 'lucide-react';

const USER_ID = 'default_guest_user';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<ChatSessionInfo[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default_guest_session');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hintLevel, setHintLevel] = useState<HintLevel>(2);
  const [isLoading, setIsLoading] = useState(false);
  const [misconceptions, setMisconceptions] = useState<MisconceptionEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load sessions list & misconceptions, and listen for auth state changes
  useEffect(() => {
    let isMounted = true;

    async function loadStoredData() {
      const [storedSessions, storedMisconceptions] = await Promise.all([
        cloudStorageAdapter.listSessions(),
        cloudStorageAdapter.getMisconceptions(USER_ID),
      ]);

      if (!isMounted) return;

      if (storedSessions && storedSessions.length > 0) {
        setSessions(storedSessions);
        const activeId = storedSessions[0].id;
        setCurrentSessionId(activeId);
        const storedMessages = await cloudStorageAdapter.getMessages(activeId);
        if (storedMessages && isMounted) setMessages(storedMessages);
      } else {
        const newSess = await cloudStorageAdapter.createSession('Sesi Belajar #1');
        if (isMounted) {
          setSessions([newSess]);
          setCurrentSessionId(newSess.id);
          setMessages([]);
        }
      }

      // Strictly set misconceptions (even if [] for clean accounts)
      setMisconceptions(storedMisconceptions || []);
      setIsHydrated(true);
    }

    loadStoredData();

    // Listen to real-time login/logout changes
    try {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          loadStoredData();
        }
      });
      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    } catch {
      return () => {
        isMounted = false;
      };
    }
  }, []);

  // Auto-save messages whenever they change after hydration
  useEffect(() => {
    if (isHydrated && currentSessionId && messages.length > 0) {
      cloudStorageAdapter.saveMessages(currentSessionId, messages).then(async () => {
        // Refresh session list to show updated title/timestamp
        const updatedSessions = await cloudStorageAdapter.listSessions();
        if (updatedSessions) setSessions(updatedSessions);
      });
    }
  }, [messages, isHydrated, currentSessionId]);

  // Auto-save misconceptions whenever they change after hydration
  useEffect(() => {
    if (isHydrated && misconceptions.length > 0) {
      cloudStorageAdapter.saveMisconceptions(USER_ID, misconceptions);
    }
  }, [misconceptions, isHydrated]);

  const handleSelectSession = async (sessId: string) => {
    if (sessId === currentSessionId) return;
    setCurrentSessionId(sessId);
    const loaded = await cloudStorageAdapter.getMessages(sessId);
    setMessages(loaded || []);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const handleNewChat = async () => {
    if (messages.length === 0) return; // Prevent creating empty session if current is already empty
    const newSess = await cloudStorageAdapter.createSession(`Sesi Belajar #${sessions.length + 1}`);
    const updatedSessions = await cloudStorageAdapter.listSessions();
    setSessions(updatedSessions || [newSess, ...sessions]);
    setCurrentSessionId(newSess.id);
    setMessages([]);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessId: string) => {
    e.stopPropagation();
    await cloudStorageAdapter.deleteSession(sessId);
    const updated = await cloudStorageAdapter.listSessions();
    setSessions(updated || []);
    if (sessId === currentSessionId) {
      if (updated && updated.length > 0) {
        setCurrentSessionId(updated[0].id);
        const loaded = await cloudStorageAdapter.getMessages(updated[0].id);
        setMessages(loaded || []);
      } else {
        const newSess = await cloudStorageAdapter.createSession(`Sesi Belajar #1`);
        setSessions([newSess]);
        setCurrentSessionId(newSess.id);
        setMessages([]);
      }
    }
  };

  const handleSend = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            hintLevel,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data: ChatResponse = await response.json();

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: Date.now(),
          isEureka: data.isEureka,
          eurekaSummary: data.eurekaSummary,
          jailbreakBlocked: data.jailbreakBlocked,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update misconceptions
        if (data.misconceptions && data.misconceptions.length > 0) {
          setMisconceptions((prev) => {
            const updated = [...prev];
            data.misconceptions!.forEach((topic) => {
              const existing = updated.find((m) => m.topic === topic);
              if (existing) {
                existing.count += 1;
                existing.lastSeen = Date.now();
              } else {
                updated.push({
                  topic,
                  count: 1,
                  lastSeen: Date.now(),
                  icon: '📌',
                });
              }
            });
            return updated;
          });
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            '⚠️ Maaf, terjadi kesalahan saat menghubungi Gemma. Silakan coba lagi.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, hintLevel]
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      <Header />

      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Left Sidebar — Hint Meter & Multi-Session History */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl overflow-y-auto scrollbar-thin">
          <HintMeter level={hintLevel} onChange={setHintLevel} />

          {/* Session List */}
          <div className="px-4 py-2 border-t border-white/5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Riwayat Percakapan
              </span>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-800/60 px-1.5 py-0.5 rounded">
                {sessions.length}
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {sessions.map((sess) => {
                const isActive = sess.id === currentSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => handleSelectSession(sess.id)}
                    className={`group w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isActive ? <MessageCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 shrink-0" /> : <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                      <span className="text-xs font-medium truncate" title={sess.name}>
                        {sess.name}
                      </span>
                    </div>
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteSession(e, sess.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                        title="Hapus sesi ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 mt-auto py-4 space-y-2.5 border-t border-white/5 bg-slate-950/80">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Cheat Sheet</span>
            </button>

            <button
              onClick={handleNewChat}
              disabled={messages.length === 0}
              title={messages.length === 0 ? 'Sesi saat ini masih kosong' : 'Buat percakapan baru'}
              className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
                messages.length === 0
                  ? 'bg-slate-800/40 border border-white/5 text-slate-600 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-400/30 text-white hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Percakapan Baru</span>
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <ChatArea messages={messages} isLoading={isLoading} />
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </main>

        {/* Right Sidebar — Misconception Radar */}
        <aside className="hidden xl:flex flex-col w-72 border-l border-white/5 bg-slate-950/50 backdrop-blur-xl overflow-y-auto scrollbar-thin">
          <MisconceptionRadar misconceptions={misconceptions} />
        </aside>

        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-20 right-4 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          title="Buka menu pengaturan & riwayat"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Mobile Sidebar Overlay with Smooth Sliding Animation */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="absolute right-0 top-16 bottom-0 w-[85vw] max-w-xs sm:w-80 bg-slate-950 border-l border-white/10 overflow-y-auto flex flex-col shadow-2xl shadow-cyan-500/10"
                onClick={(e) => e.stopPropagation()}
              >
                <HintMeter level={hintLevel} onChange={setHintLevel} />

                <div className="border-t border-white/5 px-4 py-2 flex-1 flex flex-col min-h-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Riwayat Percakapan ({sessions.length})
                  </span>
                  <div className="space-y-1.5 overflow-y-auto flex-1 scrollbar-thin">
                    {sessions.map((sess) => {
                      const isActive = sess.id === currentSessionId;
                      return (
                        <div
                          key={sess.id}
                          onClick={() => handleSelectSession(sess.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isActive
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                              : 'bg-slate-900/40 border-white/5 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isActive ? <MessageCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 shrink-0" /> : <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                            <span className="text-xs font-medium truncate">{sess.name}</span>
                          </div>
                          {sessions.length > 1 && (
                            <button
                              onClick={(e) => handleDeleteSession(e, sess.id)}
                              className="p-1 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/5" />
                <MisconceptionRadar misconceptions={misconceptions} />
                <div className="p-4 mt-auto border-t border-white/5 space-y-2 bg-slate-950/90">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setIsExportModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export Cheat Sheet</span>
                  </button>
                  <button
                    onClick={handleNewChat}
                    disabled={messages.length === 0}
                    title={messages.length === 0 ? 'Sesi saat ini masih kosong' : 'Buat percakapan baru'}
                    className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
                      messages.length === 0
                        ? 'bg-slate-800/40 border border-white/5 text-slate-600 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-cyan-500/20'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Percakapan Baru</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EurekaExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        messages={messages}
      />
    </div>
  );
}

