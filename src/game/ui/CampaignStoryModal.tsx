import React from 'react';
import { ChapterQuest } from '../engine/quests';
import { soundFx } from '../../audio/soundFx';
import { Trophy, CheckCircle2, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface CampaignStoryModalProps {
  chapters: ChapterQuest[];
  activeChapterIdx: number;
  onClose: () => void;
}

export const CampaignStoryModal: React.FC<CampaignStoryModalProps> = ({
  chapters,
  activeChapterIdx,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="glass-panel max-w-3xl w-full rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl relative bg-slate-900/95 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Campaign Questline
              </span>
              <span className="text-xs text-slate-400 font-mono">6 Chapters to Total Freedom</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              The Path to Financial Independence
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Chapters list */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {chapters.map((ch, idx) => {
            const isCurrent = idx === activeChapterIdx;
            const isLocked = idx > activeChapterIdx;
            const isDone = idx < activeChapterIdx;

            return (
              <div
                key={ch.chapter}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/20'
                    : isDone
                    ? 'bg-emerald-950/15 border-emerald-800/40'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                      {isLocked ? '🔒' : ch.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                        Chapter {ch.chapter}
                      </span>
                      <h4 className="font-extrabold text-base text-white">{ch.title}</h4>
                      <p className="text-xs text-slate-400">{ch.subtitle}</p>
                    </div>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      In Progress
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-semibold">Locked</span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {ch.storyIntro}
                </p>

                {/* Objectives */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs mb-3">
                  {ch.objectives.map((obj) => (
                    <div key={obj.id} className="flex items-center gap-2">
                      <span className={obj.isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {obj.isCompleted ? '✓' : '○'}
                      </span>
                      <span className={obj.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}>
                        {obj.description}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rewards */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Chapter Bounty:</span>
                  <span className="font-bold text-emerald-400">
                    +${ch.rewardCash} Cash • +{ch.rewardXP} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
