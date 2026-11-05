import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../../audio/soundFx';
import confetti from 'canvas-confetti';
import { TrendingUp, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface DCAWaveRiderProps {
  onComplete: (sharesAcquired: number, profit: number, xpReward: number) => void;
  onClose: () => void;
}

export const DCAWaveRiderMinigame: React.FC<DCAWaveRiderProps> = ({ onComplete, onClose }) => {
  const [phase, setPhase] = useState<'PLAY' | 'RESULTS'>('PLAY');
  const [cashBudget, setCashBudget] = useState<number>(1000);
  const [sharesOwned, setSharesOwned] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(100);
  const [priceHistory, setPriceHistory] = useState<number[]>([100, 102, 105, 98, 95]);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isDCAActive, setIsDCAActive] = useState<boolean>(true);
  const [marketMood, setMarketMood] = useState<'BULL' | 'CRASH' | 'RECOVERY'>('BULL');

  // Real-time price wave engine
  useEffect(() => {
    if (secondsLeft <= 0) {
      setPhase('RESULTS');
      soundFx.playLevelUp();
      confetti({ particleCount: 70, spread: 60 });
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);

      // Fluctuate price
      setCurrentPrice((prev) => {
        let delta = (Math.random() - 0.48) * 8;
        if (secondsLeft === 20 || secondsLeft === 19 || secondsLeft === 18) {
          // Simulated flash crash!
          delta = -14;
          setMarketMood('CRASH');
        } else if (secondsLeft < 15) {
          delta = (Math.random() - 0.35) * 9;
          setMarketMood('RECOVERY');
        } else {
          setMarketMood('BULL');
        }

        const newP = Math.max(35, Math.round(prev + delta));
        setPriceHistory((h) => [...h.slice(-25), newP]);
        return newP;
      });

      // If automated DCA is active, automatically buy $100 shares every 3 seconds!
      if (isDCAActive && secondsLeft % 3 === 0 && cashBudget >= 100) {
        soundFx.playCoin();
        setCashBudget((c) => c - 100);
        setSharesOwned((s) => s + 100 / currentPrice);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isDCAActive, currentPrice, cashBudget]);

  const handleManualBuy = () => {
    if (cashBudget < 100) return;
    soundFx.playCoin();
    setCashBudget((c) => c - 100);
    setSharesOwned((s) => s + 100 / currentPrice);
  };

  const handlePanicSell = () => {
    if (sharesOwned <= 0) return;
    soundFx.playBadTwist();
    const proceeds = sharesOwned * currentPrice;
    setCashBudget((c) => c + proceeds);
    setSharesOwned(0);
  };

  const totalPortfolioValue = cashBudget + sharesOwned * currentPrice;
  const netProfit = Math.round(totalPortfolioValue - 1000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-7 border border-cyan-500/40 shadow-2xl relative bg-slate-900/95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Wall Street Mini-Game
              </span>
              <span className="text-xs text-slate-400 font-mono">Time: {secondsLeft}s</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              The DCA Wave Rider
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Portfolio Value</span>
            <span className={`font-mono text-xl sm:text-2xl font-extrabold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${Math.round(totalPortfolioValue).toLocaleString()}
            </span>
          </div>
        </div>

        {phase === 'PLAY' ? (
          <div className="space-y-5">
            
            {/* Live Sparkline & Mood */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Index Price:</span>
                <span className="font-mono text-xl font-bold text-white">${currentPrice}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  marketMood === 'CRASH' ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {marketMood === 'CRASH' ? '💥 MARKET DIP (BIG DISCOUNT!)' : '📈 EXPANSION WAVE'}
                </span>
              </div>

              {/* SVG Wave */}
              <div className="h-24 w-full flex items-end gap-1 pt-2">
                {priceHistory.map((val, idx) => {
                  const hPct = Math.min(100, Math.max(15, ((val - 35) / 100) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 rounded-t transition-all duration-300"
                      style={{
                        height: `${hPct}%`,
                        backgroundColor: val < 80 ? '#f43f5e' : '#10b981',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Available Cash:</span>
                <span className="font-mono font-bold text-white text-base">${Math.round(cashBudget)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Index Shares Owned:</span>
                <span className="font-mono font-bold text-cyan-400 text-base">{sharesOwned.toFixed(2)} shares</span>
              </div>
            </div>

            {/* DCA Switch & Action Buttons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-300 font-semibold">
                  Automated Dollar-Cost Averaging (DCA):
                </span>
                <button
                  onClick={() => setIsDCAActive(!isDCAActive)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                    isDCAActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDCAActive ? 'ON (Auto-Investing)' : 'OFF (Manual Only)'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleManualBuy}
                  disabled={cashBudget < 100}
                  className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
                >
                  Buy Dip ($100)
                </button>
                <button
                  onClick={handlePanicSell}
                  disabled={sharesOwned <= 0}
                  className="py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs transition-all cursor-pointer disabled:opacity-40"
                >
                  Panic Sell All (Lock in Loss)
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl">📊</div>
            <h4 className="text-2xl font-extrabold text-white">Wave Rider Results!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {netProfit >= 0
                ? 'By Dollar-Cost Averaging steadily through the dip, your average cost basis was low, earning handsome compound profits!'
                : 'Panic-selling on market red days locked in permanent losses. Always remember: corrections are discount opportunities for long-term investors!'}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-xs mx-auto space-y-1 font-mono">
              <div className="text-xs text-slate-400">Shares Accumulated: <strong className="text-white">{sharesOwned.toFixed(2)}</strong></div>
              <div className={`text-base font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netProfit >= 0 ? '+' : ''}${netProfit} Total Return
              </div>
            </div>

            <button
              onClick={() => onComplete(sharesOwned, Math.max(50, netProfit), 150)}
              className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              Collect Rewards & Return to Floor
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
