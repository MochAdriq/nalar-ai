'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Radio } from 'lucide-react';

// Declare Web Speech API types for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'id-ID'; // Default to Indonesian, also understands English terms

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onTranscript(transcript);
          }
          setIsRecording(false);
        };

        rec.onerror = (event: any) => {
          if (event.error === 'no-speech') {
            // Silence detected; this is normal when user doesn't speak promptly
            console.info('Mikrofon tidak mendeteksi suara (no-speech).');
          } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            alert('Izin mikrofon ditolak oleh browser. Mohon aktifkan akses mikrofon di pengaturan browser kamu.');
          } else {
            console.warn('Speech recognition status:', event.error);
          }
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        setRecognition(rec);
      }
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Maaf, browser kamu tidak mendukung fitur mikrofon (Web Speech API). Coba gunakan Chrome/Edge.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsRecording(false);
      }
    }
  };

  // During SSR and initial client hydration, render a consistent disabled button
  if (!isMounted) {
    return (
      <button
        type="button"
        disabled
        className="p-2 rounded-xl bg-white/5 text-slate-600 opacity-40 cursor-not-allowed flex items-center justify-center"
      >
        <Mic className="w-4 h-4 text-slate-500" />
      </button>
    );
  }

  // After mount, if browser doesn't support Web Speech API, hide the button
  if (!recognition) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      disabled={disabled}
      title={isRecording ? 'Berhenti merekam' : 'Bicara dengan Nalar.AI'}
      className={`p-2 rounded-xl transition-all flex items-center justify-center ${
        isRecording
          ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse shadow-lg shadow-red-500/20'
          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {isRecording ? <Radio className="w-4 h-4 text-red-400 animate-pulse" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
