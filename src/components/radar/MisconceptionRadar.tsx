'use client';

import { motion } from 'framer-motion';
import { MisconceptionEntry } from '@/lib/types';
import React from 'react';
import {
  Radar,
  Target,
  RefreshCw,
  GitBranch,
  Box,
  Tag,
  Settings,
  ClipboardList,
  Scissors,
  Hash,
  Copy,
  Ruler,
  BarChart2,
  TrendingDown,
  Puzzle,
  Map,
  Bookmark,
} from 'lucide-react';

interface MisconceptionRadarProps {
  misconceptions: MisconceptionEntry[];
}

const topicIcons: Record<string, React.ReactNode> = {
  'Loop Syntax': <RefreshCw className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
  'Conditional Logic': <GitBranch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
  'Variable Scope': <Box className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
  'Data Types': <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
  'Function Parameters': <Settings className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
  'Array/List Operations': <ClipboardList className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
  'String Manipulation': <Scissors className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
  'Operator Precedence': <Hash className="w-3.5 h-3.5 text-yellow-400 shrink-0" />,
  'Recursion': <Copy className="w-3.5 h-3.5 text-teal-400 shrink-0" />,
  'Math Algebra': <Ruler className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
  'Math Geometry': <Box className="w-3.5 h-3.5 text-indigo-400 shrink-0" />,
  'Math Trigonometry': <BarChart2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
  'Math Calculus': <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
  'Math Statistics': <BarChart2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
  'Logical Reasoning': <Puzzle className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
  'Algorithm Design': <Map className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
};

export default function MisconceptionRadar({ misconceptions }: MisconceptionRadarProps) {
  const sorted = [...misconceptions].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sorted.map((m) => m.count), 1);

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
        <Radar className="w-3.5 h-3.5 text-cyan-400" />
        <span>Misconception Radar</span>
      </h3>

      {sorted.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-8 h-8 text-slate-600 mx-auto mb-3 opacity-60" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Belum ada data miskonsepsi.
            <br />
            Mulai bertanya untuk melihat analitik!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((entry, index) => {
            const percentage = (entry.count / maxCount) * 100;
            const icon = topicIcons[entry.topic] || <Bookmark className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;

            return (
              <motion.div
                key={entry.topic}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
                      {entry.topic}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                    {entry.count}×
                  </span>
                </div>

                <div className="h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      percentage > 70
                        ? 'bg-gradient-to-r from-red-500 to-rose-400'
                        : percentage > 40
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-400'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats summary */}
      {sorted.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-slate-800/30">
              <div className="text-lg font-bold text-cyan-400">{sorted.length}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                Topik
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/30">
              <div className="text-lg font-bold text-amber-400">
                {sorted.reduce((sum, m) => sum + m.count, 0)}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                Total
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
