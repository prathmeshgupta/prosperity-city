import React from 'react';
import { GameState } from '../../types/game';
import { getNetWorth, getPortfolioValue } from '../../engine/gameEngine';
import { Trophy, BarChart3, PieChart, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PortfolioAnalyticsProps {
  state: GameState;
}

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({ state }) => {
  const netWorth = getNetWorth(state);
  const portfolioVal = getPortfolioValue(state);

  // Calculate allocation by category
  const allocationByCategory: Record<string, number> = {
    'Checking Cash': state.cash,
    'Emergency HYSA': state.emergencyFund,
    'Retirement 401(k)': state.retirement.traditional401k,
  };

  for (const pos of state.portfolio) {
    const asset = state.assets.find((a) => a.id === pos.assetId);
    if (asset) {
      const catName = asset.category.replace('_', ' ');
      allocationByCategory[catName] = (allocationByCategory[catName] || 0) + pos.shares * asset.currentPrice;
    }
  }

  const totalGrossAssets = Object.values(allocationByCategory).reduce((a, b) => a + b, 0) || 1;

  // History timeline data
  const history = state.history;
  const maxHistoryNW = Math.max(...history.map((h) => h.netWorth), 10000);
  const minHistoryNW = Math.min(...history.map((h) => h.netWorth), 0);

  // SVG dimensions for net worth chart
  const w = 700;
  const h = 220;
  const pad = 40;

  const getHistoryX = (idx: number) => pad + (idx / Math.max(1, history.length - 1)) * (w - pad * 2);
  const getHistoryY = (val: number) => {
    const range = maxHistoryNW - minHistoryNW || 1;
    return h - pad - ((val - minHistoryNW) / range) * (h - pad * 2);
  };

  const historyPath = history
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getHistoryX(i)} ${getHistoryY(pt.netWorth)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>Wealth Velocity & Achievements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Portfolio Analytics & Lifetime Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your asset allocation, historical compounding curve, and unlocked life milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-slate-800">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Trophies Unlocked</span>
            <div className="font-mono text-base font-extrabold text-white">
              {state.achievements.filter((a) => a.unlockedAt).length} / {state.achievements.length}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Net Worth Trajectory Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Net Worth Trajectory Over Time
        </h3>

        <div className="w-full overflow-x-auto bg-slate-950/80 rounded-xl p-3 border border-slate-800">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto min-w-[500px]">
            {/* Horizontal Grid */}
            {[0, 0.5, 1].map((pct, idx) => {
              const y = h - pad - pct * (h - pad * 2);
              const val = minHistoryNW + pct * (maxHistoryNW - minHistoryNW);
              return (
                <g key={idx}>
                  <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  <text x={pad - 6} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                    ${Math.round(val / 1000)}k
                  </text>
                </g>
              );
            })}

            {/* Line */}
            <path d={historyPath} fill="none" stroke="#10b981" strokeWidth="3" />

            {/* Data nodes */}
            {history.map((pt, i) => (
              <circle
                key={i}
                cx={getHistoryX(i)}
                cy={getHistoryY(pt.netWorth)}
                r={3.5}
                fill="#34d399"
                stroke="#0b0f19"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Asset Allocation Breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-cyan-400" />
          Asset Allocation Breakdown
        </h3>

        <div className="space-y-3">
          {Object.entries(allocationByCategory)
            .filter(([_, val]) => val > 0)
            .map(([cat, val]) => {
              const pct = (val / totalGrossAssets) * 100;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{cat}</span>
                    <span className="font-mono text-slate-400 font-bold">
                      ${Math.round(val).toLocaleString()} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-400" />
          Hall of Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.achievements.map((ach) => {
            const isUnlocked = Boolean(ach.unlockedAt);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-50'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                    {isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>
                  <span className="text-[10px] font-bold text-amber-400 font-mono mt-1.5 block">
                    +{ach.rewardXP} XP {isUnlocked && `• Unlocked Month ${ach.unlockedAt}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
