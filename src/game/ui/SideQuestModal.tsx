import React, { useState } from 'react';
import { CitizenSideQuest, SideQuestChoice } from '../engine/sideQuests';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Coins, 
  Award, 
  ChevronRight, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';

interface SideQuestModalProps {
  quest: CitizenSideQuest;
  onComplete: (rewardCash: number, rewardXP: number) => void;
  onClose: () => void;
}

export const SideQuestModal: React.FC<SideQuestModalProps> = ({
  quest,
  onComplete,
  onClose,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<SideQuestChoice | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleSelectChoice = (choice: SideQuestChoice) => {
    if (hasAnswered) return;
    setSelectedChoice(choice);
    setHasAnswered(true);

    if (choice.isCorrect) {
      soundFx.playLevelUp();
      confetti({ particleCount: 70, spread: 60 });
    } else {
      soundFx.playBadTwist();
    }
  };

  const handleClaim = () => {
    if (selectedChoice?.isCorrect) {
      onComplete(quest.rewardCash, quest.rewardXP);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-5 sm:p-7 border border-slate-700 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header with NPC Portrait */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                {quest.npcAvatar}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Citizen Side-Quest
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {quest.category}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-0.5">
                {quest.npcName}
              </h3>
              <p className="text-[10px] text-slate-400">{quest.npcRole}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quest Title & Narrative Dilemma */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{quest.title}</span>
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{quest.dilemma}"
          </p>
        </div>

        {/* Multi-Choice Options */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            What advice do you give?
          </label>

          <div className="space-y-2">
            {quest.choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice;
              let btnStyle = 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300';
              if (hasAnswered) {
                if (choice.isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10';
                } else if (isSelected && !choice.isCorrect) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(choice)}
                  disabled={hasAnswered}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all cursor-pointer flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 leading-relaxed">
                    {choice.text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result & Feedback Card */}
        {hasAnswered && selectedChoice && (
          <div className={`p-4 rounded-2xl border space-y-2.5 animate-in fade-in ${
            selectedChoice.isCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-xs">
              {selectedChoice.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Correct! Financial Mastermind</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Financial Pitfall Detected</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedChoice.explanation}
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Key Takeaway:</strong> {quest.takeaway}</span>
            </div>
          </div>
        )}

        {/* Rewards & Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>+${quest.rewardCash}</span>
            </span>
            <span className="text-purple-300 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>+{quest.rewardXP} XP</span>
            </span>
          </div>

          {hasAnswered ? (
            <button
              onClick={handleClaim}
              className={`px-6 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${
                selectedChoice?.isCorrect
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <span>{selectedChoice?.isCorrect ? 'CLAIM REWARD' : 'REVIEW & CLOSE'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Select an answer above</span>
          )}
        </div>

      </div>
    </div>
  );
};
