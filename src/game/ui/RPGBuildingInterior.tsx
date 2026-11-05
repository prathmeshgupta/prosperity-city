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
  Crown,
  BookOpen,
  Award,
  Activity,
  ShieldAlert,
  Lock,
  Scale,
  Key
} from 'lucide-react';

import { TaxOfficeInterior } from './institutions/TaxOfficeInterior';
import { BondPitInterior } from './institutions/BondPitInterior';
import { WealthAdvisoryInterior } from './institutions/WealthAdvisoryInterior';
import { TechIncubatorInterior } from './institutions/TechIncubatorInterior';

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
  onSwitchToWalkable?: () => void;
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
  onSwitchToWalkable,
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

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2">
            {onSwitchToWalkable && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onSwitchToWalkable();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30 cursor-pointer"
                title="Switch to Walkable 2.5D Room View"
              >
                <span>🚶 Walk Inside Room</span>
              </button>
            )}

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

          {/* 10. UNIVERSITY INTERIOR */}
          {building.type === 'UNIVERSITY' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Dean Cooper's Academic Office</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Investing in yourself yields the highest compounded return on earth. Complete financial certifications and quiz challenges to permanently boost your career salary!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academic Certification 1: Data Analytics */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>Data Analytics & Financial Modeling</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+$8,000/yr Salary</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Learn Python, SQL, and financial modeling. Unlocks immediate high-impact corporate promotion bonuses.
                  </p>
                  <button
                    onClick={() => {
                      if (state.cash < 1000) {
                        showToast('Requires $1,000 tuition cash');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 1000;
                      state.character.annualSalary += 8000;
                      state.totalXP += 150;
                      onUpdateState({ ...state });
                      showToast('🎓 Completed Data Analytics Cert! Annual Salary +$8,000/yr!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Enroll in Certificate ($1,000 Tuition)
                  </button>
                </div>

                {/* Academic Certification 2: Real Estate License */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Real Estate Broker & Escrow License</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+$6,000/yr + 150 XP</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Master commercial leases, tenant screening, property appraisals, and deed transfers.
                  </p>
                  <button
                    onClick={() => {
                      if (state.cash < 1500) {
                        showToast('Requires $1,500 tuition cash');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 1500;
                      state.character.annualSalary += 6000;
                      state.totalXP += 200;
                      onUpdateState({ ...state });
                      showToast('📜 Earned Real Estate Broker License! Salary +$6,000/yr!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Earn Broker License ($1,500 Tuition)
                  </button>
                </div>
              </div>

              {/* Financial Quiz Scholarship Challenge */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Dean's Academic Scholarship Quiz: The Rule of 72</span>
                  </h5>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Reward: +$300 Cash • +100 XP
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  "If your investment portfolio earns an <strong>8% annual return</strong>, approximately how many years does it take for your money to double under the Rule of 72?"
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      soundFx.playTwistAlert();
                      showToast('Incorrect: 72 / 8 = 9 years! Try again.');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer text-center"
                  >
                    12 Years
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.cash += 300;
                      state.totalXP += 100;
                      onUpdateState({ ...state });
                      showToast('🎉 Correct! 72 / 8% = 9 Years to double! Awarded +$300 scholarship!');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold cursor-pointer text-center border border-slate-700 hover:border-emerald-500"
                  >
                    9 Years (Correct)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playTwistAlert();
                      showToast('Incorrect: 72 / 8 = 9 years! Try again.');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer text-center"
                  >
                    6 Years
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. CLINIC INTERIOR */}
          {building.type === 'CLINIC' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🩺</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Dr. Shield's Wellness Clinic</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Preventative care is the highest-ROI investment for human capital. Maintain insurance to protect against catastrophic bankruptcies, and keep health near 100%!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preventative Checkup */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Current Health:</span>
                    <span className="font-mono font-bold text-emerald-400">{state.character.health}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Current Happiness:</span>
                    <span className="font-mono font-bold text-cyan-400">{state.character.happiness}%</span>
                  </div>
                  <button
                    onClick={() => {
                      if (state.cash < 150) {
                        showToast('Insufficient cash for checkup ($150)');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 150;
                      state.character.health = 100;
                      state.character.happiness = Math.min(100, state.character.happiness + 15);
                      state.burnout = 0;
                      onUpdateState({ ...state });
                      showToast('🏥 Annual Checkup Complete! Health restored to 100%, Burnout reset to 0%!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Annual Wellness Exam ($150)
                  </button>
                </div>

                {/* Pulse Fitness Gym Membership */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Fitness Pass:</span>
                    <span className="font-mono font-bold text-amber-400">Pulse Gym</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Daily exercise boosts daily energy, builds cardiac longevity, and reduces healthcare costs.
                  </p>
                  <button
                    onClick={() => {
                      if (state.cash < 50) {
                        showToast('Requires $50 monthly cash');
                        return;
                      }
                      soundFx.playCoin();
                      state.cash -= 50;
                      state.character.health = Math.min(100, state.character.health + 10);
                      state.totalXP += 35;
                      onUpdateState({ ...state });
                      showToast('💪 Completed gym workout! Health +10%, XP +35!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-teal-500/30 transition-colors cursor-pointer"
                  >
                    Day Pass Workout ($50)
                  </button>
                </div>
              </div>

              {/* CFP Comprehensive Insurance Underwriting Exchange */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-teal-400" />
                      CFP® Personal Risk Transfer & Underwriting Desk
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Protect your human capital and balance sheet against catastrophic, non-retained life liabilities.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Own-Occ Disability */}
                  {(() => {
                    const hasDisability = state.insurance.some((i) => i.category === 'DISABILITY_OWN_OCC' && i.isActive);
                    return (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">
                              Human Capital
                            </span>
                            <span className="text-xs font-bold text-white">$65/mo</span>
                          </div>
                          <h6 className="font-bold text-xs text-white mt-1">Own-Occupation Disability Policy</h6>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            Replaces 60% of gross salary if unable to perform your specific profession. Crucial for professionals.
                          </p>
                        </div>
                        <div className="mt-3">
                          {hasDisability ? (
                            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Policy Active</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                state.insurance.push({
                                  id: 'ins_disability_own_occ',
                                  name: 'Own-Occupation Disability',
                                  category: 'DISABILITY_OWN_OCC',
                                  monthlyPremium: 65,
                                  coverageDescription: 'Replaces 60% of monthly income on career disability.',
                                  isActive: true,
                                  deductible: 0,
                                });
                                state.totalXP += 100;
                                soundFx.playCoin();
                                onUpdateState({ ...state });
                                showToast('Underwritten Own-Occupation Disability! Human capital fully insured!');
                              }}
                              className="w-full py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] cursor-pointer"
                            >
                              Underwrite Policy ($65/mo)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Umbrella Liability */}
                  {(() => {
                    const hasUmbrella = state.insurance.some((i) => i.category === 'UMBRELLA' && i.isActive);
                    return (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                              Asset Shield
                            </span>
                            <span className="text-xs font-bold text-white">$25/mo</span>
                          </div>
                          <h6 className="font-bold text-xs text-white mt-1">$2,000,000 Personal Umbrella Policy</h6>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            Excess personal liability covering beyond auto/renters limits against catastrophic lawsuits.
                          </p>
                        </div>
                        <div className="mt-3">
                          {hasUmbrella ? (
                            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Policy Active</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                state.insurance.push({
                                  id: 'ins_umbrella_2m',
                                  name: '$2M Personal Umbrella',
                                  category: 'UMBRELLA',
                                  monthlyPremium: 25,
                                  coverageDescription: '$2,000,000 excess personal liability protection.',
                                  isActive: true,
                                  deductible: 0,
                                });
                                state.totalXP += 100;
                                soundFx.playCoin();
                                onUpdateState({ ...state });
                                showToast('Underwritten $2M Umbrella Liability! Net worth shielded from legal shocks!');
                              }}
                              className="w-full py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Underwrite Policy ($25/mo)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* 12. REAL ESTATE INTERIOR */}
          {building.type === 'REAL_ESTATE' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📜</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Prosperity Realty & Escrow</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Real estate creates wealth through 4 wealth engines simultaneously: Cashflow, Principal Paydown, Tax Depreciation, and Long-Term Appreciation."
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1% Rule Analyzer */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-400" />
                    <span>The 1% Rule Property Screener</span>
                  </span>
                  <div className="p-3 rounded-lg bg-slate-950/80 font-mono text-xs space-y-1 text-slate-300">
                    <div>Duplex Price: <strong className="text-white">$320,000</strong></div>
                    <div>Monthly Rents: <strong className="text-emerald-400">$2,400/mo</strong></div>
                    <div>Rent-to-Price Ratio: <strong className="text-amber-400">0.75%</strong> (Healthy Cashflow)</div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A ratio above 0.7% - 1.0% generally produces positive net cashflow after property taxes, insurance, and maintenance reserves.
                  </p>
                </div>

                {/* Suburban Duplex Listing Purchase */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Turnkey Suburban Duplex:</span>
                    <span className="font-mono font-bold text-emerald-400">$320,000</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">20% Down Payment:</span>
                    <span className="font-mono font-bold text-white">$64,000</span>
                  </div>
                  <button
                    onClick={() => {
                      const alreadyOwned = state.portfolio.some((p) => p.assetId === 're_suburban_duplex');
                      if (alreadyOwned) {
                        showToast('You already own this suburban duplex deed!');
                        return;
                      }
                      if (state.cash < 64000) {
                        showToast('Requires $64,000 cash for 20% down payment');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 64000;
                      state.portfolio.push({
                        assetId: 're_suburban_duplex',
                        shares: 1,
                        costBasis: 320000,
                      });
                      state.debts.push({
                        id: `mortgage_${Date.now()}`,
                        name: 'Duplex 30-Year Mortgage',
                        category: 'MORTGAGE',
                        principal: 256000,
                        interestRate: 0.065,
                        minimumMonthlyPayment: 1618,
                        educationalTip: 'Tenants pay off this principal balance each month.',
                      });
                      state.totalXP += 500;
                      onUpdateState({ ...state });
                      showToast('🎉 Acquired Suburban Duplex! Collecting monthly tenant checks!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Buy Duplex ($64,000 Down)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 13. CRYPTO LOUNGE INTERIOR */}
          {building.type === 'CRYPTO_LOUNGE' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🪙</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Web3 & Crypto Pier Terminal</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Crypto assets offer asymmetric upside but extreme volatility. Never invest money you need in the next 5 years, and always secure private keys in cold storage!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hardware Cold Wallet */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Cold Storage Wallet:</span>
                    <span className="font-mono font-bold text-emerald-400">Hardware Vault</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "Not your keys, not your coins." Self-custody eliminates exchange bankruptcy and phishing risks.
                  </p>
                  <button
                    onClick={() => {
                      if (state.cash < 150) {
                        showToast('Insufficient cash ($150)');
                        return;
                      }
                      soundFx.playLevelUp();
                      state.cash -= 150;
                      state.totalXP += 80;
                      onUpdateState({ ...state });
                      showToast('🔒 Hardware Wallet Configured! 100% Exchange Insolvency Protection!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Buy Hardware Wallet ($150)
                  </button>
                </div>

                {/* Staking Yield Terminal */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Proof-of-Stake Yield:</span>
                    <span className="font-mono font-bold text-cyan-400">5.5% APY</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Stake native crypto tokens to secure decentralized networks and collect protocol transaction rewards.
                  </p>
                  <button
                    onClick={() => {
                      if (state.cash < 500) {
                        showToast('Requires at least $500 cash');
                        return;
                      }
                      soundFx.playCoin();
                      state.cash -= 500;
                      state.emergencyFund += 500;
                      state.totalXP += 60;
                      onUpdateState({ ...state });
                      showToast('🪙 Staked $500 in Proof-of-Stake Validator! Earning 5.5% APY!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    Stake $500 (5.5% APY)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 14. SHADY ALLEY INTERIOR */}
          {building.type === 'SHADY_ALLEY' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🕶️</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Shady Sam’s Dimly Lit Corner</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      "Hey kid... want in on an exclusive secret offshore algorithm? Guaranteed 50% weekly yield with ZERO risk of loss. Just wire me $500!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Scam Detection Challenge: Find the 3 Red Flags</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Bounty: +$250 Cash • +150 XP
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>1. ❌ <strong>"Guaranteed"</strong> high returns (Return is always tied to risk).</div>
                  <div>2. ❌ <strong>"Zero Risk"</strong> claim (There is no such thing as zero risk).</div>
                  <div>3. ❌ Unregistered anonymous offshore entity avoiding SEC oversight.</div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      state.cash += 250;
                      state.totalXP += 150;
                      onUpdateState({ ...state });
                      showToast('🚨 Reported Scam to SEC Whistleblower Bureau! Earned +$250 cash bounty!');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Report Ponzi Scheme (Whistleblower Bounty)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playTwistAlert();
                      showToast('You ignored the sketchy pitch and walked away with your wallet safe!');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Walk Away
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 15. TAX OFFICE */}
          {building.type === 'TAX_OFFICE' && (
            <TaxOfficeInterior
              building={building}
              state={state}
              onUpdateState={onUpdateState}
              showToast={showToast}
            />
          )}

          {/* 16. BOND PIT */}
          {building.type === 'BOND_PIT' && (
            <BondPitInterior
              building={building}
              state={state}
              onUpdateState={onUpdateState}
              showToast={showToast}
            />
          )}

          {/* 17. WEALTH ADVISORY / FAMILY OFFICE */}
          {building.type === 'WEALTH_ADVISORY' && (
            <WealthAdvisoryInterior
              building={building}
              state={state}
              onUpdateState={onUpdateState}
              showToast={showToast}
              onOpenLegacyModal={onOpenLegacyModal}
            />
          )}

          {/* 18. TECH INCUBATOR */}
          {building.type === 'TECH_INCUBATOR' && (
            <TechIncubatorInterior
              building={building}
              state={state}
              onUpdateState={onUpdateState}
              showToast={showToast}
            />
          )}

          {/* 19. Fallback for any other building */}
          {!['BANK', 'STOCK_EXCHANGE', 'AUTO_DEALER', 'RENTAL_PROPERTY', 'SUPERSTORE', 'HOME', 'CAREER_TOWER', 'CAFE', 'TOWN_HALL', 'UNIVERSITY', 'CLINIC', 'REAL_ESTATE', 'CRYPTO_LOUNGE', 'SHADY_ALLEY', 'TAX_OFFICE', 'BOND_PIT', 'WEALTH_ADVISORY', 'TECH_INCUBATOR'].includes(building.type) && (
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
