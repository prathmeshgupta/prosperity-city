import React, { useState } from 'react';
import { ChapterQuest } from '../engine/quests';
import { soundFx } from '../../audio/soundFx';
import { Trophy, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';

interface QuestTrackerHUDProps {
  currentChapter: ChapterQuest;
  onOpenCampaignModal: () => void;
}

export const QuestTrackerHUD: React.FC<QuestTrackerHUDProps> = ({
  currentChapter,
  onOpenCampaignModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const completedCount = currentChapter.objectives.filter((o) => o.isCompleted).length;
  const totalCount = currentChapter.objectives.length;

  return (
    <div className="absolute top-20 left-4 z-20 max-w-xs w-72 pointer-events-auto select-none">
      <div className="glass-panel rounded-2xl border border-slate-700/80 p-3.5 shadow-2xl bg-slate-950/85 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center gap-2">
            <span className="text-base">{currentChapter.icon}</span>
            <div>
              <span className="text-[9px] uppercase font-extrabold text-amber-400 tracking-wider block">
                Chapter {currentChapter.chapter} Quest
              </span>
              <h4 className="font-extrabold text-xs text-white leading-tight">
                {currentChapter.title}
              </h4>
            </div>
          </div>

          <button className="text-slate-400 hover:text-white p-1">
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>

        {!isCollapsed && (
          <div className="space-y-1.5 pt-1 border-t border-slate-800 text-[11px]">
            {currentChapter.objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-1.5 leading-tight">
                {obj.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span className={obj.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200 font-medium'}>
                  {obj.description}
                </span>
              </div>
            ))}

            <button
              onClick={onOpenCampaignModal}
              className="w-full mt-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-amber-300 font-bold border border-slate-800 transition-colors cursor-pointer text-center"
            >
              View Full 6-Chapter Storyline ➔
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
