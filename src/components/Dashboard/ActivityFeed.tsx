import React from 'react';
import { GameState } from '../../types/game';
import { History, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ActivityFeedProps {
  state: GameState;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ state }) => {
  const events = [...state.recentEvents].reverse().slice(0, 10);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Life & Wealth Ledger</span>
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">
          Month {state.month}
        </span>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {events.map((evt, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
              evt.type === 'positive'
                ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-300'
                : evt.type === 'negative'
                ? 'bg-rose-950/20 border-rose-800/30 text-rose-300'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
            }`}
          >
            {evt.type === 'positive' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
            {evt.type === 'negative' && <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />}
            {evt.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />}
            <span className="leading-snug">{evt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
