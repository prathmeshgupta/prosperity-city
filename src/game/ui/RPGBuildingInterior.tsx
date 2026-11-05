import React, { useState } from 'react';
import { BuildingEntrance } from '../world/mapData';
import { GameState } from '../../types/game';
import { soundFx } from '../../audio/soundFx';
import { 
  LogOut, 
  Sparkles, 
  Landmark, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Car, 
  Home, 
  Coffee, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface RPGBuildingInteriorProps {
  building: BuildingEntrance;
  state: GameState;
  onExit: () => void;
  onUpdateState: (newState: GameState) => void;
}

export const RPGBuildingInterior: React.FC<RPGBuildingInteriorProps> = ({
  building,
  state,
  onExit,
  onUpdateState,
}) => {
  const [activeTab, setActiveTab] = useState<string>('main');
  const [interactionToast, setInteractionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInteractionToast(msg);
    setTimeout(() => setInteractionToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-4xl w-full h-[90vh] rounded-3xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Building Interior Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border"
              style={{ backgroundColor: `${building.color}15`, borderColor: `${building.color}40` }}
            >
              {building.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {building.district}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {building.name}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{building.subtitle}</p>
            </div>
          </div>

          {/* Exit Door Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onExit();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-emerald-400" />
            <span>Exit to Street [ESC]</span>
          </button>
        </div>

        {/* Interior Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Toast Notification */}
          {interactionToast && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{interactionToast}</span>
            </div>
          )}

          {/* 1. BANK INTERIOR */}
          {building.type === 'BANK' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
                <span className="text-3xl">🤵</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Banker Sterling's Desk</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Welcome! Your High-Yield Savings Vault pays <strong>4.5% APY</strong> compounded monthly. Keeping 3 to 6 months of expenses here protects you from market downturns!"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Checking Balance:</span>
                    <span className="font-mono font-bold text-white">${Math.round(state.cash).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">High-Yield Vault:</span>
                    <span className="font-mono font-bold text-emerald-400">${Math.round(state.emergencyFund).toLocaleString()}</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        if (state.cash < 250) {
                          showToast('Insufficient checking cash');
                          return;
                        }
                        soundFx.playCoin();
                        state.cash -= 250;
                        state.emergencyFund += 250;
                        onUpdateState({ ...state });
                        showToast('Deposited $250 into 4.5% APY High-Yield Vault!');
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Deposit $250 to Vault
                    </button>
                    <button
                      onClick={() => {
                        if (state.emergencyFund < 250) {
                          showToast('Insufficient vault funds');
                          return;
                        }
                        soundFx.playCoin();
                        state.emergencyFund -= 250;
                        state.cash += 250;
                        onUpdateState({ ...state });
                        showToast('Withdrew $250 to checking cash.');
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                    >
                      Withdraw $250
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Debt Payoff Teller
                  </h4>
                  {state.debts.length === 0 ? (
                    <p className="text-xs text-emerald-400 font-semibold">
                      🎉 You are completely debt-free! No loan monsters here.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {state.debts.map((d) => (
                        <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 text-xs">
                          <div>
                            <span className="font-bold text-white block">{d.name}</span>
                            <span className="text-[10px] text-rose-400 font-mono">
                              ${Math.round(d.principal).toLocaleString()} at {Math.round(d.interestRate * 100)}% APR
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const pay = Math.min(state.cash, Math.min(d.principal, 500));
                              if (pay <= 0) {
                                showToast('Insufficient cash to pay debt');
                                return;
                              }
                              soundFx.playCoin();
                              state.cash -= pay;
                              d.principal -= pay;
                              if (d.principal <= 0) {
                                state.debts = state.debts.filter((item) => item.id !== d.id);
                                soundFx.playLevelUp();
                                showToast(`🎉 Fully crushed ${d.name}!`);
                              } else {
                                showToast(`Paid $${pay} principal toward ${d.name}!`);
                              }
                              onUpdateState({ ...state });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Pay $500
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. STOCK EXCHANGE INTERIOR */}
          {building.type === 'STOCK_EXCHANGE' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-start gap-3">
                <span className="text-3xl">🏛️</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Floor Broker Terminal</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Buy slices of the world's most profitable corporations! A single share of the S&P 500 holds 500 companies at once with an ultra-low 0.03% expense fee."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.assets.slice(0, 4).map((asset) => {
                  const pos = state.portfolio.find((p) => p.assetId === asset.id);
                  return (
                    <div key={asset.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-white text-sm">{asset.symbol}</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">${asset.currentPrice}</span>
                        </div>
                        <h5 className="text-xs text-slate-300 font-semibold">{asset.name}</h5>
                        <p className="text-[11px] text-slate-400 mt-1">{asset.educationalNote}</p>
                        {pos && (
                          <div className="mt-2 text-[10px] text-teal-300 font-mono">
                            Owned: {pos.shares.toFixed(2)} shares (${Math.round(pos.shares * asset.currentPrice).toLocaleString()})
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex gap-2">
                        <button
                          onClick={() => {
                            if (state.cash < asset.currentPrice) {
                              showToast(`Insufficient cash: need $${asset.currentPrice}`);
                              return;
                            }
                            soundFx.playCoin();
                            state.cash -= asset.currentPrice;
                            const existing = state.portfolio.find((p) => p.assetId === asset.id);
                            if (existing) existing.shares += 1;
                            else state.portfolio.push({ assetId: asset.id, shares: 1, costBasis: asset.currentPrice });
                            onUpdateState({ ...state });
                            showToast(`Bought 1 share of ${asset.symbol} on the trading floor!`);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                        >
                          Buy 1 Share (${asset.currentPrice})
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. AUTO DEALERSHIP INTERIOR */}
          {building.type === 'AUTO_DEALER' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 flex items-start gap-3">
                <span className="text-3xl">🚗</span>
                <div>
                  <h4 className="font-bold text-sm text-white">The Car Dealership Dilemma</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Salesmen will try to lock you into a 6-year $650/month loan on a luxury sports car. Financing a depreciating asset is the #1 reason people struggle to save!"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3">
                  <div className="text-2xl">🚙</div>
                  <h4 className="font-bold text-sm text-white">Reliable Used Japanese Commuter</h4>
                  <p className="text-xs text-slate-400">
                    High safety, 38 MPG, minimal maintenance, purchased in cash. Zero monthly car payments!
                  </p>
                  <div className="font-mono text-base font-bold text-emerald-400">
                    $4,500 Cash (One-time)
                  </div>
                  <button
                    onClick={() => {
                      if (state.cash < 4500) {
                        showToast('Insufficient cash: save up $4,500 for the cash car');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 4500;
                      state.character.happiness = Math.min(100, state.character.happiness + 8);
                      onUpdateState({ ...state });
                      showToast('🚗 Bought reliable commuter in cash! Zero debt payments forever.');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Buy in Cash ($4,500)
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-3">
                  <div className="text-2xl">🏎️</div>
                  <h4 className="font-bold text-sm text-white">Shiny Flashy Sports Sedan</h4>
                  <p className="text-xs text-slate-400">
                    Depreciates 20% immediately. Binds you to 60 months of high payments and expensive insurance.
                  </p>
                  <div className="font-mono text-base font-bold text-rose-400">
                    $620 / month for 5 Years ($37,000 total)
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playBadTwist();
                      state.debts.push({
                        id: `debt_car_${Date.now()}`,
                        name: 'Luxury Sports Car 5-Year Loan',
                        category: 'AUTO_LOAN',
                        principal: 32000,
                        interestRate: 0.08,
                        minimumMonthlyPayment: 620,
                        educationalTip: 'Auto debt steals thousands from monthly investment capacity.',
                      });
                      state.character.happiness = Math.min(100, state.character.happiness + 5);
                      onUpdateState({ ...state });
                      showToast('Signed 5-year sports car loan! Added $620/mo liability.');
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer"
                  >
                    Sign 5-Year Loan ($32k debt)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. CAREER TOWER INTERIOR */}
          {building.type === 'CAREER_TOWER' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 flex items-start gap-3">
                <span className="text-3xl">🏢</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Human Capital Headquarters</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Your primary income is your greatest wealth generation engine. Completing workplace achievements and upskilling permanently raises your compounding baseline."
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Current Annual Salary</span>
                    <span className="font-mono text-2xl font-bold text-emerald-400">
                      ${state.character.annualSalary.toLocaleString()}/yr
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-white text-xs font-bold">
                    {state.character.careerTitle}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.character.annualSalary += 3500;
                      state.character.happiness = Math.min(100, state.character.happiness + 6);
                      onUpdateState({ ...state });
                      showToast('🎉 Negotiated workplace promotion! +$3,500/year salary bump.');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Deliver High-Impact Project & Claim Promotion (+$3,500/yr)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. UNIVERSITY INTERIOR */}
          {building.type === 'UNIVERSITY' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 flex items-start gap-3">
                <span className="text-3xl">🎓</span>
                <div>
                  <h4 className="font-bold text-sm text-white">FinTwist University Lecture Hall</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Knowledge is the only asset that cannot be stolen from you. Test your intuition on the Rule of 72!"
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <h4 className="font-bold text-sm text-white">Mini-Quiz Challenge:</h4>
                <p className="text-slate-300">
                  If an investment returns 8% per year, how many years does it take to double according to the Rule of 72?
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {['6 years', '9 years', '12 years', '18 years'].map((ans, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (ans === '9 years') {
                          soundFx.playLevelUp();
                          state.cash += 150;
                          state.totalXP += 75;
                          onUpdateState({ ...state });
                          showToast('🎉 Correct! 72 ÷ 8 = 9 Years! Earned $150 scholarship + 75 XP!');
                        } else {
                          soundFx.playBadTwist();
                          showToast('Not quite! Remember: 72 ÷ Return Rate % = Doubling Years.');
                        }
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500 text-slate-200 font-semibold cursor-pointer text-left"
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. HOME SWEET HOME INTERIOR */}
          {building.type === 'HOME' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-800/40 flex items-start gap-3">
                <span className="text-3xl">🏡</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Your Home & Rest Sanctuary</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Take a deep breath. Review your financial journey, rest up to restore happiness and energy, and prepare for the next chapter."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 block">Personal Balance Snapshot</span>
                  <div className="font-mono text-xl font-bold text-white">
                    Age {state.character.age} • Year {Math.floor((state.month - 1) / 12) + 1}
                  </div>
                  <div className="text-emerald-400 font-bold">
                    Happiness: {state.character.happiness}% • Health: {state.character.health}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-300 font-semibold">
                    Rest & Recharge
                  </span>
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.character.happiness = Math.min(100, state.character.happiness + 10);
                      state.character.health = Math.min(100, state.character.health + 10);
                      onUpdateState({ ...state });
                      showToast('✨ Took a good night’s rest: +10% Happiness & Health!');
                    }}
                    className="w-full py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs cursor-pointer mt-2"
                  >
                    Take a Rest Day (+Happiness & Health)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. FALLBACK / OTHER BUILDINGS */}
          {!['BANK', 'STOCK_EXCHANGE', 'AUTO_DEALER', 'CAREER_TOWER', 'UNIVERSITY', 'HOME'].includes(building.type) && (
            <div className="p-8 text-center space-y-4">
              <div className="text-5xl">{building.icon}</div>
              <h3 className="text-xl font-bold text-white">{building.name}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {building.description}
              </p>
              <button
                onClick={() => {
                  soundFx.playCoin();
                  state.cash += 50;
                  onUpdateState({ ...state });
                  showToast(`Interacted with ${building.name}! +$50 discovered.`);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Explore & Interact
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
