import React, { useState } from 'react';
import { NPC, DialogueChoice } from '../entities/NPC';
import { GameState } from '../../types/game';
import { soundFx } from '../../audio/soundFx';
import { Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DialogueBoxProps {
  npc: NPC;
  state: GameState;
  onClose: () => void;
  onUpdateState: (newState: GameState) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  npc,
  state,
  onClose,
  onUpdateState,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<DialogueChoice | null>(null);

  const handlePickChoice = (choice: DialogueChoice) => {
    setSelectedChoice(choice);
    soundFx.playCoin();

    // Apply any bonuses
    if (choice.cashBonus) state.cash += choice.cashBonus;
    if (choice.happinessBonus) {
      state.character.happiness = Math.max(0, Math.min(100, state.character.happiness + choice.happinessBonus));
    }
    if (choice.healthBonus) {
      state.character.health = Math.max(0, Math.min(100, state.character.health + choice.healthBonus));
    }
    if (choice.xpBonus) state.totalXP += choice.xpBonus;

    onUpdateState({ ...state });
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom duration-300">
      <div className="glass-panel p-5 rounded-3xl border border-slate-700 shadow-2xl relative bg-slate-950/95 backdrop-blur-xl">
        
        {/* Close cross */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex items-start gap-4 mb-4">
          {/* NPC Portrait */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border shrink-0"
            style={{ backgroundColor: `${npc.color}20`, borderColor: `${npc.color}50` }}
          >
            {npc.dialogue.portrait}
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">{npc.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {npc.title}
              </span>
            </div>

            {/* Speech bubble text */}
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              {!selectedChoice ? npc.dialogue.greeting : selectedChoice.response}
            </p>
          </div>
        </div>

        {/* Educational Takeaway & Choices */}
        {!selectedChoice ? (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              What do you ask?
            </span>
            {npc.dialogue.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handlePickChoice(choice)}
                className="w-full text-left p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-between text-xs text-white font-medium group"
              >
                <span>{choice.text}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-200">
              <span className="font-bold block mb-0.5 text-emerald-300">💡 Financial Wisdom:</span>
              {selectedChoice.educationalLesson}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Continue Exploring Prosperity City
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
