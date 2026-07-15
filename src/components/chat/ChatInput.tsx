'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import VoiceButton from './VoiceButton';
import { Brain } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    if (textareaRef.current) {
      setTimeout(() => handleInput(), 50);
    }
  };

  return (
    <div className="border-t border-white/5 bg-slate-950/80 backdrop-blur-xl p-2.5 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-1.5 sm:gap-2 bg-slate-800/60 border border-white/10 rounded-2xl p-1.5 sm:p-2 focus-within:border-cyan-500/30 focus-within:shadow-lg focus-within:shadow-cyan-500/5 transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Tulis pertanyaan atau klik mikrofon..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-xs sm:text-sm resize-none outline-none px-2 sm:px-3 py-2 max-h-40 scrollbar-thin"
          />

          <VoiceButton onTranscript={handleVoiceTranscript} disabled={isLoading} />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-600 mt-2">
          <span className="hidden sm:inline">Nalar.AI menggunakan Gemma 4 31B · Tidak akan memberi jawaban langsung</span>
          <span className="sm:hidden">Socratic AI Tutor · Gemma 4 31B</span>
          <Brain className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
        </p>
      </div>
    </div>
  );
}
