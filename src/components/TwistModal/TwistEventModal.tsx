import React, { useState } from 'react';
import { TwistEvent, TwistChoice } from '../../types/game';
import { soundFx } from '../../audio/soundFx';
import { Sparkles, BookOpen, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface TwistEventModalProps {
  event: TwistEvent;
  onSelectChoice: (choice: TwistChoice) => void;
}

export const TwistEventModal: React.FC<TwistEventModalProps> = ({ event, onSelectChoice }) => {
  const [selectedChoice, setSelectedChoice] = useState<TwistChoice | null>(null);

  const handlePickChoice = (choice: TwistChoice) => {
    setSelectedChoice(choice);
    if ((choice.cashChange && choice.cashChange < -1000) || (choice.happinessChange && choice.happinessChange < -5)) {
      soundFx.playBadTwist();
    } else {
      soundFx.playCoin();
    }
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    onSelectChoice(selectedChoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-xl w-full rounded-2xl p-6 sm:p-7 border border-slate-700 shadow-2xl relative">
        
        {/* Category Pill & Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
            {event.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 tracking-wider">
                {event.category} TWIST
              </span>
              {event.expansionPackId && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Expansion Event
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Story Narrative */}
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mb-4 text-sm text-slate-200 leading-relaxed font-normal">
          {event.story}
        </div>

        {/* Financial Concept Education Box */}
        <div className="bg-blue-950/20 border border-blue-800/30 rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-blue-200">
          <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-blue-300 block mb-0.5">Financial Lesson:</span>
            <span>{event.explanation}</span>
          </div>
        </div>

        {/* Choices List */}
        {!selectedChoice ? (
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              What do you decide?
            </span>
            {event.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handlePickChoice(choice)}
                className="w-full text-left p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer group flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {choice.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                </div>
                {choice.description && (
                  <p className="text-xs text-slate-400 font-medium">
                    {choice.description}
                  </p>
                )}
                
                {/* Consequence Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {choice.cashChange && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      choice.cashChange >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {choice.cashChange >= 0 ? '+' : ''}${choice.cashChange.toLocaleString()} Cash
                    </span>
                  )}
                  {choice.salaryChange && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-teal-500/10 text-teal-300">
                      +${choice.salaryChange.toLocaleString()}/yr Salary
                    </span>
                  )}
                  {choice.happinessChange && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      choice.happinessChange >= 0 ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {choice.happinessChange >= 0 ? '+' : ''}{choice.happinessChange} Happiness
                    </span>
                  )}
                  {choice.debtChange && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-400">
                      +${choice.debtChange.amount.toLocaleString()} Debt
                    </span>
                  )}
                  {choice.assetBonus && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-500/10 text-purple-300">
                      +Asset Shares Unlocked
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Decision Review & Educational Takeaway */
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle className="w-4 h-4" />
                You Chose:
              </div>
              <p className="text-sm font-semibold text-white mb-2">
                "{selectedChoice.text}"
              </p>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200">
                <span className="font-bold block mb-1">💡 Key Financial Takeaway:</span>
                {selectedChoice.educationalTakeaway}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Apply Decision & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
