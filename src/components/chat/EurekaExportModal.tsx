'use client';

import React from 'react';
import { ChatMessage } from '@/lib/types';
import { FileText, X, Lightbulb, XCircle, CheckCircle2, Copy, Printer } from 'lucide-react';

interface EurekaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export default function EurekaExportModal({ isOpen, onClose, messages }: EurekaExportModalProps) {
  if (!isOpen) return null;

  const eurekaMessages = messages.filter((m) => m.isEureka && m.eurekaSummary);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# Nalar.AI — Rangkuman Belajar Sokratis\n\n`;
    md += `> "Think First. Code Right." · Powered by Gemma 4 31B\n\n---\n\n`;

    if (eurekaMessages.length === 0) {
      md += `Belum ada momen Eureka yang tercatat dalam sesi ini.\n`;
    } else {
      eurekaMessages.forEach((msg, idx) => {
        const sum = msg.eurekaSummary!;
        md += `### ${idx + 1}. ${sum.conceptMastered}\n`;
        md += `- **[Miskonsepsi Awal]** ${sum.misconception}\n`;
        md += `- **[Aturan Utama / Takeaway]** ${sum.keyTakeaway}\n\n`;
      });
    }

    navigator.clipboard.writeText(md);
    alert('Rangkuman berhasil disalin ke papan klip (Clipboard) dalam format Markdown!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Nalar.AI Eureka Sheet</h2>
              <p className="text-xs text-slate-400">Rangkuman konsep dan aturan yang berhasil kamu kuasai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {eurekaMessages.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-xl bg-slate-950/30">
              <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">Belum ada Eureka Moment tercatat</p>
              <p className="text-xs text-slate-500 mt-1">
                Jawab pertanyaan Sokratis dari Nalar.AI sampai kamu menemukan solusinya untuk mendapatkan rangkuman di sini!
              </p>
            </div>
          ) : (
            eurekaMessages.map((msg, index) => {
              const summary = msg.eurekaSummary!;
              return (
                <div
                  key={msg.id}
                  className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/30 to-indigo-950/30 border border-cyan-500/20 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold shrink-0 mt-0.5">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-cyan-300 mb-2">
                        {summary.conceptMastered}
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-red-400 block mb-0.5">Miskonsepsi Awal:</span>
                            {summary.misconception}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-emerald-400 block mb-0.5">Key Takeaway Rule:</span>
                            {summary.keyTakeaway}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-slate-950/60">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Powered by Gemma 4 31B · Build with Gemma Hackathon 2026
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleCopyMarkdown}
              disabled={eurekaMessages.length === 0}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:pointer-events-none border border-white/5 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Markdown</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={eurekaMessages.length === 0}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
