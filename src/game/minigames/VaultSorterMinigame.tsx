import React, { useState, useEffect } from 'react';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, Trophy, Heart, CheckCircle2, RotateCcw } from 'lucide-react';

interface ExpenseItem {
  id: number;
  label: string;
  category: 'NEEDS' | 'WANTS' | 'SAVINGS';
  amount: number;
}

const ITEMS_POOL: { label: string; category: 'NEEDS' | 'WANTS' | 'SAVINGS'; amount: number }[] = [
  { label: 'Apartment Rent', category: 'NEEDS', amount: 1200 },
  { label: 'Basic Groceries', category: 'NEEDS', amount: 95 },
  { label: 'Electric & Heating Bill', category: 'NEEDS', amount: 110 },
  { label: 'Health Insurance Premium', category: 'NEEDS', amount: 180 },
  { label: 'Prescription Medicine', category: 'NEEDS', amount: 35 },
  
  { label: 'Weekend Craft Cocktails', category: 'WANTS', amount: 65 },
  { label: 'Music Festival VIP Ticket', category: 'WANTS', amount: 280 },
  { label: 'Designer Brand Sunglasses', category: 'WANTS', amount: 150 },
  { label: 'Food Delivery Takeout', category: 'WANTS', amount: 45 },
  { label: 'Video Game Deluxe Edition', category: 'WANTS', amount: 70 },

  { label: '4.5% High-Yield Vault Deposit', category: 'SAVINGS', amount: 250 },
  { label: 'S&P 500 Index Fund (VOO)', category: 'SAVINGS', amount: 300 },
  { label: 'Extra Credit Card Payoff', category: 'SAVINGS', amount: 200 },
  { label: 'Roth IRA Annual Contribution', category: 'SAVINGS', amount: 250 },
  { label: 'Emergency Fund Cushion', category: 'SAVINGS', amount: 150 },
];

interface VaultSorterProps {
  onComplete: (score: number, cashReward: number, xpReward: number) => void;
  onClose: () => void;
}

export const VaultSorterMinigame: React.FC<VaultSorterProps> = ({ onComplete, onClose }) => {
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [currentItem, setCurrentItem] = useState<ExpenseItem | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; correct: boolean } | null>(null);

  // Pick new item
  const spawnItem = () => {
    const raw = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
    setCurrentItem({
      id: Date.now(),
      label: raw.label,
      category: raw.category,
      amount: raw.amount,
    });
  };

  useEffect(() => {
    spawnItem();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundFx.playLevelUp();
      confetti({ particleCount: 70, spread: 60 });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSort = (chosenCategory: 'NEEDS' | 'WANTS' | 'SAVINGS') => {
    if (!currentItem || isGameOver) return;

    if (chosenCategory === currentItem.category) {
      soundFx.playCoin();
      const points = 100 + streak * 20;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setFeedback({ text: `✓ Correct! +${points} pts`, correct: true });
    } else {
      soundFx.playBadTwist();
      setStreak(0);
      setFeedback({
        text: `✗ Oops! ${currentItem.label} belongs in ${currentItem.category}`,
        correct: false,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      spawnItem();
    }, 450);
  };

  const handleFinish = () => {
    const cashReward = Math.min(300, Math.floor(score / 5));
    const xpReward = Math.min(250, Math.floor(score / 4));
    onComplete(score, cashReward, xpReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-2xl relative bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Bank Mini-Game
              </span>
              <span className="text-xs text-slate-400 font-mono">Time: {timeLeft}s</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              The 50/30/20 Vault Sorter
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
            <span className="font-mono text-2xl font-extrabold text-emerald-400">{score}</span>
          </div>
        </div>

        {!isGameOver ? (
          <div className="space-y-6">
            
            {/* Falling Expense Card */}
            <div className="h-32 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner">
              {currentItem && (
                <div className="text-center animate-in zoom-in duration-200">
                  <span className="text-xs text-slate-400 block mb-1">Incoming Expense Item:</span>
                  <div className="text-lg sm:text-xl font-extrabold text-white">
                    {currentItem.label}
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-400 mt-1">
                    ${currentItem.amount}
                  </div>
                </div>
              )}

              {/* Feedback toast */}
              {feedback && (
                <div className={`absolute bottom-2 px-3 py-1 rounded-full text-xs font-bold ${
                  feedback.correct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {feedback.text}
                </div>
              )}
            </div>

            {/* Instruction Tip */}
            <p className="text-xs text-center text-slate-400">
              Sort into the 3 buckets: <strong>Needs (50%)</strong>, <strong>Wants (30%)</strong>, or <strong>Savings/Debt (20%)</strong>!
            </p>

            {/* 3 Vault Buckets */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSort('NEEDS')}
                className="p-4 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center text-center group active:scale-95"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🏠</div>
                <span className="text-xs font-extrabold text-blue-300">NEEDS</span>
                <span className="text-[10px] text-slate-400 mt-0.5">50% Rule</span>
                <span className="text-[9px] text-slate-500 mt-1">Rent, Food, Health</span>
              </button>

              <button
                onClick={() => handleSort('WANTS')}
                className="p-4 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer flex flex-col items-center text-center group active:scale-95"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">🍿</div>
                <span className="text-xs font-extrabold text-purple-300">WANTS</span>
                <span className="text-[10px] text-slate-400 mt-0.5">30% Rule</span>
                <span className="text-[9px] text-slate-500 mt-1">Dining, VIP, Fun</span>
              </button>

              <button
                onClick={() => handleSort('SAVINGS')}
                className="p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center text-center group active:scale-95"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">💎</div>
                <span className="text-xs font-extrabold text-emerald-300">SAVINGS / DEBT</span>
                <span className="text-[10px] text-slate-400 mt-0.5">20% Rule</span>
                <span className="text-[9px] text-slate-500 mt-1">HYSA, Index, Loans</span>
              </button>
            </div>

          </div>
        ) : (
          /* Game Over Screen */
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl">🏆</div>
            <h4 className="text-2xl font-extrabold text-white">Vault Sorting Complete!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              You mastered the 50/30/20 rule! By categorizing expenses cleanly, you ensure your future self is always funded first.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-xs mx-auto space-y-1 font-mono">
              <div className="text-xs text-slate-400">Final Score: <strong className="text-white">{score} pts</strong></div>
              <div className="text-sm text-emerald-400 font-bold">+${Math.min(300, Math.floor(score / 5))} Bonus Cash</div>
              <div className="text-xs text-amber-300 font-bold">+{Math.min(250, Math.floor(score / 4))} Financial XP</div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              Claim Rewards & Return to Bank
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
