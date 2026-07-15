'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { Brain, Sliders, Lightbulb, Radar, Settings, Code2, MessageSquare, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 to-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 to-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-screen-xl mx-auto px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-md">
        <Logo size="default" />
        <Link
          href="/dashboard"
          className="text-sm font-semibold px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex items-center gap-2"
        >
          <span>Mulai Belajar</span>
          <span className="text-cyan-400">→</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 md:pt-28 pb-24 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center"
        >
          {/* Floating Hackathon Pill */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 shadow-lg shadow-cyan-500/10 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>🏆 Build with Gemma AI Hackathon 2026</span>
          </motion.div>

          <div className="relative w-full flex flex-col items-center justify-center mb-6">
            {/* Subtle Title Backglow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-2xl opacity-50 -z-10" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] text-center">
              <span className="text-white drop-shadow-sm">Think First.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                Code Right.
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Tutor AI Sokratis yang{' '}
            <span className="text-cyan-400 font-semibold underline decoration-cyan-500/40 decoration-wavy underline-offset-4">
              tidak pernah memberi jawaban langsung
            </span>
            . Nalar.AI membimbing kamu menemukan solusi sendiri melalui pertanyaan pemandu,
            analogi, dan hint bertingkat.
          </p>

          {/* Centered CTA Buttons with Idle Breathing Glow */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <motion.button
                animate={{
                  boxShadow: [
                    '0 0 25px rgba(6, 182, 212, 0.35)',
                    '0 0 45px rgba(6, 182, 212, 0.65)',
                    '0 0 25px rgba(6, 182, 212, 0.35)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base border border-cyan-400/30 transition-all flex items-center justify-center gap-2.5"
              >
                <Brain className="w-5 h-5 text-cyan-200" />
                <span>Mulai Belajar Gratis</span>
              </motion.button>
            </Link>
            <a
              href="https://ai.google.dev/gemma"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-slate-800 hover:border-white/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md shadow-sm"
            >
              <span>Powered by Gemma 4</span>
              <span className="text-slate-400">→</span>
            </a>
          </div>
        </motion.div>

        {/* Feature Cards with Staggered Idle Floating */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {[
            {
              icon: <Sliders className="w-7 h-7 text-red-400" />,
              title: 'Hint Meter',
              desc: 'Atur level bantuan AI: dari Sokratis murni hingga step-by-step breakdown yang terstruktur.',
              gradient: 'from-red-500/10 via-slate-900/90 to-amber-500/10',
              border: 'border-red-500/20 hover:border-red-500/50',
              glow: 'hover:shadow-red-500/10',
              badge: '3 Levels',
              badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
            },
            {
              icon: <Lightbulb className="w-7 h-7 text-emerald-400" />,
              title: 'Eureka Moment',
              desc: 'Deteksi otomatis saat kamu berhasil paham, lengkap dengan summary card & ekspor cheat sheet.',
              gradient: 'from-emerald-500/10 via-slate-900/90 to-cyan-500/10',
              border: 'border-emerald-500/20 hover:border-emerald-500/50',
              glow: 'hover:shadow-emerald-500/10',
              badge: 'AI Detection',
              badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            },
            {
              icon: <Radar className="w-7 h-7 text-indigo-400" />,
              title: 'Misconception Radar',
              desc: 'Lacak topik-topik yang sering salah dan pantau progres belajar pemrograman secara real-time.',
              gradient: 'from-indigo-500/10 via-slate-900/90 to-purple-500/10',
              border: 'border-indigo-500/20 hover:border-indigo-500/50',
              glow: 'hover:shadow-indigo-500/10',
              badge: 'Live Analytics',
              badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                delay: i * 0.7,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.03, y: -10 }}
              className={`group p-7 rounded-3xl bg-gradient-to-br ${feature.gradient} border ${feature.border} backdrop-blur-xl transition-all duration-500 shadow-xl ${feature.glow} flex flex-col justify-between text-left relative overflow-hidden`}
            >
              {/* Corner ambient shine */}
              <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                    {feature.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {feature.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                <span>Pelajari Lebih Lanjut</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How it works with Floating Idle & Glowing Connectors */}
        <div className="mt-32 max-w-5xl mx-auto w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-400 text-xs uppercase tracking-widest mb-3">
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workflow</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14">
            Bagaimana{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Nalar.AI
            </span>{' '}
            Bekerja?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', icon: <Code2 className="w-7 h-7 text-cyan-400" />, title: 'Input Masalah', desc: 'Kamu kirim kode error, bug, atau soal yang sulit' },
              { step: '02', icon: <Brain className="w-7 h-7 text-indigo-400" />, title: 'Gemma Reasoning', desc: 'AI mendeteksi di mana tepatnya logikamu keliru' },
              { step: '03', icon: <MessageSquare className="w-7 h-7 text-blue-400" />, title: 'Socratic Hint', desc: 'AI memberikan pertanyaan pemandu tanpa bocoran' },
              { step: '04', icon: <Sparkles className="w-7 h-7 text-emerald-400" />, title: 'Eureka Moment!', desc: 'Kamu perbaiki sendiri dan dapat summary pemahaman' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
                className="group relative p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 text-center flex flex-col items-center backdrop-blur-md shadow-lg"
              >
                {/* Step number badge top right */}
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400">
                  {item.step}
                </div>

                <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300 shadow-inner">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 text-center backdrop-blur-lg bg-slate-950/80">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-cyan-400" /> Nalar.AI</span>
            <span>·</span>
            <span className="text-cyan-400">Socratic AI Tutor</span>
          </div>
          <p>
            Built with <span className="text-white font-semibold">Gemma 4 31B</span> for Build with Gemma AI Hackathon 2026
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <a href="https://ai.google.dev/gemma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Google AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
