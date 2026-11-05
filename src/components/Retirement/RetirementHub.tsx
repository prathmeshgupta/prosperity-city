import React from 'react';
import { GameState } from '../../types/game';
import { getNetWorth } from '../../engine/gameEngine';
import { soundFx } from '../../audio/soundFx';
import { Gift, Flame, Sparkles, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface RetirementHubProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const RetirementHub: React.FC<RetirementHubProps> = ({ state, onUpdateState }) => {
  const currentSalary = state.character.annualSalary;
  const contributionPct = state.retirement.employee401kContributionPct;
  const matchLimitPct = state.retirement.employerMatchLimitPct;
  const matchRate = state.retirement.employerMatchRate;

  // Annual dollar math
  const employeeAnnual = currentSalary * contributionPct;
  const matchablePct = Math.min(contributionPct, matchLimitPct);
  const employerAnnualMatch = currentSalary * matchablePct * matchRate;
  const totalAnnualDeposited = employeeAnnual + employerAnnualMatch;

  // FIRE Calculator
  const netWorth = getNetWorth(state);
  const lifestyleExpenseRatio =
    state.character.lifestyleLevel === 'FRUGAL' ? 0.35 :
    state.character.lifestyleLevel === 'BALANCED' ? 0.50 :
    state.character.lifestyleLevel === 'COMFORTABLE' ? 0.65 : 0.85;
  const annualLivingExpenses = currentSalary * lifestyleExpenseRatio;
  const fireNumber = Math.round(annualLivingExpenses * 25);
  const fireProgress = Math.max(0, Math.min(100, Math.round((netWorth / fireNumber) * 100)));

  const handleSliderChange = (newPct: number) => {
    soundFx.playClick();
    state.retirement.employee401kContributionPct = newPct;
    onUpdateState({ ...state });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: FIRE Freedom Number */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Financial Independence & FIRE Target (4% Rule)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Your Freedom Number:{' '}
              <span className="font-mono text-emerald-400">
                ${fireNumber.toLocaleString()}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Based on your lifestyle expenses (${Math.round(annualLivingExpenses).toLocaleString()}/yr), reaching ${fireNumber.toLocaleString()} means your investments generate enough passive withdrawals forever without you ever needing a job again.
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-slate-400 block">FIRE Progress</span>
            <span className="font-mono text-3xl font-extrabold text-white">
              {fireProgress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700"
            style={{ width: `${fireProgress}%` }}
          />
        </div>
      </div>

      {/* 401(k) Match Optimizer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">401(k) Employer Free Match Optimizer</h3>
              <p className="text-xs text-slate-400">
                Company matches 50% on contributions up to 6% of salary. Instant 50% guaranteed return!
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 font-bold border border-purple-500/25">
            Pre-Tax Compounding
          </span>
        </div>

        {/* Current 401(k) Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-0.5">Total 401(k) Balance</span>
            <span className="font-mono text-xl font-bold text-purple-300">
              ${Math.round(state.retirement.traditional401k).toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-0.5">Your Annual Contribution</span>
            <span className="font-mono text-xl font-bold text-white">
              ${Math.round(employeeAnnual).toLocaleString()} / yr
            </span>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-0.5">Free Employer Match Bonus</span>
            <span className="font-mono text-xl font-bold text-emerald-400">
              +${Math.round(employerAnnualMatch).toLocaleString()} / yr
            </span>
          </div>
        </div>

        {/* Interactive Contribution Slider */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your 401(k) Contribution Rate
            </span>
            <span className="font-mono font-extrabold text-base text-emerald-400">
              {Math.round(contributionPct * 100)}% of Salary
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={0.15}
            step={0.01}
            value={contributionPct}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
            <span>0% (No match)</span>
            <span className="text-purple-400 font-bold">6% (Full match threshold)</span>
            <span>15% (Aggressive)</span>
          </div>

          {contributionPct < matchLimitPct ? (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                ⚠️ You are leaving <strong>${Math.round((matchLimitPct - contributionPct) * currentSalary * matchRate).toLocaleString()}</strong> of free employer money on the table each year! Increase your rate to at least 6%.
              </span>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                🎉 Perfect! You are capturing 100% of the maximum employer match. Free money unlocked!
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
