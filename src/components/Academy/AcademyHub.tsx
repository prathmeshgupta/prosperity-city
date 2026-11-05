import React, { useState } from 'react';
import { AcademyLesson, GameState } from '../../types/game';
import { ACADEMY_LESSONS } from '../../data/academyLessons';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Trophy,
  BookOpen
} from 'lucide-react';

interface AcademyHubProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const AcademyHub: React.FC<AcademyHubProps> = ({ state, onUpdateState }) => {
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(ACADEMY_LESSONS[0]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState<boolean>(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  // Interactive visual widget states
  const [rule72Rate, setRule72Rate] = useState<number>(8);
  const [inflationYears, setInflationYears] = useState<number>(20);
  const [inflationLossRate, setInflationLossRate] = useState<number>(3.5);

  const handleSelectLesson = (lesson: AcademyLesson) => {
    soundFx.playClick();
    setSelectedLesson(lesson);
    setSelectedQuizAnswer(null);
    setHasSubmittedQuiz(false);
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null || !selectedLesson) return;
    setHasSubmittedQuiz(true);

    const isCorrect = selectedQuizAnswer === selectedLesson.quiz.correctIndex;
    if (isCorrect) {
      soundFx.playLevelUp();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      if (!completedLessonIds.has(selectedLesson.id)) {
        completedLessonIds.add(selectedLesson.id);
        setCompletedLessonIds(new Set(completedLessonIds));
        state.totalXP += selectedLesson.xpReward;
        state.recentEvents.push({
          month: state.month,
          text: `🎓 Completed Academy Lesson: "${selectedLesson.title}" (+${selectedLesson.xpReward} XP)!`,
          type: 'positive',
        });
        onUpdateState({ ...state });
      }
    } else {
      soundFx.playBadTwist();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Academy Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>FinTwist Academy • Gamified Financial Literacy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Bite-Sized Lessons That Actually Build Wealth
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Master fundamental money laws, play with interactive concept widgets, test your intuition, and earn XP badges.
          </p>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
            🏆
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Academy XP</span>
            <div className="font-mono text-lg font-extrabold text-amber-300">
              {state.totalXP} XP
            </div>
          </div>
        </div>
      </div>

      {/* Main Lesson View & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lesson Directory (Left Sidebar) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
            Curriculum ({completedLessonIds.size} / {ACADEMY_LESSONS.length} Done)
          </span>

          {ACADEMY_LESSONS.map((lesson) => {
            const isSelected = selectedLesson?.id === lesson.id;
            const isDone = completedLessonIds.has(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{lesson.icon}</span>
                  <div className="truncate">
                    <h4 className="text-xs font-bold truncate text-white">
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {lesson.readTime} • +{lesson.xpReward} XP
                    </span>
                  </div>
                </div>

                {isDone && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Lesson Reader & Interactive Widget (Right Column) */}
        {selectedLesson && (
          <div className="lg:col-span-8 glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 space-y-6">
            
            {/* Lesson Title & Category */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedLesson.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedLesson.readTime} read
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <span>{selectedLesson.icon}</span>
                <span>{selectedLesson.title}</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1 italic">
                "{selectedLesson.tagline}"
              </p>
            </div>

            {/* Lesson Body Content */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-semibold text-emerald-300">
                {selectedLesson.content.headline}
              </div>

              {selectedLesson.content.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-white">
                    {section.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {section.body}
                  </p>
                  {section.takeaway && (
                    <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30 text-xs text-blue-200 font-medium">
                      💡 <strong>Golden Rule:</strong> {section.takeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Embedded Interactive Visual Widget: Rule of 72 */}
            {selectedLesson.id === 'lesson_compounding_72' && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Rule of 72 Calculator
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    Return: {rule72Rate}% / yr
                  </span>
                </div>

                <input
                  type="range"
                  min={2}
                  max={24}
                  value={rule72Rate}
                  onChange={(e) => setRule72Rate(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Time for your money to double:</span>
                  <span className="font-mono text-3xl font-extrabold text-emerald-400">
                    {(72 / rule72Rate).toFixed(1)} Years
                  </span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    A $10,000 investment will become $20,000 in {(72 / rule72Rate).toFixed(1)} years, then $40,000 in {((72 / rule72Rate) * 2).toFixed(1)} years!
                  </p>
                </div>
              </div>
            )}

            {/* Embedded Interactive Visual Widget: Inflation */}
            {selectedLesson.id === 'lesson_inflation_silent_thief' && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Purchasing Power Melting Visualizer
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Time Horizon: {inflationYears} Yrs</span>
                    <input
                      type="range"
                      min={5}
                      max={40}
                      value={inflationYears}
                      onChange={(e) => setInflationYears(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Inflation: {inflationLossRate}%</span>
                    <input
                      type="range"
                      min={2}
                      max={8}
                      step={0.5}
                      value={inflationLossRate}
                      onChange={(e) => setInflationLossRate(Number(e.target.value))}
                      className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">$100,000 Cash in Checking after {inflationYears} years will feel like:</span>
                  <span className="font-mono text-3xl font-extrabold text-amber-400">
                    ${Math.round(100000 / Math.pow(1 + inflationLossRate / 100, inflationYears)).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-rose-400 block mt-1 font-semibold">
                    (Lost {Math.round((1 - 1 / Math.pow(1 + inflationLossRate / 100, inflationYears)) * 100)}% of purchasing power!)
                  </span>
                </div>
              </div>
            )}

            {/* Knowledge Check Quiz */}
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Knowledge Check Challenge (+{selectedLesson.xpReward} XP)
                </h3>
              </div>

              <p className="text-sm text-slate-200 mb-4 font-medium">
                {selectedLesson.quiz.question}
              </p>

              <div className="space-y-2 mb-4">
                {selectedLesson.quiz.options.map((opt, optIdx) => {
                  const isPicked = selectedQuizAnswer === optIdx;
                  const isCorrect = optIdx === selectedLesson.quiz.correctIndex;

                  let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                  if (hasSubmittedQuiz) {
                    if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    else if (isPicked) style = 'bg-rose-500/20 border-rose-500 text-rose-300';
                  } else if (isPicked) {
                    style = 'bg-emerald-500/10 border-emerald-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasSubmittedQuiz}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedQuizAnswer(optIdx);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!hasSubmittedQuiz ? (
                <button
                  disabled={selectedQuizAnswer === null}
                  onClick={handleSubmitQuiz}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Answer & Claim XP
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-bold block mb-1 text-white">
                    {selectedQuizAnswer === selectedLesson.quiz.correctIndex ? '🎉 Spot on!' : '💡 Explanation:'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedLesson.quiz.explanation}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
