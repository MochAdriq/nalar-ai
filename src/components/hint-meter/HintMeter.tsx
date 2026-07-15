'use client';

import { motion } from 'framer-motion';
import { HintLevel } from '@/lib/types';
import { Sliders, Flame, Lightbulb, LifeBuoy } from 'lucide-react';

interface HintMeterProps {
  level: HintLevel;
  onChange: (level: HintLevel) => void;
}

const levels = [
  {
    level: 1 as HintLevel,
    icon: <Flame className="w-4 h-4 text-red-400 shrink-0" />,
    label: 'Hardcore',
    desc: 'Pertanyaan Sokratis murni, tanpa petunjuk sama sekali.',
    color: 'from-red-500 to-orange-500',
    bgActive: 'bg-red-500/10 border-red-500/30',
    textColor: 'text-red-400',
  },
  {
    level: 2 as HintLevel,
    icon: <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />,
    label: 'Guided',
    desc: 'Analogi + pertanyaan pemandu untuk memahami konsep.',
    color: 'from-amber-500 to-yellow-500',
    bgActive: 'bg-amber-500/10 border-amber-500/30',
    textColor: 'text-amber-400',
  },
  {
    level: 3 as HintLevel,
    icon: <LifeBuoy className="w-4 h-4 text-emerald-400 shrink-0" />,
    label: 'SOS Breakdown',
    desc: 'Dipecah jadi langkah-langkah kecil, satu per satu.',
    color: 'from-emerald-500 to-cyan-500',
    bgActive: 'bg-emerald-500/10 border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
];

export default function HintMeter({ level, onChange }: HintMeterProps) {
  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
        <Sliders className="w-3.5 h-3.5 text-slate-400" />
        <span>Tingkat Bantuan</span>
      </h3>

      <div className="space-y-2">
        {levels.map((item) => {
          const isActive = level === item.level;

          return (
            <motion.button
              key={item.level}
              onClick={() => onChange(item.level)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${
                isActive
                  ? `${item.bgActive} shadow-lg`
                  : 'bg-slate-800/30 border-white/5 hover:border-white/10 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <span
                  className={`text-sm font-bold ${
                    isActive ? item.textColor : 'text-slate-300'
                  }`}
                >
                  Level {item.level}
                </span>
                <span
                  className={`text-xs ${
                    isActive ? item.textColor : 'text-slate-500'
                  }`}
                >
                  · {item.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed pl-7">
                {item.desc}
              </p>

              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="hint-indicator"
                  className={`mt-2 h-0.5 rounded-full bg-gradient-to-r ${item.color}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Visual meter */}
      <div className="mt-4 px-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i <= level
                  ? i === 1
                    ? 'bg-red-500'
                    : i === 2
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-slate-600">Sulit</span>
          <span className="text-[9px] text-slate-600">Mudah</span>
        </div>
      </div>
    </div>
  );
}
