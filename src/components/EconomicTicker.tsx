import React from 'react';
import { GameState, MarketSentiment } from '../types/game';
import { TrendingUp, TrendingDown, Activity, Flame, ShieldAlert, Zap } from 'lucide-react';

interface EconomicTickerProps {
  state: GameState;
}

export const EconomicTicker: React.FC<EconomicTickerProps> = ({ state }) => {
  const getSentimentBadge = (sentiment: MarketSentiment) => {
    switch (sentiment) {
      case 'BOOM':
        return {
          label: 'EUPHORIA BOOM',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />,
        };
      case 'BULL':
        return {
          label: 'BULL MARKET',
          bg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          icon: <TrendingUp className="w-3.5 h-3.5 text-teal-400" />,
        };
      case 'NORMAL':
        return {
          label: 'STEADY EXPANSION',
          bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          icon: <Activity className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 'BEAR':
        return {
          label: 'BEAR MARKET',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          icon: <TrendingDown className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'CRASH':
        return {
          label: 'PANIC CRASH',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />,
        };
      case 'STAGFLATION':
        return {
          label: 'STAGFLATION',
          bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: <Zap className="w-3.5 h-3.5 text-purple-400" />,
        };
    }
  };

  const badge = getSentimentBadge(state.sentiment);

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 overflow-hidden">
      
      {/* Macro Indicators */}
      <div className="flex items-center gap-3 shrink-0">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-bold text-[11px] tracking-wider uppercase ${badge.bg}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span>Inflation:</span>
          <span className="font-mono font-bold text-amber-400">
            {(state.inflationRate * 100).toFixed(1)}%
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <span>Fed Rate:</span>
          <span className="font-mono font-bold text-cyan-400">
            {(state.interestRate * 100).toFixed(1)}%
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-slate-400">
          <span>HYSA Savings Yield:</span>
          <span className="font-mono font-bold text-emerald-400">
            {(state.hysaInterestRate * 100).toFixed(1)}% APY
          </span>
        </div>
      </div>

      {/* Scrolling News Ticker */}
      <div className="flex-1 min-w-[200px] overflow-hidden relative">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300 shrink-0">
            WIRE
          </span>
          <p className="text-slate-300 truncate font-medium text-[11px] italic">
            "{state.economicHeadline}"
          </p>
        </div>
      </div>

      {/* Turn indicator */}
      <div className="shrink-0 text-slate-400 font-mono text-[11px]">
        Year <span className="font-bold text-white">{Math.floor((state.month - 1) / 12) + 1}</span>, Qtr{' '}
        <span className="font-bold text-emerald-400">{(((state.month - 1) / 3) % 4) + 1}</span>
        {' '}(Age {state.character.age})
      </div>

    </div>
  );
};
