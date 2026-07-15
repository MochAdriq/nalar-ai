'use client';

import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessage from './ChatMessage';
import EurekaCard from './EurekaCard';
import LoadingDots from '../ui/LoadingDots';
import { Brain, Lightbulb, Code2, Calculator, RefreshCw, Cpu } from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
            <div className="mb-4 flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 shadow-xl shadow-cyan-500/10 mx-auto">
              <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent mb-3">
              Selamat datang di Nalar.AI!
            </h2>
            <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
              Saya tutor Sokratis kamu. Saya tidak akan memberi jawaban langsung,
              tapi akan membimbing kamu menemukan jawabannya sendiri melalui
              pertanyaan-pertanyaan pemandu. <Lightbulb className="w-4 h-4 text-amber-400 inline ml-1" />
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
              {[
                {
                  icon: <Code2 className="w-6 h-6 text-cyan-400 shrink-0" />,
                  title: 'Debug Python',
                  desc: 'Tempel kode yang error dan saya bantu analisis',
                },
                {
                  icon: <Calculator className="w-6 h-6 text-indigo-400 shrink-0" />,
                  title: 'Matematika SMA',
                  desc: 'Aljabar, geometri, trigonometri, dan lainnya',
                },
                {
                  icon: <RefreshCw className="w-6 h-6 text-emerald-400 shrink-0" />,
                  title: 'Logika Loop',
                  desc: 'for, while, rekursi — tanya konsepnya!',
                },
                {
                  icon: <Cpu className="w-6 h-6 text-amber-400 shrink-0" />,
                  title: 'Algoritma',
                  desc: 'Sorting, searching, dan problem solving',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-cyan-500/20 hover:bg-slate-800/60 transition-all duration-300 cursor-default text-left"
                >
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage message={message} />
              {message.isEureka && message.eurekaSummary && (
                <EurekaCard summary={message.eurekaSummary} />
              )}
            </div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Brain className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800/60 border border-white/5">
                <LoadingDots />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
