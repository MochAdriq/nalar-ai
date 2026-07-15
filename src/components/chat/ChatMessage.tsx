'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import { User, Brain, ShieldAlert, Square, Volume2 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeechToggle = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Maaf, browser kamu tidak mendukung fitur Voice (Web Speech API).');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, ' [block kode] '));
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}
    >
      <div className={`flex items-start gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/25'
              : 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-cyan-500/25'
          }`}
        >
          {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
        </div>

        {/* Message Container */}
        <div className="flex flex-col gap-1.5 w-full">
          {/* Security Guardrail Badge */}
          {!isUser && message.jailbreakBlocked && (
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-medium animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span>Socratic Guardrail Active: Permintaan jawaban langsung dicegah oleh Nalar.AI</span>
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`relative px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
              isUser
                ? 'bg-indigo-600/30 border border-indigo-500/20 text-indigo-50 rounded-tr-sm'
                : 'bg-slate-800/60 border border-white/5 text-slate-200 rounded-tl-sm'
            }`}
          >
            {renderContent(message.content)}

            {/* Voice Read Aloud Button for Assistant */}
            {!isUser && (
              <div className="flex justify-end mt-2 pt-2 border-t border-white/5">
                <button
                  onClick={handleSpeechToggle}
                  title={isSpeaking ? 'Hentikan suara' : 'Dengarkan penjelasan'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSpeaking
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isSpeaking ? (
                    <span className="flex items-center gap-1">
                      <Square className="w-3 h-3 fill-red-300 text-red-300" /> Stop Suara
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Dengarkan
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function renderContent(content: string) {
  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const language = lines[0]?.trim() || '';
      const code = lines.slice(1).join('\n');

      return (
        <div key={index} className="my-3 rounded-lg overflow-hidden border border-white/10">
          {language && (
            <div className="px-3 py-1.5 bg-slate-900 text-xs text-slate-400 font-mono border-b border-white/5">
              {language}
            </div>
          )}
          <pre className="p-3 bg-slate-950 text-cyan-300 text-xs font-mono overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Handle inline code
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={index}>
        {inlineParts.map((inline, i) => {
          if (inline.startsWith('`') && inline.endsWith('`')) {
            return (
              <code
                key={i}
                className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-500/20"
              >
                {inline.slice(1, -1)}
              </code>
            );
          }
          // Handle bold text
          const boldParts = inline.split(/(\*\*[^*]+\*\*)/g);
          return boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={`${i}-${j}`} className="text-white font-semibold">{bp.slice(2, -2)}</strong>;
            }
            return <span key={`${i}-${j}`}>{bp}</span>;
          });
        })}
      </span>
    );
  });
}
