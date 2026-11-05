import React from 'react';
import { Archetype } from '../types/game';
import { ARCHETYPES } from '../data/archetypes';
import { soundFx } from '../audio/soundFx';
import { Sparkles, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface ArchetypeSelectorModalProps {
  onSelectArchetype: (archetypeId: string) => void;
  onClose?: () => void;
}

export const ArchetypeSelectorModal: React.FC<ArchetypeSelectorModalProps> = ({
  onSelectArchetype,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="glass-panel max-w-4xl w-full rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Choose Your Starting Origin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Who Will You Guide to Financial Freedom?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Every character starts with distinct financial assets, debts, habits, and career potential. Pick one to begin your Wealth Odyssey!
          </p>
        </div>

        {/* Archetypes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {ARCHETYPES.map((arch) => {
            const totalDebt = arch.startingDebts.reduce((sum, d) => sum + d.principal, 0);

            return (
              <div
                key={arch.id}
                className="glass-panel-interactive rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/50"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                      {arch.avatar}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">{arch.name}</h3>
                      <span className="text-xs text-emerald-400 font-semibold">{arch.title}</span>
                      <span className="text-xs text-slate-400 block font-mono">Age {arch.age}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {arch.bio}
                  </p>

                  {/* Financial Stats Snapshot */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs mb-3 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Starting Salary:</span>
                      <span className="text-white font-bold">${arch.startingSalary.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cash & Savings:</span>
                      <span className="text-emerald-400 font-bold">${(arch.startingCash + arch.startingSavings).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Starting Debt:</span>
                      <span className={`font-bold ${totalDebt > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                        ${totalDebt.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic mb-4">
                    🎯 {arch.recommendedFor}
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundFx.playLevelUp();
                    onSelectArchetype(arch.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Select {arch.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {onClose && (
          <div className="text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Cancel and return to current game
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
