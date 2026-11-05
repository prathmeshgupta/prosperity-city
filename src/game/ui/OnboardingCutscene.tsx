import React from 'react';
import { soundFx } from '../../audio/soundFx';
import { Compass, Sparkles, ArrowRight, Target, ShieldCheck, TrendingUp } from 'lucide-react';

interface OnboardingCutsceneProps {
  playerName: string;
  avatarEmoji: string;
  careerTitle: string;
  startingCash: number;
  onFinish: () => void;
}

export const OnboardingCutscene: React.FC<OnboardingCutsceneProps> = ({
  playerName,
  avatarEmoji,
  careerTitle,
  startingCash,
  onFinish,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
              {avatarEmoji}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                Arrival in Prosperity City
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Welcome, {playerName}!
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Starting Role: <strong className="text-emerald-400">{careerTitle}</strong> • Cash: <strong className="text-cyan-400">${startingCash.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* Narrative Paragraph */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2.5">
          <p>
            You just stepped off the passenger train at the <strong>Central Town Plaza</strong>. 
            The city hums around you: the digital ticker glowing on Wall Street, the aroma of fresh roast from The Daily Grind Cafe, 
            and the grand chime of the <strong>Golden Freedom Bell</strong> in the plaza distance.
          </p>
          <p>
            Your dream is clear: <strong>Financial Independence (FIRE)</strong>. 
            Grow your Net Worth to <strong>$1,000,000</strong> or generate <strong>$4,000/month in passive cashflow</strong> from index funds and rental real estate!
          </p>
        </div>

        {/* 3 Step Immediate Roadmap */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Your First 3 Moves in the City:</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="text-white">Follow your Guided Compass:</strong>
                <span className="text-slate-400 block text-[11px]">Walk to <strong>Apex Career Tower (Northwest)</strong> and clock in your first shift.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="text-white">Build Your Emergency Shield:</strong>
                <span className="text-slate-400 block text-[11px]">Open your 4.5% APY Vault at <strong>First Prosperity Bank</strong> to survive unexpected twists.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="text-white">Compound on Wall Street:</strong>
                <span className="text-slate-400 block text-[11px]">Dollar-cost average into index funds at the <strong>Wall Street Stock Exchange</strong>.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            soundFx.playLevelUp();
            onFinish();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>ENTER PROSPERITY CITY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
