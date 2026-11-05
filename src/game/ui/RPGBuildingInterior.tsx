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
  DollarSign,
  Gamepad2,
  Bike,
  Heart,
  Dog,
  ShoppingCart,
  Building2,
  Percent,
  Crown
} from 'lucide-react';

interface RPGBuildingInteriorProps {
  building: BuildingEntrance;
  state: GameState;
  onExit: () => void;
  onUpdateState: (newState: GameState) => void;
  onLaunchMinigame: (gameType: 'VAULT_SORTER' | 'DCA_WAVE' | 'GROCERY') => void;
  onOpenLegacyModal?: () => void;
  onEquipVehicle?: (vehicle: 'FOOT' | 'BICYCLE' | 'CAR') => void;
  onEquipPet?: () => void;
  currentVehicle?: 'FOOT' | 'BICYCLE' | 'CAR';
  hasPet?: boolean;
}

export const RPGBuildingInterior: React.FC<RPGBuildingInteriorProps> = ({
  building,
  state,
  onExit,
  onUpdateState,
  onLaunchMinigame,
  onOpenLegacyModal,
  onEquipVehicle,
  onEquipPet,
  currentVehicle = 'FOOT',
  hasPet = false,
}) => {
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
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🤵</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Banker Sterling's Desk</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Welcome! Your High-Yield Savings Vault pays <strong>4.5% APY</strong> compounded monthly. Keeping 3 to 6 months of expenses here protects you from market downturns!"
                    </p>
                  </div>
                </div>

                {/* Minigame Launcher */}
                <button
                  onClick={() => onLaunchMinigame('VAULT_SORTER')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>PLAY VAULT SORTER MINIGAME</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Checking Balance:</span>
                    <span className="font-mono font-bold text-white">${Math.round(state.cash).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">High-Yield Vault (4.5% APY):</span>
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
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🏛️</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Floor Broker Terminal</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Buy slices of the world's most profitable corporations! Dollar-cost averaging index funds beats 90% of active stock pickers over a 10-year horizon."
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchMinigame('DCA_WAVE')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>PLAY DCA WAVE RIDER</span>
                </button>
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
                  <h4 className="font-bold text-sm text-white">Prestige Motors Showroom</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Purchasing a vehicle increases your travel speed across Prosperity City! But beware financing luxury cars that steal your compounding capacity."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Commuter Bicycle */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl">🚲</div>
                    <h4 className="font-bold text-xs text-white mt-1">City Commuter Bicycle</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Boosts movement speed from 190 to <strong>280 px/sec</strong>. Zero gas, zero insurance!
                    </p>
                    <div className="font-mono text-sm font-bold text-amber-400 mt-2">$250 Cash</div>
                  </div>
                  <button
                    onClick={() => {
                      if (state.cash < 250) {
                        showToast('Need $250 cash for bicycle');
                        return;
                      }
                      soundFx.playCoin();
                      state.cash -= 250;
                      onEquipVehicle?.('BICYCLE');
                      onUpdateState({ ...state });
                      showToast('🚲 Equipped Commuter Bicycle! Speed increased to 280 px/s.');
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    {currentVehicle === 'BICYCLE' ? 'Already Equipped' : 'Buy Bike ($250)'}
                  </button>
                </div>

                {/* Reliable Used Car */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl">🚙</div>
                    <h4 className="font-bold text-xs text-white mt-1">Reliable Used Japanese Sedan</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Boosts travel speed to <strong>410 px/sec</strong>! Reliable, cash-bought, zero debt.
                    </p>
                    <div className="font-mono text-sm font-bold text-emerald-400 mt-2">$4,500 Cash</div>
                  </div>
                  <button
                    onClick={() => {
                      if (state.cash < 4500) {
                        showToast('Insufficient cash: save up $4,500 for cash car');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 4500;
                      onEquipVehicle?.('CAR');
                      onUpdateState({ ...state });
                      showToast('🚗 Equipped Reliable Sedan! Speed increased to 410 px/s.');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    {currentVehicle === 'CAR' ? 'Already Driving' : 'Buy Cash ($4,500)'}
                  </button>
                </div>

                {/* Sports Car Debt Trap */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl">🏎️</div>
                    <h4 className="font-bold text-xs text-white mt-1">Luxury Sports Coupe (Debt Trap)</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      60 months of $620 payments + 8% interest. Locks away $37k from investments!
                    </p>
                    <div className="font-mono text-sm font-bold text-rose-400 mt-2">$620/mo (5-Yr Loan)</div>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playBadTwist();
                      state.debts.push({
                        id: `debt_car_${Date.now()}`,
                        name: 'Sports Coupe 5-Yr Loan',
                        category: 'AUTO_LOAN',
                        principal: 32000,
                        interestRate: 0.08,
                        minimumMonthlyPayment: 620,
                        educationalTip: 'Auto debt deprives your compounding engine.',
                      });
                      onEquipVehicle?.('CAR');
                      onUpdateState({ ...state });
                      showToast('⚠️ Signed 5-year auto loan! Added $620/mo liability.');
                    }}
                    className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer"
                  >
                    Sign 5-Yr Loan ($32k)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. REAL ESTATE / TURNKEY DUPLEX */}
          {building.type === 'RENTAL_PROPERTY' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
                <span className="text-3xl">🏘️</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Suburban Turnkey Duplex Opportunity</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Real estate provides 4 wealth pillars: cashflow rent checks, loan paydown, tax depreciation, and long-term appreciation."
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Property Price</span>
                    <span className="font-bold text-white text-sm">$320,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-slate-400 uppercase block">20% Down Payment</span>
                    <span className="font-bold text-emerald-400 text-sm">$64,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Monthly Rent</span>
                    <span className="font-bold text-cyan-400 text-sm">+$2,400/mo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-slate-400 uppercase block">Ownership Status</span>
                    <span className="font-bold text-amber-400 text-sm">
                      {building.isOwnedByPlayer ? 'OWNED' : 'FOR SALE'}
                    </span>
                  </div>
                </div>

                {building.isOwnedByPlayer ? (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    🎉 You own this turnkey duplex! It generates $2,400/month in passive rental income directly into your cashflow.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (state.cash < 64000) {
                        showToast('Need $64,000 cash for 20% down payment');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 64000;
                      building.isOwnedByPlayer = true;
                      state.debts.push({
                        id: 'debt_duplex_mortgage',
                        name: '30-Yr Fixed Duplex Mortgage',
                        category: 'MORTGAGE',
                        principal: 256000,
                        interestRate: 0.065,
                        minimumMonthlyPayment: 1618,
                        educationalTip: 'Tenants pay your mortgage while you keep the net spread!',
                      });
                      onUpdateState({ ...state });
                      showToast('🎉 Purchased Suburban Duplex! Collecting $2,400/month rent!');
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
                  >
                    PUT 20% DOWN ($64,000) & BUY DUPLEX
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. MEGAMART LIFESTYLE CENTER */}
          {building.type === 'SUPERSTORE' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🛒</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">MegaMart Lifestyle Center</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Watch out for unit pricing tricks and lifestyle subscription creep! Always calculate $/oz instead of package sizes."
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchMinigame('GROCERY')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>PLAY SMART GROCERY DUEL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Monthly Groceries (Frugal Bulk)</h5>
                  <p className="text-[11px] text-slate-400">Restock fresh produce, oats, and healthy staples.</p>
                  <button
                    onClick={() => {
                      if (state.cash < 180) {
                        showToast('Insufficient cash for groceries');
                        return;
                      }
                      soundFx.playCoin();
                      state.cash -= 180;
                      state.character.health = Math.min(100, state.character.health + 5);
                      onUpdateState({ ...state });
                      showToast('🛒 Restocked nutritious bulk groceries for $180! Health +5%');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer mt-2"
                  >
                    Buy Bulk Groceries ($180)
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Cancel Unused Subscriptions</h5>
                  <p className="text-[11px] text-slate-400">Cancel streaming apps and gym memberships you haven't used in 90 days.</p>
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.cash += 85;
                      onUpdateState({ ...state });
                      showToast('✂️ Audited subscriptions! Saved $85 recurring monthly cashflow!');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer mt-2"
                  >
                    Audit & Cancel Subscriptions (Save $85)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. STARTER STUDIO HOME & PET ADOPTION */}
          {building.type === 'HOME' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-800/40 flex items-start gap-3">
                <span className="text-3xl">🏡</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Your Starter Studio Sanctuary</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Rest up to restore happiness and health. You can also adopt the loyal Compound Hound 🐕 to accompany you on your financial journey!"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Rest & Sleep Sanctuary</span>
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Full 8 hours of sleep resets your stamina, clears fatigue, and boosts health.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.character.happiness = Math.min(100, state.character.happiness + 15);
                      state.character.health = Math.min(100, state.character.health + 15);
                      onUpdateState({ ...state });
                      showToast('✨ Slept soundly: +15% Happiness & Health!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Take a Rest Day (+15% Happiness & Health)
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Dog className="w-4 h-4 text-amber-400" />
                      <span>Adopt Compound Hound 🐕</span>
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      A golden retriever who loves compounding dividends! Trots behind you on the city map.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (hasPet) {
                        showToast('Compound Hound is already trotting beside you!');
                        return;
                      }
                      if (state.cash < 150) {
                        showToast('Need $150 to adopt pet');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 150;
                      onEquipPet?.();
                      onUpdateState({ ...state });
                      showToast('🐕 Adopted Compound Hound! He now follows you on the city map!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    {hasPet ? '🐕 Hound Following You' : 'Adopt Hound ($150)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. CAREER TOWER */}
          {building.type === 'CAREER_TOWER' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 flex items-start gap-3">
                <span className="text-3xl">🏢</span>
                <div>
                  <h4 className="font-bold text-sm text-white">Apex Career Tower</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Clock in for work shifts to collect salary wages, take high-visibility initiatives, and request promotions!"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      soundFx.playCoin();
                      const monthlyPay = Math.round(state.character.annualSalary / 12);
                      state.cash += monthlyPay;
                      state.totalXP += 30;
                      onUpdateState({ ...state });
                      showToast(`💼 Clocked in monthly shift! Collected +$${monthlyPay.toLocaleString()} paycheck!`);
                    }}
                    className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    Clock In Monthly Shift (+${Math.round(state.character.annualSalary / 12).toLocaleString()})
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.character.annualSalary += 4000;
                      state.totalXP += 50;
                      onUpdateState({ ...state });
                      showToast('🎉 Promoted! Salary permanently raised +$4,000/yr!');
                    }}
                    className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Deliver High-Impact Initiative (+4k/yr Raise)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. THE DAILY GRIND CAFE */}
          {building.type === 'CAFE' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
                <span className="text-3xl">☕</span>
                <div>
                  <h4 className="font-bold text-sm text-white">The Daily Grind Cafe</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    "Network with local freelancers, grab fresh espresso, and pick up weekend consulting contracts."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Artisanal Espresso</h5>
                  <p className="text-[11px] text-slate-400">A rich double shot of dark roast. Restores vitality.</p>
                  <button
                    onClick={() => {
                      if (state.cash < 5) return;
                      soundFx.playClick();
                      state.cash -= 5;
                      state.character.happiness = Math.min(100, state.character.happiness + 4);
                      onUpdateState({ ...state });
                      showToast('☕ Sipped a delicious espresso! Happiness +4%');
                    }}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer mt-2"
                  >
                    Drink Espresso ($5)
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Weekend Freelancing Gig</h5>
                  <p className="text-[11px] text-slate-400">Build a landing page or audit a spreadsheet for a client.</p>
                  <button
                    onClick={() => {
                      soundFx.playCoin();
                      state.cash += 350;
                      state.totalXP += 35;
                      onUpdateState({ ...state });
                      showToast('💻 Finished weekend gig! Earned +$350 cash + 35 XP!');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer mt-2"
                  >
                    Complete Freelance Gig (+$350)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. TOWN HALL & CIVIC ARCHIVES */}
          {building.type === 'TOWN_HALL' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🏛️</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Prosperity Town Hall & Civic Archives</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Inspect city land deeds, check civic tax assessments, and record your family estate in the Prosperity Hall of Fame."
                    </p>
                  </div>
                </div>

                {onOpenLegacyModal && (
                  <button
                    onClick={onOpenLegacyModal}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>ESTATE & NEW GAME+</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Prosperity Hall of Fame</h5>
                  <p className="text-[11px] text-slate-400">
                    Immortalize your founder stats, total career earnings, and final net worth across generations.
                  </p>
                  <button
                    onClick={onOpenLegacyModal}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer mt-2"
                  >
                    View Generational Records
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-white">Civic Tax Clearance</h5>
                  <p className="text-[11px] text-slate-400">Verify property taxes and claim municipal standard deductions.</p>
                  <button
                    onClick={() => {
                      soundFx.playCoin();
                      state.cash += 200;
                      onUpdateState({ ...state });
                      showToast('🏛️ Filed municipal property tax exemption! +$200 credit.');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer mt-2"
                  >
                    Claim Municipal Credit (+$200)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fallback */}
          {!['BANK', 'STOCK_EXCHANGE', 'AUTO_DEALER', 'RENTAL_PROPERTY', 'SUPERSTORE', 'HOME', 'CAREER_TOWER', 'CAFE', 'TOWN_HALL'].includes(building.type) && (
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
                  showToast(`Interacted with ${building.name}! Discovered +$50 bonus!`);
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
