import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export default function SyntheticBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-amber-950/90 border-b border-indigo-500/20 px-4 py-2 text-xs text-slate-300 flex items-center justify-between z-20">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40 tracking-wider uppercase text-[10px]">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          Synthetic Demo Data
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Nirikshan-AI is operating in simulated intelligence mode with realistic MPLADS project scenarios. Risk alerts represent AI decision-support indicators, not confirmed legal or fraud findings.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-1 rounded transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
