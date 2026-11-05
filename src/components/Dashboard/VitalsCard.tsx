import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { calculateFinancialHealth } from '../../engine/financialHealth';
import { soundFx } from '../../audio/soundFx';
import { 
  Smile, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface VitalsCardProps {
  state: GameState;
  onUpdateLifestyle: (level: GameState['character']['lifestyleLevel']) => void;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ state, onUpdateLifestyle }) => {
  const [showHealthModal, setShowHealthModal] = useState(false);
  const healthGrade = calculateFinancialHealth(state);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'B':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      case 'C':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'D':
      case 'F':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCreditScoreTier = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-emerald-400' };
    if (score >= 700) return { label: 'Good', color: 'text-teal-400' };
    if (score >= 650) return { label: 'Fair', color: 'text-amber-400' };
    return { label: 'Needs Rebuilding', color: 'text-rose-400' };
  };

  const creditTier = getCreditScoreTier(state.character.creditScore);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      <div>
        
        {/* Top Header: Character Identity */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              {state.character.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{state.character.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  Age {state.character.age}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {state.character.careerTitle} • ${(state.character.annualSalary).toLocaleString()}/yr
              </p>
            </div>
          </div>

          {/* Financial Health Grade Pill */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowHealthModal(true);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer hover:scale-105 ${getGradeColor(
              healthGrade.grade
            )}`}
            title="Inspect Financial Health Audit"
          >
            <span>Health Grade:</span>
            <span className="text-sm font-extrabold font-mono">{healthGrade.grade}</span>
            <Info className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Meters Grid: Happiness, Health, Credit Score */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          
          {/* Happiness */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                Happiness
              </span>
              <span className="font-bold text-slate-200">{state.character.happiness}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  state.character.happiness > 70
                    ? 'bg-amber-400'
                    : state.character.happiness > 40
                    ? 'bg-amber-500/80'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${state.character.happiness}%` }}
              />
            </div>
          </div>

          {/* Physical Health */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Health
              </span>
              <span className="font-bold text-slate-200">{state.character.health}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  state.character.health > 70
                    ? 'bg-rose-400'
                    : state.character.health > 40
                    ? 'bg-rose-500/80'
                    : 'bg-rose-600'
                }`}
                style={{ width: `${state.character.health}%` }}
              />
            </div>
          </div>

          {/* Credit Score */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Credit Score
              </span>
              <span className="font-bold text-slate-200">{state.character.creditScore}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${((state.character.creditScore - 300) / 550) * 100}%` }}
              />
            </div>
            <div className={`text-[10px] font-semibold mt-1 ${creditTier.color}`}>
              {creditTier.label}
            </div>
          </div>

        </div>

        {/* Lifestyle Creep & Expense Tuning */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Lifestyle & Spending Standard
            </span>
            <span className="text-[11px] text-slate-400">
              {state.character.lifestyleLevel === 'FRUGAL' && 'Saves ~65% of salary (High grit, low burn)'}
              {state.character.lifestyleLevel === 'BALANCED' && 'Saves ~50% of salary (Healthy balance)'}
              {state.character.lifestyleLevel === 'COMFORTABLE' && 'Saves ~35% of salary (Nice dining & travel)'}
              {state.character.lifestyleLevel === 'LUXURY' && 'Saves ~15% of salary (High lifestyle creep)'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {(['FRUGAL', 'BALANCED', 'COMFORTABLE', 'LUXURY'] as const).map((level) => {
              const active = state.character.lifestyleLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => {
                    soundFx.playClick();
                    onUpdateLifestyle(level);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
                  }`}
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Financial Health Audit Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-2xl border ${getGradeColor(healthGrade.grade)}`}>
                  {healthGrade.grade}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Financial Health Audit</h3>
                  <p className="text-xs text-slate-400">Score: {healthGrade.score} / 100</p>
                </div>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
              {healthGrade.summary}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Emergency Buffer</span>
                <span className="font-bold text-white font-mono text-sm">{healthGrade.emergencyBufferMonths} months</span>
                <span className="text-[10px] text-slate-400 block">Target: 3 - 6 months</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Debt-to-Income (DTI)</span>
                <span className="font-bold text-white font-mono text-sm">{healthGrade.debtToIncomeRatio}x</span>
                <span className="text-[10px] text-slate-400 block">Target: &lt; 0.5x</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Asset Diversification</span>
                <span className="font-bold text-white font-mono text-sm">{healthGrade.diversificationScore}%</span>
                <span className="text-[10px] text-slate-400 block">Target: &gt; 70%</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Estimated Savings Rate</span>
                <span className="font-bold text-white font-mono text-sm">{healthGrade.savingsRate}%</span>
                <span className="text-[10px] text-slate-400 block">Target: &gt; 20%</span>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Tailored Next Steps
            </h4>
            <div className="space-y-2 mb-6">
              {healthGrade.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowHealthModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Got it! Keep Optimizing
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
