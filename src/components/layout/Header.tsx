'use client';

import { useState, useEffect } from 'react';
import Logo from '../ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { HardDrive, Cloud, LogIn, Home as HomeIcon } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    try {
      const sb = createClient();
      setSupabase(sb);

      sb.auth.getUser().then(({ data }: { data: any }) => {
        setUser(data?.user ?? null);
      });

      const { data: { subscription } } = sb.auth.onAuthStateChange((_: any, session: any) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Supabase credentials not set or client offline
    }
  }, []);

  const handleLogin = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="h-full max-w-screen-2xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
        <div className="shrink-0 scale-90 sm:scale-100 origin-left">
          <Logo size="default" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">
              Gemma 4 · 31B
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs">
              <span className="text-indigo-300 font-medium flex items-center gap-1.5" title="Tersinkronisasi ke Cloud Supabase">
                <Cloud className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="hidden sm:inline">Cloud ({user.user_metadata?.full_name || user.email?.split('@')[0]})</span>
                <span className="sm:hidden">Cloud</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors ml-1 font-semibold border-l border-indigo-500/30 pl-2 sm:border-none sm:pl-0"
                title="Keluar / Switch ke Guest Mode"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-medium" title="Riwayat tersimpan otomatis di perangkat ini">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline">Guest Mode (Local)</span>
                <span className="sm:hidden">Local</span>
              </div>
              <button
                onClick={handleLogin}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-sm"
                title="Login dengan Google untuk sinkronisasi cloud"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
                <span className="hidden sm:inline">Login Google</span>
                <span className="sm:hidden">Login</span>
              </button>
            </div>
          )}

          <a
            href="/"
            title="Ke Beranda / Home"
            className="text-slate-400 hover:text-white transition-colors p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1 text-sm"
          >
            <HomeIcon className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Home</span>
          </a>
        </div>
      </div>
    </header>
  );
}
