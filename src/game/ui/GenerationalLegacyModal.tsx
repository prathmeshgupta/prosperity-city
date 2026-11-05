import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { HEREDITARY_PERKS, createGenerationalSuccessor } from '../engine/lifecycleEngine';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { 
  Crown, 
  Sparkles, 
  Trophy, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Home, 
  Coins, 
  History, 
  Check 
} from 'lucide-react';

interface GenerationalLegacyModalProps {
  state: GameState;
  onSuccessorCreated: (nextState: GameState) => void;
  onClose: () => void;
}

export const GenerationalLegacyModal: React.FC<GenerationalLegacyModalProps> = ({
  state,
  onSuccessorCreated,
  onClose,
}) => {
  const currentGen = state.generationalLegacy?.generation || 1;
  const hallOfFame = state.generationalLegacy?.hallOfFame || [];

  const [heirName, setHeirName] = useState<string>(`${state.character.name} Jr.`);
  const [heirAvatar, setHeirAvatar] = useState<string>('🎓');
  const [selectedPerk, setSelectedPerk] = useState<string>('REAL_ESTATE_DYNASTY');
  const [trustAmount, setTrustAmount] = useState<number>(Math.min(Math.round(state.cash * 0.4), 25000));
  const [showHallOfFame, setShowHallOfFame] = useState<boolean>(false);

  const handleCreateHeir = () => {
    soundFx.playLevelUp();
    confetti({ particleCount: 120, spread: 80 });
    const nextState = createGenerationalSuccessor(
      state,
      heirName,
      heirAvatar,
      selectedPerk,
      trustAmount
    );
    onSuccessorCreated(nextState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="glass-panel max-w-3xl w-full rounded-3xl p-5 sm:p-7 border border-amber-500/40 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto relative">
        
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                👑
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Town Hall Estate Records
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Generation {currentGen}
                </span>
              </div>
              <h3 className="font-black text-xl text-white mt-0.5">
                Generational Legacy & New Game+
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Generation Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Founder</span>
            <span className="font-bold text-white text-xs truncate block">{state.character.name}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Final Age</span>
            <span className="font-bold text-cyan-400 text-xs">Age {state.character.age}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Liquid Cash</span>
            <span className="font-bold text-emerald-400 text-xs">${Math.round(state.cash).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Family Dynasty</span>
            <span className="font-bold text-amber-400 text-xs">Gen {currentGen} Pioneer</span>
          </div>
        </div>

        {/* Successor Setup Form */}
        <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Name Your Generation {currentGen + 1} Successor</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Heir Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Successor Name</label>
              <input
                type="text"
                value={heirName}
                onChange={(e) => setHeirName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
                placeholder="Enter heir name..."
              />
            </div>

            {/* Heir Avatar */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Heir Avatar</label>
              <div className="flex items-center gap-1.5">
                {['🎓', '💻', '🚀', '🌟', '💼'].map((av) => (
                  <button
                    key={av}
                    onClick={() => {
                      soundFx.playClick();
                      setHeirAvatar(av);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                      heirAvatar === av
                        ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Fund Bequest */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Inherited Cash Trust Fund:</span>
              <span className="font-mono text-emerald-400 font-bold">${trustAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max={Math.max(1000, Math.round(state.cash))}
              step="500"
              value={trustAmount}
              onChange={(e) => setTrustAmount(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Allocated directly into the successor's starting checking and emergency vault accounts.
            </p>
          </div>
        </div>

        {/* Hereditary Perk Choice */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Select Hereditary Lineage Perk (Carries into Gen {currentGen + 1})</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {HEREDITARY_PERKS.map((perk) => {
              const isSelected = selectedPerk === perk.id;
              return (
                <button
                  key={perk.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedPerk(perk.id);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{perk.icon}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                        Active Selection
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-white">{perk.title}</div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{perk.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hall of Fame Records (Previous Generations) */}
        {hallOfFame.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setShowHallOfFame((v) => !v)}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>{showHallOfFame ? 'Hide Ancestor Records' : `View Ancestor Hall of Fame (${hallOfFame.length} Generations)`}</span>
            </button>

            {showHallOfFame && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 max-h-48 overflow-y-auto">
                {hallOfFame.map((anc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 text-xs font-mono">
                    <div>
                      <span className="font-bold text-white">Gen {anc.generation}: {anc.name}</span>
                      <span className="text-slate-400 block text-[10px]">{anc.careerTitle} • Lived to Age {anc.finalAge}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">
                      ${anc.finalNetWorth.toLocaleString()} Net Worth
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Confirmation Button */}
        <div className="pt-2">
          <button
            onClick={handleCreateHeir}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Crown className="w-5 h-5 fill-current" />
            <span>BEQUEATH LEGACY & START GENERATION {currentGen + 1} (NEW GAME+)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
