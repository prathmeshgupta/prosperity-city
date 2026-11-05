import React, { useEffect } from 'react';
import { GameState } from '../../types/game';
import { getNetWorth } from '../../engine/gameEngine';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface FreedomBellModalProps {
  state: GameState;
  onClose: () => void;
}

export const FreedomBellModal: React.FC<FreedomBellModalProps> = ({ state, onClose }) => {
  const netWorth = getNetWorth(state);
  const annualExpenses = state.character.annualSalary * 0.5;
  const passiveWithdrawal = netWorth * 0.04; // 4% rule

  useEffect(() => {
    soundFx.playVictory();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    const timer = setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.7 } });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in zoom-in duration-300">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-7 border-2 border-amber-400/60 shadow-2xl relative bg-slate-900/95 text-center">
        
        {/* Animated Bell Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
          🔔
        </div>

        <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-widest">
          SUMMIT OF FREEDOM ACHIEVED
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
          You Rang the Golden Freedom Bell!
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          Congratulations, <strong>{state.character.name}</strong>! Your invested portfolio now generates enough passive income under the 4% Safe Withdrawal Rule to fund your life forever.
        </p>

        {/* Certificate Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 my-5 space-y-3 font-mono">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Total Net Worth:</span>
            <span className="text-emerald-400 font-bold">${netWorth.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Safe Annual Passive Withdrawal (4%):</span>
            <span className="text-cyan-400 font-bold">${Math.round(passiveWithdrawal).toLocaleString()} / yr</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Annual Living Burn Covered:</span>
            <span className="text-white font-bold">100% Tax-Free / Passive</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
        >
          Celebrate & Keep Exploring Prosperity City
        </button>

      </div>
    </div>
  );
};
