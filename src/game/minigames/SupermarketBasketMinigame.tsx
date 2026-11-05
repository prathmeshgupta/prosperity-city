import React, { useState } from 'react';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { ShoppingCart, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface ProductComparison {
  title: string;
  category: string;
  optionA: {
    name: string;
    price: number;
    size: string;
    unitPrice: string;
    isOptimal: boolean;
    explanation: string;
  };
  optionB: {
    name: string;
    price: number;
    size: string;
    unitPrice: string;
    isOptimal: boolean;
    explanation: string;
  };
}

const COMPARISONS: ProductComparison[] = [
  {
    title: 'Breakfast Staple Shelf',
    category: 'Grains & Pantry',
    optionA: {
      name: 'Store Brand Rolled Oats (Bag)',
      price: 2.80,
      size: '32 oz',
      unitPrice: '$0.09 / oz',
      isOptimal: true,
      explanation: 'Whole grain oats without marketing markup. 6x cheaper per ounce than branded sugar cereals!',
    },
    optionB: {
      name: 'MegaCrunch Cartoon Sugar Puffs',
      price: 5.90,
      size: '11 oz',
      unitPrice: '$0.54 / oz',
      isOptimal: false,
      explanation: 'You are paying $3 extra for cartoon licensing and refined sugar.',
    },
  },
  {
    title: 'Protein & Dinner Shelf',
    category: 'Proteins',
    optionA: {
      name: 'Pre-Cooked Gourmet Frozen Meal Kit',
      price: 13.50,
      size: '12 oz',
      unitPrice: '$1.12 / oz',
      isOptimal: false,
      explanation: 'Convenience packaging charges a huge premium for 1 portion of salty food.',
    },
    optionB: {
      name: 'Bulk Frozen Chicken Breast & Rice',
      price: 8.00,
      size: '48 oz',
      unitPrice: '$0.17 / oz',
      isOptimal: true,
      explanation: 'Bulk whole foods provide 4 full meals for less than the price of 1 frozen kit.',
    },
  },
  {
    title: 'The Checkout Register Trap',
    category: 'Subscriptions & Add-ons',
    optionA: {
      name: 'Decline "VIP Loyalty Club ($14.99/mo Auto-Renew)"',
      price: 0,
      size: 'One-time',
      unitPrice: 'Saves $180/yr',
      isOptimal: true,
      explanation: 'Subscription traps rely on human forgetfulness to silently bill you $180 every year.',
    },
    optionB: {
      name: 'Accept "First Month Free VIP Trial (Renews at $14.99/mo)"',
      price: 0,
      size: 'Trap',
      unitPrice: 'High Friction',
      isOptimal: false,
      explanation: 'Companies make cancelling subscriptions frustrating on purpose to keep billing you.',
    },
  },
];

interface SupermarketBasketProps {
  onComplete: (savingsFound: number, xpReward: number) => void;
  onClose: () => void;
}

export const SupermarketBasketMinigame: React.FC<SupermarketBasketProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState<number>(0);
  const [totalSaved, setTotalSaved] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<'A' | 'B' | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const current = COMPARISONS[step];

  const handlePick = (choice: 'A' | 'B') => {
    setSelectedOpt(choice);
    setShowFeedback(true);
    const chosen = choice === 'A' ? current.optionA : current.optionB;

    if (chosen.isOptimal) {
      soundFx.playCoin();
      setTotalSaved((s) => s + 45);
    } else {
      soundFx.playBadTwist();
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOpt(null);
    if (step < COMPARISONS.length - 1) {
      setStep((st) => st + 1);
    } else {
      setIsDone(true);
      soundFx.playLevelUp();
      confetti({ particleCount: 60, spread: 50 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-7 border border-amber-500/40 shadow-2xl relative bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              MegaMart Duel ({step + 1} / {COMPARISONS.length})
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Smart Shopper Unit Price Challenge
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">✕</button>
        </div>

        {!isDone ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Pick the smart financial choice based on <strong>Unit Price ($/oz)</strong> and hidden friction:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A */}
              <button
                disabled={showFeedback}
                onClick={() => handlePick('A')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedOpt === 'A'
                    ? current.optionA.isOptimal
                      ? 'bg-emerald-950/40 border-emerald-500'
                      : 'bg-rose-950/40 border-rose-500'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-xs text-white">{current.optionA.name}</span>
                  <span className="font-mono font-bold text-emerald-400">${current.optionA.price.toFixed(2)}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Size: {current.optionA.size} • Unit: <strong className="text-cyan-400">{current.optionA.unitPrice}</strong>
                </div>
              </button>

              {/* Option B */}
              <button
                disabled={showFeedback}
                onClick={() => handlePick('B')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedOpt === 'B'
                    ? current.optionB.isOptimal
                      ? 'bg-emerald-950/40 border-emerald-500'
                      : 'bg-rose-950/40 border-rose-500'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-xs text-white">{current.optionB.name}</span>
                  <span className="font-mono font-bold text-emerald-400">${current.optionB.price.toFixed(2)}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Size: {current.optionB.size} • Unit: <strong className="text-cyan-400">{current.optionB.unitPrice}</strong>
                </div>
              </button>
            </div>

            {/* Explanation card */}
            {showFeedback && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 animate-in fade-in text-xs space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  {(selectedOpt === 'A' ? current.optionA.isOptimal : current.optionB.isOptimal) ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Smart Pick!</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Marketing Trap!</span>
                  )}
                </div>
                <p className="text-slate-300">
                  {selectedOpt === 'A' ? current.optionA.explanation : current.optionB.explanation}
                </p>

                <button
                  onClick={handleNext}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs mt-2 cursor-pointer"
                >
                  Next Shelf Item ➔
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl">🛒</div>
            <h4 className="text-2xl font-extrabold text-white">Grocery Cart Complete!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              You shaved hundreds of dollars off your annual grocery and subscription burn by focusing on unit prices and avoiding marketing markups!
            </p>

            <button
              onClick={() => onComplete(totalSaved, 100)}
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
            >
              Collect ${totalSaved} Savings & Return to Market
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
