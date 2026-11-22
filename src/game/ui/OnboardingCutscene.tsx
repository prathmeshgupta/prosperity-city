import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { soundFx } from '../../audio/soundFx';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Award,
  Zap,
  Building,
  PiggyBank,
  AlertTriangle
} from 'lucide-react';

interface OnboardingCutsceneProps {
  state?: GameState;
  onUpdateState?: (newState: GameState) => void;
  playerName: string;
  avatarEmoji: string;
  careerTitle: string;
  startingCash: number;
  onFinish: () => void;
}

export const OnboardingCutscene: React.FC<OnboardingCutsceneProps> = ({
  state,
  onUpdateState,
  playerName,
  avatarEmoji,
  careerTitle,
  startingCash,
  onFinish,
}) => {
  // Bi-weekly paycheck estimate
  const salary = state?.character.annualSalary || 68000;
  const netPaycheck = Math.round((salary / 26) * 0.76); // ~76% take-home after federal, state & FICA

  // Choice selection
  const [selectedFork, setSelectedFork] = useState<'MATCH_AND_BUFFER' | 'DEBT_SNOWBALL' | 'LIFESTYLE'>('MATCH_AND_BUFFER');

  const handleConfirmAndEnter = () => {
    soundFx.playLevelUp();

    if (state && onUpdateState) {
      if (selectedFork === 'MATCH_AND_BUFFER') {
        // Option A: 6% 401(k) match capture ($150) + $400 to HYSA vault + bonus XP
        state.retirement.traditional401k += 300; // Employee $150 + Employer $150 match
        state.emergencyFund += 400;
        state.cash += (netPaycheck - 550);
        state.totalXP += 45;
        state.recentEvents.unshift({
          month: state.month,
          text: `Paycheck #1: Captured 100% employer 401(k) match (+$300) and deposited $400 to High-Yield Vault! (+45 XP)`,
          type: 'positive',
        });
      } else if (selectedFork === 'DEBT_SNOWBALL') {
        // Option B: Aggressive debt snowball ($700 to highest debt)
        const targetDebt = state.debts[0];
        if (targetDebt) {
          targetDebt.principal = Math.max(0, targetDebt.principal - 700);
        }
        state.cash += (netPaycheck - 700);
        state.totalXP += 35;
        state.character.creditScore = Math.min(850, state.character.creditScore + 5);
        state.recentEvents.unshift({
          month: state.month,
          text: `Paycheck #1: Accelerated debt payoff! Paid $700 directly to principal and boosted credit score! (+35 XP)`,
          type: 'positive',
        });
      } else {
        // Option C: Lifestyle Celebration
        state.cash += (netPaycheck - 650);
        state.character.happiness = Math.min(100, state.character.happiness + 15);
        state.totalXP += 10;
        state.recentEvents.unshift({
          month: state.month,
          text: `Paycheck #1: Celebrated arrival in luxury style! (+15 Happiness, zero initial savings buffer).`,
          type: 'info',
        });
      }

      onUpdateState({ ...state });
    }

    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel max-w-2xl w-full rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-2xl space-y-5 relative overflow-hidden max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Ambient Top Glow Accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Character Dossier Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
                {avatarEmoji}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                  Prosperity City Metropolitan Arrival
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {playerName}
              </h2>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-bold">{careerTitle}</span>
                <span>•</span>
                <span>Annual: <strong className="text-white">${salary.toLocaleString()}/yr</strong></span>
                <span>•</span>
                <span>Starting Cash: <strong className="text-cyan-400">${startingCash.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-right font-mono text-[11px]">
            <span className="text-slate-400 block uppercase">Starter Residence</span>
            <span className="text-slate-200 font-bold">Oak Grove Studio #4B</span>
          </div>
        </div>

        {/* Narrative Atmosphere Paragraph */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            You step out of the Central Station onto the bustling avenue. Across the skyline, 
            the <strong>Wall Street LED ticker</strong> flashes market returns, the glass curtain walls of 
            <strong> Silicon Forge</strong> reflect the afternoon sun, and the marble fountain chimes in the plaza.
          </p>
          <p>
            Your ultimate goal: <strong>Financial Independence (FIRE)</strong>. Accumulate a <strong>$1,000,000 Net Worth</strong> or generate <strong>$4,000/mo in passive cashflow</strong> from index funds and rental properties to ring the Golden Freedom Bell!
          </p>
        </div>

        {/* LIVE DECISION FORK #1 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Decision Fork #1: First Paycheck Allocation</span>
            </span>
            <span className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
              Net Bi-Weekly Check: <strong className="text-emerald-400">${netPaycheck.toLocaleString()}</strong>
            </span>
          </div>

          <div className="space-y-2">
            {/* Choice A: Capture 401(k) Match + HYSA Buffer */}
            <button
              onClick={() => setSelectedFork('MATCH_AND_BUFFER')}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                selectedFork === 'MATCH_AND_BUFFER'
                  ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedFork === 'MATCH_AND_BUFFER'
                  ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                  : 'border-slate-600'
              }`}>
                {selectedFork === 'MATCH_AND_BUFFER' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white">
                    Capture 100% Employer 401(k) Match + Seed High-Yield Vault (Recommended)
                  </strong>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    +45 XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Allocate $150 to employer 401(k) (instantly doubled to $300 by company match) and deposit $400 into your 4.5% APY High-Yield Savings Vault. The remaining ${netPaycheck - 550} flows into checking.
                </p>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                  ✓ Guaranteed 100% immediate ROI on match • Begins 3-month emergency shield
                </span>
              </div>
            </button>

            {/* Choice B: Aggressive Debt Snowball */}
            <button
              onClick={() => setSelectedFork('DEBT_SNOWBALL')}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                selectedFork === 'DEBT_SNOWBALL'
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedFork === 'DEBT_SNOWBALL'
                  ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                  : 'border-slate-600'
              }`}>
                {selectedFork === 'DEBT_SNOWBALL' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white">
                    Aggressive Debt Snowball: Direct $700 to Principal
                  </strong>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    +35 XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Crush high-interest liabilities immediately to eliminate compounding debt drag. Applies $700 directly against loan principal and boosts your FICO credit score (+5 pts).
                </p>
                <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
                  ✓ Eliminates monthly interest drag • Boosts FICO credit score
                </span>
              </div>
            </button>

            {/* Choice C: Lifestyle Celebration */}
            <button
              onClick={() => setSelectedFork('LIFESTYLE')}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                selectedFork === 'LIFESTYLE'
                  ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedFork === 'LIFESTYLE'
                  ? 'border-amber-400 bg-amber-500 text-slate-950'
                  : 'border-slate-600'
              }`}>
                {selectedFork === 'LIFESTYLE' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white">
                    Lifestyle Celebration: Luxury Wardrobe & High-End Dinner ($650)
                  </strong>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    +10 XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Reward your hard work with immediate gratification. Boosts Happiness (+15 pts), but leaves zero emergency buffer and forfeits employer 401(k) matching dollars.
                </p>
                <span className="text-[10px] text-amber-400 font-mono mt-1 block">
                  ⚠️ High instant dopamine • Leaves you vulnerable to unexpected financial shocks
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Immediate Next Objectives */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Active Objective: Follow the <strong>Glowing Cyan GPS Route</strong> to <strong>Your Starter Studio Apartment</strong>.</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Oak Grove #4B</span>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleConfirmAndEnter}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>CONFIRM ALLOCATION & ENTER PROSPERITY CITY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
