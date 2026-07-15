'use client';

import { motion } from 'framer-motion';
import { EurekaSummary } from '@/lib/types';
import { Sparkles, Lightbulb, XCircle, CheckCircle2, Bookmark } from 'lucide-react';

interface EurekaCardProps {
  summary: EurekaSummary;
}

export default function EurekaCard({ summary }: EurekaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        scale: { type: 'spring', damping: 15, stiffness: 200 },
      }}
      className="my-6 mx-auto max-w-lg"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
        {/* Animated glow border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-400/20 to-indigo-500/20 blur-xl opacity-50 animate-pulse" />

        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#10B981', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899'][
                  i % 5
                ],
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-5"
          >
            <div className="flex justify-center items-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <Lightbulb className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Eureka Moment!
            </h3>
            <p className="text-xs text-slate-400 mt-1">Kamu berhasil memahami konsepnya!</p>
          </motion.div>

          {/* Cards */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
            >
              <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-red-400/80 font-semibold mb-1">
                  Miskonsepsi Awal
                </p>
                <p className="text-sm text-slate-300">{summary.misconception}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-semibold mb-1">
                  Konsep yang Dikuasai
                </p>
                <p className="text-sm text-slate-300">{summary.conceptMastered}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10"
            >
              <Bookmark className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-cyan-400/80 font-semibold mb-1">
                  Key Takeaway
                </p>
                <p className="text-sm text-cyan-200 font-mono">{summary.keyTakeaway}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
