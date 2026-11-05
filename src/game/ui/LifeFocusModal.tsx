import React, { useState } from 'react';
import { GameState, ProgressionSpeed, LifeFocus, EnergyAllocation } from '../../types/game';
import { 
  LIFE_FOCUS_PRESETS, 
  LIFE_STAGE_CONFIG, 
  getLifeStage, 
  setProgressionSpeed, 
  setLifeFocus 
} from '../engine/lifecycleEngine';
import { soundFx } from '../../audio/soundFx';
import { 
  Sliders, 
  Clock, 
  Briefcase, 
  Heart, 
  Smile, 
  GraduationCap, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Flame, 
  ShieldCheck, 
  ChevronRight,
  FastForward
} from 'lucide-react';

interface LifeFocusModalProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  onAdvancePeriod: () => void;
  onClose: () => void;
}

export const LifeFocusModal: React.FC<LifeFocusModalProps> = ({
  state,
  onUpdateState,
  onAdvancePeriod,
  onClose,
}) => {
  const currentSpeed = state.progressionSpeed || (state.turnDurationMonths === 1 ? 'MONTHLY' : state.turnDurationMonths === 12 ? 'ANNUAL' : 'QUARTERLY');
  const currentFocus = state.lifeFocus || 'BALANCED';
  const currentStage = state.lifeStage || getLifeStage(state.character.age);
  const stageInfo = LIFE_STAGE_CONFIG[currentStage];

  const [speed, setSpeed] = useState<ProgressionSpeed>(currentSpeed);
  const [focus, setFocus] = useState<LifeFocus>(currentFocus);
  const [allocation, setAllocation] = useState<EnergyAllocation>(
    state.energyAllocation || { ...LIFE_FOCUS_PRESETS[currentFocus].allocation }
  );

  const handleSpeedChange = (newSpeed: ProgressionSpeed) => {
    soundFx.playClick();
    setSpeed(newSpeed);
    setProgressionSpeed(state, newSpeed);
    onUpdateState({ ...state });
  };

  const handleFocusPreset = (newFocus: LifeFocus) => {
    soundFx.playClick();
    setFocus(newFocus);
    const newAlloc = { ...LIFE_FOCUS_PRESETS[newFocus].allocation };
    setAllocation(newAlloc);
    state.lifeFocus = newFocus;
    state.energyAllocation = newAlloc;
    onUpdateState({ ...state });
  };

  const handleSliderChange = (key: keyof EnergyAllocation, val: number) => {
    const newAlloc = { ...allocation, [key]: val };
    const sum = newAlloc.career + newAlloc.health + newAlloc.leisure + newAlloc.education;
    setAllocation(newAlloc);
    state.energyAllocation = newAlloc;
    onUpdateState({ ...state });
  };

  const totalAllocation = allocation.career + allocation.health + allocation.leisure + allocation.education;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="glass-panel max-w-3xl w-full rounded-3xl p-5 sm:p-7 border border-slate-700 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Life Priorities & Progression Engine</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Age {state.character.age}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                You control how fast time moves and how you allocate your 100% daily energy.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1. Progression Speed Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Time Progression Pace (Set your preferred speed)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'MONTHLY' as ProgressionSpeed,
                label: 'Monthly Granular',
                tag: '1 Month / Turn',
                desc: 'Maximum control over monthly bills, stock DCA, and budget tracking.',
                icon: '🗓️',
              },
              {
                id: 'QUARTERLY' as ProgressionSpeed,
                label: 'Brisk Quarterly (Default)',
                tag: '3 Months / Turn',
                desc: 'Smooth balance. Full life arc in ~160 turns with steady compounding.',
                icon: '⚡',
              },
              {
                id: 'ANNUAL' as ProgressionSpeed,
                label: 'Swift Annual',
                tag: '1 Year / Turn',
                desc: 'Fast macro-level view of decade-long investments and estate growth.',
                icon: '🚀',
              },
            ].map((p) => {
              const active = speed === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSpeedChange(p.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                      {p.tag}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white">{p.label}</div>
                  <p className="text-[10px] text-slate-400 mt-1">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Life Focus Preset Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Choose Your Life Priority Focus</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(LIFE_FOCUS_PRESETS) as LifeFocus[]).map((fKey) => {
              const preset = LIFE_FOCUS_PRESETS[fKey];
              const isSelected = focus === fKey;
              return (
                <button
                  key={fKey}
                  onClick={() => handleFocusPreset(fKey)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{preset.icon}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white leading-tight">{preset.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 truncate">{preset.tagline.split(',')[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Granular 100% Energy Allocation Sliders */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Energy Allocation Dial</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                totalAllocation === 100 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                Total: {totalAllocation}%
              </span>
            </span>
            <span className="text-[11px] text-slate-400">
              Current Burnout: <strong className={state.burnout && state.burnout > 60 ? 'text-rose-400' : 'text-emerald-400'}>{state.burnout || 15}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Career */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Career & Hustle ({allocation.career}%)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {allocation.career >= 50 ? '+High Overtime Pay' : 'Normal'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={allocation.career}
                onChange={(e) => handleSliderChange('career', parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Health */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Health & Longevity ({allocation.health}%)</span>
                </span>
                <span className="text-[10px] font-mono text-rose-400">
                  {allocation.health >= 35 ? '+Vitality Shield' : 'Normal'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={allocation.health}
                onChange={(e) => handleSliderChange('health', parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Leisure */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leisure & Relationships ({allocation.leisure}%)</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  {allocation.leisure >= 25 ? '+Happiness Boost' : 'Low'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={allocation.leisure}
                onChange={(e) => handleSliderChange('leisure', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Education & Upskilling ({allocation.education}%)</span>
                </span>
                <span className="text-[10px] font-mono text-purple-400">
                  {allocation.education >= 20 ? '+High XP Flow' : 'Standard'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={allocation.education}
                onChange={(e) => handleSliderChange('education', parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Current Human Life Stage Context Card */}
        <div className="p-4 rounded-2xl border flex items-start gap-3.5" style={{ backgroundColor: `${stageInfo.themeColor}10`, borderColor: `${stageInfo.themeColor}35` }}>
          <span className="text-3xl">{stageInfo.icon}</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider" style={{ color: stageInfo.themeColor }}>
                Stage: {stageInfo.title} ({stageInfo.ageRange})
              </span>
              <span className="text-[10px] text-slate-400">• {stageInfo.tagline}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Life Focus:</strong> {stageInfo.primaryDilemma}
            </p>
          </div>
        </div>

        {/* Footer Actions: Save & Live Next Period */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              soundFx.playLevelUp();
              onAdvancePeriod();
              onClose();
            }}
            className="flex-1 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs tracking-wider shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <FastForward className="w-4 h-4 fill-current" />
            <span>APPLY PRIORITIES & LIVE NEXT {speed === 'MONTHLY' ? 'MONTH' : speed === 'ANNUAL' ? 'YEAR' : 'QUARTER'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
