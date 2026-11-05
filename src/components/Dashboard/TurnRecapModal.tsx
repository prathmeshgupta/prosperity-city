import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../audio/soundFx';
import { 
  ArrowRight, 
  TrendingUp, 
  Gift, 
  PiggyBank, 
  Receipt, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface TurnRecapModalProps {
  quarterData: {
    grossIncome: number;
    taxes: number;
    livingExpenses: number;
    debtPayments: number;
    retirementSaved: number;
    dividendsEarned: number;
    hysaInterestEarned: number;
    netCashflow: number;
  };
  unlockedAchievements: string[];
  quarterNumber: number;
  yearNumber: number;
  age: number;
  onClose: () => void;
}

export const TurnRecapModal: React.FC<TurnRecapModalProps> = ({
  quarterData,
  unlockedAchievements,
  quarterNumber,
  yearNumber,
  age,
  onClose,
}) => {
  useEffect(() => {
    soundFx.playCoin();
    if (unlockedAchievements.length > 0) {
      soundFx.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [unlockedAchievements]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Quarter Finished • Age {age}
            </span>
            <h3 className="text-xl font-extrabold text-white">
              Year {yearNumber}, Quarter {quarterNumber} Summary
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Unlocked Achievements alert */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <div className="text-xs font-bold text-amber-300">Achievement Unlocked!</div>
              <div className="text-xs text-white font-semibold">
                {unlockedAchievements.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Financial Flow Waterfall */}
        <div className="space-y-2 mb-5 text-xs">
          
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Gross Earnings & Hustle
            </span>
            <span className="font-mono font-bold text-emerald-400">
              +${quarterData.grossIncome.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-slate-400" />
              Taxes (Federal & State)
            </span>
            <span className="font-mono text-slate-300">
              -${quarterData.taxes.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              Living & Rent Expenses
            </span>
            <span className="font-mono text-slate-300">
              -${quarterData.livingExpenses.toLocaleString()}
            </span>
          </div>

          {quarterData.debtPayments > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-rose-400" />
                Debt Interest & Payments
              </span>
              <span className="font-mono text-rose-400">
                -${quarterData.debtPayments.toLocaleString()}
              </span>
            </div>
          )}

          {quarterData.retirementSaved > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30">
              <span className="text-purple-300 flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-purple-400" />
                401(k) + Free Employer Match
              </span>
              <span className="font-mono font-bold text-purple-400">
                +${quarterData.retirementSaved.toLocaleString()}
              </span>
            </div>
          )}

          {quarterData.dividendsEarned > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-950/20 border border-teal-800/30">
              <span className="text-teal-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Stock & REIT Dividends
              </span>
              <span className="font-mono font-bold text-teal-400">
                +${quarterData.dividendsEarned.toLocaleString()}
              </span>
            </div>
          )}

          {quarterData.hysaInterestEarned > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-950/20 border border-blue-800/30">
              <span className="text-blue-300 flex items-center gap-2">
                <PiggyBank className="w-3.5 h-3.5 text-blue-400" />
                Emergency HYSA Interest
              </span>
              <span className="font-mono font-bold text-blue-400">
                +${quarterData.hysaInterestEarned.toLocaleString()}
              </span>
            </div>
          )}

          {/* Bottom Net Cash Result */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 mt-3 font-semibold">
            <span className="text-white text-sm">Quarterly Net Cashflow</span>
            <span
              className={`font-mono text-base font-bold ${
                quarterData.netCashflow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {quarterData.netCashflow >= 0 ? '+' : ''}${quarterData.netCashflow.toLocaleString()}
            </span>
          </div>

        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
