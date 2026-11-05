import React, { useState } from 'react';
import { GameState } from '../../../types/game';
import { soundFx } from '../../../audio/soundFx';
import { BuildingEntrance } from '../../world/mapData';
import { 
  Rocket, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Coins, 
  Award,
  Zap,
  Code
} from 'lucide-react';

interface TechIncubatorInteriorProps {
  building: BuildingEntrance;
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  showToast: (msg: string) => void;
}

export const TechIncubatorInterior: React.FC<TechIncubatorInteriorProps> = ({
  state,
  onUpdateState,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'EQUITY_COMP' | 'ANGEL_SYNDICATE' | 'TECH_LADDER'>('EQUITY_COMP');
  const [syndicateHistory, setSyndicateHistory] = useState<string[]>([]);

  // 1. ESPP Enrollment
  const handleEnrollESPP = () => {
    if (state.cash < 1500) {
      showToast('Need $1,500 cash to fund quarterly ESPP payroll deduction.');
      return;
    }
    const nextState = { ...state };
    nextState.cash -= 1500;
    // 15% discount means you buy $1,765 worth of shares for $1,500!
    const marketValue = Math.round(1500 / 0.85);
    const instantProfit = marketValue - 1500;
    nextState.cash += marketValue; // Sold immediately or held
    nextState.totalXP += 180;
    soundFx.playCoin();
    onUpdateState(nextState);
    showToast(`ESPP Executed! Bought at 15% discount. Instant profit: +$${instantProfit.toLocaleString()}!`);
  };

  // 2. Angel Syndicate Participation
  const handleAngelInvestment = (amount: number) => {
    if (state.cash < amount) {
      showToast(`Need $${amount.toLocaleString()} cash to participate in this seed syndicate.`);
      return;
    }

    const nextState = { ...state };
    nextState.cash -= amount;

    // Power Law simulation
    const rand = Math.random();
    let outcomeText = '';

    if (rand < 0.70) {
      // 70% complete loss
      outcomeText = `Seed round failed. The startup shut down ($0 returned). Write off -$${amount.toLocaleString()} on taxes.`;
      nextState.recentEvents.push({
        month: nextState.month,
        text: `🚀 Angel Syndicate: ${outcomeText}`,
        type: 'negative',
      });
      soundFx.playClick();
    } else if (rand < 0.90) {
      // 20% break-even
      nextState.cash += amount;
      outcomeText = `Startup acquired at cost. Returned your $${amount.toLocaleString()} principal.`;
      nextState.recentEvents.push({
        month: nextState.month,
        text: `🚀 Angel Syndicate: ${outcomeText}`,
        type: 'info',
      });
      soundFx.playCoin();
    } else {
      // 10% 15x Unicorn Exit!
      const returnMultiple = 15;
      const payout = amount * returnMultiple;
      nextState.cash += payout;
      nextState.totalXP += 500;
      outcomeText = `🦄 UNICORN EXIT! Startup reached Series B valuation at 15x! Payout: +$${payout.toLocaleString()}!`;
      nextState.recentEvents.push({
        month: nextState.month,
        text: `🚀 Angel Syndicate: ${outcomeText}`,
        type: 'positive',
      });
      soundFx.playLevelUp();
    }

    setSyndicateHistory((prev) => [outcomeText, ...prev.slice(0, 4)]);
    onUpdateState(nextState);
    showToast(outcomeText);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🚀
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Silicon Forge & Tech Quarter
              </span>
              <h3 className="font-extrabold text-white text-base">Silicon Forge AI Incubator & Equity Hub</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              "Master executive equity compensation: RSUs, ISOs, 15% ESPP discounts, and angel venture syndicates governed by the venture capital power law."
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Tech Status</div>
          <div className="text-sm font-black text-indigo-400">QUALIFIED INVESTOR</div>
          <div className="text-[10px] text-slate-400">Venture Power Law Active</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('EQUITY_COMP')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'EQUITY_COMP'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>RSUs, ISOs & ESPP (15% Off)</span>
        </button>

        <button
          onClick={() => setActiveTab('ANGEL_SYNDICATE')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'ANGEL_SYNDICATE'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Angel Syndicate Deals</span>
        </button>

        <button
          onClick={() => setActiveTab('TECH_LADDER')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'TECH_LADDER'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Founder & AI Upskilling</span>
        </button>
      </div>

      {/* TAB 1: EQUITY COMPENSATION */}
      {activeTab === 'EQUITY_COMP' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. ESPP Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Guaranteed Return
                  </span>
                  <span className="text-xs font-bold text-emerald-400">15% Discount</span>
                </div>

                <h4 className="font-extrabold text-sm text-white mt-2">Employee Stock Purchase Plan (ESPP)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Purchase public employer stock at a <strong>15% discount</strong> to fair market value via payroll deduction. Selling immediately locks in a risk-free <strong>+17.6% return</strong>!
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={handleEnrollESPP}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  EXERCISE ESPP ($1,500)
                </button>
              </div>
            </div>

            {/* 2. RSU Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    Ordinary Income
                  </span>
                  <span className="text-xs font-bold text-indigo-400">Vesting Cliff</span>
                </div>

                <h4 className="font-extrabold text-sm text-white mt-2">Restricted Stock Units (RSUs)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  RSUs are taxed as ordinary W-2 income on the day they vest. Warning: Companies automatically withhold only 22% federal tax; if you are in the 32%+ bracket, set aside cash for the difference!
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rule: Sell to diversify into index funds</span>
                </div>
              </div>
            </div>

            {/* 3. ISO Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    AMT Tax Trap
                  </span>
                  <span className="text-xs font-bold text-amber-400">Options</span>
                </div>

                <h4 className="font-extrabold text-sm text-white mt-2">Incentive Stock Options (ISOs)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Right to purchase shares at strike price. Beware: Exercising ISOs creates an Alternative Minimum Tax (AMT) liability on paper gains even if you cannot sell the private shares!
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Model AMT before early exercise</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: ANGEL SYNDICATE */}
      {activeTab === 'ANGEL_SYNDICATE' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2 mb-1">
              <Rocket className="w-4 h-4 text-indigo-400" />
              Venture Capital Power Law Syndicate
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              CFA Private Equity Principle: 70% of early-stage startups fail completely, 20% return 1x, and 10% become 15x–50x unicorns that carry the entire portfolio return.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleAngelInvestment(1000)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                BACK SEED TICKET ($1,000)
              </button>

              <button
                onClick={() => handleAngelInvestment(5000)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-purple-500/20"
              >
                LEAD SYNDICATE ($5,000)
              </button>
            </div>

            {/* Syndicate History */}
            {syndicateHistory.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Recent Deal Outcomes</div>
                {syndicateHistory.map((h, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FOUNDER UPSKILLING */}
      {activeTab === 'TECH_LADDER' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-white">Full-Stack AI Architecture Masterclass</h4>
              <p className="text-xs text-slate-400 mt-1">
                Complete the enterprise agentic AI certification. +$24,000 annual salary boost!
              </p>
            </div>

            <button
              onClick={() => {
                if (state.cash < 2000) {
                  showToast('Need $2,000 cash for tuition.');
                  return;
                }
                state.cash -= 2000;
                state.character.annualSalary += 24000;
                state.totalXP += 350;
                soundFx.playLevelUp();
                onUpdateState({ ...state });
                showToast('Masterclass Completed! Base salary boosted by +$24,000/yr!');
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs cursor-pointer"
            >
              ENROLL ($2,000)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
