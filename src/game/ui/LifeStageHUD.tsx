import React from 'react';
import { GameState } from '../../types/game';
import { getLifeStage, LIFE_STAGE_CONFIG } from '../engine/lifecycleEngine';
import { 
  Sliders, 
  FastForward, 
  Crown, 
  Clock, 
  Heart, 
  Smile, 
  Flame, 
  Briefcase 
} from 'lucide-react';

interface LifeStageHUDProps {
  state: GameState;
  onOpenFocusModal: () => void;
  onOpenLegacyModal: () => void;
  onAdvancePeriod: () => void;
}

export const LifeStageHUD: React.FC<LifeStageHUDProps> = ({
  state,
  onOpenFocusModal,
  onOpenLegacyModal,
  onAdvancePeriod,
}) => {
  const currentStage = state.lifeStage || getLifeStage(state.character.age);
  const stageInfo = LIFE_STAGE_CONFIG[currentStage];
  const speed = state.progressionSpeed || (state.turnDurationMonths === 1 ? 'MONTHLY' : state.turnDurationMonths === 12 ? 'ANNUAL' : 'QUARTERLY');
  const focus = state.lifeFocus || 'BALANCED';
  const burnout = state.burnout || 15;

  const currentGen = state.generationalLegacy?.generation || 1;

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 select-none pointer-events-auto max-w-4xl w-[96%] sm:w-auto">
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-white">
        
        {/* Left: Life Stage & Age Badge */}
        <div className="flex items-center gap-2.5 pr-2 border-r border-slate-800">
          <span className="text-xl shrink-0">{stageInfo.icon}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">{stageInfo.title}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400">
                Age {state.character.age}
              </span>
              {currentGen > 1 && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Gen {currentGen}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Speed: <strong className="text-cyan-400">{speed}</strong> • Focus: <strong className="text-amber-400">{focus}</strong>
            </div>
          </div>
        </div>

        {/* Center: Vitals Meters (Health, Happiness, Burnout) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono pr-2 border-r border-slate-800">
          {/* Health */}
          <div className="flex items-center gap-1.5" title="Physical Health & Longevity">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${state.character.health}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-300">{state.character.health}%</span>
          </div>

          {/* Happiness */}
          <div className="flex items-center gap-1.5" title="Life Happiness & Mental Morale">
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${state.character.happiness}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-300">{state.character.happiness}%</span>
          </div>

          {/* Burnout */}
          <div className="flex items-center gap-1.5" title="Workplace Stress & Burnout Risk">
            <Flame className={`w-3.5 h-3.5 ${burnout > 60 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <div className="w-14 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${burnout > 60 ? 'bg-rose-500' : 'bg-blue-400'}`}
                style={{ width: `${burnout}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${burnout > 60 ? 'text-rose-400' : 'text-slate-300'}`}>{burnout}%</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Life Focus Settings Button */}
          <button
            onClick={onOpenFocusModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-bold transition-all cursor-pointer"
            title="Adjust Progression Speed & Energy Priorities"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Priorities</span>
          </button>

          {/* Legacy Button (Shows at Stage 4/5 or when Net Worth > $500k) */}
          <button
            onClick={onOpenLegacyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
            title="Generational Estate & Succession (New Game+)"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Legacy</span>
          </button>

          {/* Next Period Advance Button */}
          <button
            onClick={onAdvancePeriod}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Live Next Period (Process Income, Expenses, Dividends & Life)"
          >
            <FastForward className="w-3.5 h-3.5 fill-current" />
            <span>Next {speed === 'MONTHLY' ? 'Month' : speed === 'ANNUAL' ? 'Year' : 'Quarter'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
