import React from 'react';
import { GameState } from '../../types/game';
import { getNetWorth, getPortfolioValue } from '../../engine/gameEngine';
import { Wallet, Landmark, PiggyBank, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';

interface NetWorthCardProps {
  state: GameState;
  onOpenTransferModal: () => void;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ state, onOpenTransferModal }) => {
  const netWorth = getNetWorth(state);
  const portfolioVal = getPortfolioValue(state);
  const totalDebt = state.debts.reduce((sum, d) => sum + d.principal, 0);
  const retirementTotal = state.retirement.traditional401k + state.retirement.rothIRA;

  // Previous net worth for comparison
  const prevNetWorth =
    state.history.length > 1 ? state.history[state.history.length - 2].netWorth : netWorth;
  const netWorthDelta = netWorth - prevNetWorth;
  const netWorthDeltaPct = prevNetWorth !== 0 ? (netWorthDelta / Math.abs(prevNetWorth)) * 100 : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <span>Total Net Worth</span>
            {netWorthDelta !== 0 && (
              <span
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  netWorthDelta >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                <TrendingUp className={`w-3 h-3 ${netWorthDelta < 0 ? 'rotate-180' : ''}`} />
                {netWorthDelta >= 0 ? '+' : ''}${Math.round(netWorthDelta).toLocaleString()} ({netWorthDeltaPct.toFixed(1)}%)
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
              ${netWorth.toLocaleString()}
            </h1>
            <span className="text-xs text-slate-400 font-medium">USD</span>
          </div>
        </div>

        {/* Quick transfer button */}
        <button
          onClick={onOpenTransferModal}
          className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
        >
          <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
          <span>Move Money (Cash / HYSA)</span>
        </button>
      </div>

      {/* Asset & Liability Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Cash in Checking */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              Checking Cash
            </span>
          </div>
          <div className="font-mono text-base font-bold text-white">
            ${Math.round(state.cash).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Liquid operational funds</div>
        </div>

        {/* High-Yield Emergency Fund */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
              Emergency HYSA
            </span>
            <span className="text-[10px] font-bold text-emerald-400 font-mono">
              {(state.hysaInterestRate * 100).toFixed(1)}% APY
            </span>
          </div>
          <div className="font-mono text-base font-bold text-emerald-400">
            ${Math.round(state.emergencyFund).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Safe interest-earning shield</div>
        </div>

        {/* Invested Portfolio & Retirement */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-purple-400" />
              Invested Assets
            </span>
          </div>
          <div className="font-mono text-base font-bold text-purple-300">
            ${(portfolioVal + retirementTotal).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            Stocks, REITs, 401(k)
          </div>
        </div>

        {/* Total Debts */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-rose-400" />
              Total Debts
            </span>
            {totalDebt > 0 && (
              <AlertTriangle className="w-3 h-3 text-rose-400" />
            )}
          </div>
          <div className="font-mono text-base font-bold text-rose-400">
            ${Math.round(totalDebt).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            {state.debts.length} active balance{state.debts.length !== 1 ? 's' : ''}
          </div>
        </div>

      </div>
    </div>
  );
};
