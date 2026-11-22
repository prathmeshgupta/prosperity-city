import React, { useState, useEffect } from 'react';
import { GameState } from '../../types/game';
import { radioEngine, RadioStation, RADIO_STATIONS } from '../engine/radioEngine';
import { soundFx } from '../../audio/soundFx';
import { 
  getPortfolioValue, 
  getNetWorth, 
  executeBuyAsset, 
  executeSellAsset 
} from '../../engine/gameEngine';
import { 
  X, 
  Wifi, 
  BatteryCharging, 
  TrendingUp, 
  Building, 
  Landmark, 
  Radio, 
  Camera, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles,
  Award,
  ShieldCheck,
  Calculator,
  Compass,
  Activity,
  Layers,
  Info,
  ChevronRight,
  PieChart,
  HelpCircle
} from 'lucide-react';

interface FinPhoneModalProps {
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  onClose: () => void;
  onAlert: (msg: string) => void;
}

type TerminalApp = 
  | 'HOME' 
  | 'MARKETPULSE' 
  | 'ALPHATRADE' 
  | 'REALESTATE' 
  | 'TREASURY' 
  | 'ADVISORY' 
  | 'RADIO';

export const FinPhoneModal: React.FC<FinPhoneModalProps> = ({
  state,
  onUpdateState,
  onClose,
  onAlert,
}) => {
  const [currentApp, setCurrentApp] = useState<TerminalApp>('HOME');
  const [currentStation, setCurrentStation] = useState<RadioStation>(radioEngine.getCurrentStation());
  
  // Custom trade dollar amount
  const [tradeAmount, setTradeAmount] = useState<number>(100);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(state.assets[0]?.id || 'asset_sp500');

  // Advisory tab states
  const [targetRetirementSpending, setTargetRetirementSpending] = useState<number>(5000); // $5k/mo = $60k/yr
  const [rothConversionAmount, setRothConversionAmount] = useState<number>(10000);

  // Subscribe to radio engine
  useEffect(() => {
    return radioEngine.subscribe((st) => setCurrentStation(st));
  }, []);

  const netWorth = getNetWorth(state);
  const portfolioVal = getPortfolioValue(state);

  // Approximate monthly living expenses for runway calculation
  const monthlyExpenses = Math.max(
    1500,
    Math.round((state.character.annualSalary * 0.5) / 12) +
    state.debts.reduce((sum, d) => sum + d.minimumMonthlyPayment, 0)
  );
  const emergencyMonths = (state.emergencyFund / monthlyExpenses).toFixed(1);

  // 4% Safe Withdrawal Rule target
  const fireTarget = (targetRetirementSpending * 12) / 0.04;
  const fireProgressPct = Math.min(100, Math.round((netWorth / fireTarget) * 100));

  // Quick Trade execution
  const handleBuy = (assetId: string, amount: number) => {
    if (state.cash < amount) {
      onAlert(`Insufficient cash balance ($${Math.round(state.cash).toLocaleString()} available).`);
      return;
    }
    const res = executeBuyAsset(state, assetId, amount);
    if (res.success) {
      soundFx.playCoin();
      onUpdateState(res.nextState);
      onAlert(res.message);
    } else {
      onAlert(res.message);
    }
  };

  const handleSell = (assetId: string) => {
    const pos = state.portfolio.find((p) => p.assetId === assetId);
    if (!pos || pos.shares <= 0) {
      onAlert('You do not hold any shares of this asset.');
      return;
    }
    // Sell 25% of position or at least 1 share
    const sharesToSell = Math.max(1, Math.min(pos.shares, pos.shares * 0.25));
    const res = executeSellAsset(state, assetId, sharesToSell);
    if (res.success) {
      soundFx.playCoin();
      onUpdateState(res.nextState);
      onAlert(res.message);
    } else {
      onAlert(res.message);
    }
  };

  // Real estate acquisition
  const handleAcquireProperty = (name: string, price: number, monthlyIncome: number, downPaymentPct: number = 0.20) => {
    const requiredDownPayment = price * downPaymentPct;
    if (state.cash < requiredDownPayment) {
      onAlert(`Requires $${Math.round(requiredDownPayment).toLocaleString()} down payment (20% of $${price.toLocaleString()}).`);
      return;
    }

    state.cash -= requiredDownPayment;
    state.sideHustles.push({
      id: `property_${Date.now()}`,
      title: name,
      monthlyIncome: monthlyIncome,
      hoursPerWeek: 1,
      startupCost: requiredDownPayment,
      isActive: true,
      description: `Income Property: $${monthlyIncome.toLocaleString()}/mo Net Operating Cashflow after debt service & maintenance.`,
    });
    state.totalXP += 300;
    soundFx.playLevelUp();
    onUpdateState({ ...state });
    onAlert(`🏛️ Acquired ${name}! +$${monthlyIncome.toLocaleString()}/mo cashflow added.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:pr-12 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Matte Titanium Executive Terminal Body */}
      <div className="relative w-[360px] h-[720px] bg-slate-950 rounded-[48px] p-4 border-[5px] border-slate-700/80 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-slate-100 select-none">
        
        {/* Dynamic Island / Status Pill */}
        <div className="absolute top-3.5 inset-x-0 mx-auto w-32 h-6 bg-black rounded-full flex items-center justify-between px-3 z-40 border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono font-extrabold text-emerald-400">FIN-OS</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-3 pt-1.5 pb-2 text-[11px] font-mono font-bold text-slate-400 z-30">
          <span>9:41 AM</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-sans">5G UW</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-[36px] p-3.5 overflow-y-auto relative flex flex-col scrollbar-none border border-slate-800/80">
          
          {/* Top Bar with Back / Navigation */}
          {currentApp !== 'HOME' && (
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800 shrink-0">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrentApp('HOME');
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                ◀ Terminal
              </button>
              <div className="text-xs font-black tracking-wider text-slate-200 uppercase">
                {currentApp}
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 1: HOME SCREEN (EXECUTIVE DASHBOARD)           */}
          {/* -------------------------------------------------- */}
          {currentApp === 'HOME' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                {/* Executive Net Worth Card */}
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 mb-3 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Balance Sheet Net Worth
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Tier: {netWorth > 2000000 ? 'Legacy' : netWorth > 500000 ? 'Preservation' : netWorth > 100000 ? 'Ascent' : 'Accumulation'}
                    </span>
                  </div>

                  <div className="text-2xl font-black text-white font-mono mt-1">
                    ${Math.round(netWorth).toLocaleString()}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/50 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Checking Cash</span>
                      <strong className="text-emerald-400 font-mono">${Math.round(state.cash).toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Invested Portfolio</span>
                      <strong className="text-cyan-400 font-mono">${portfolioVal.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* 4% FIRE Target Gauge */}
                  <div className="mt-2.5 pt-2 border-t border-slate-700/40">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>4% FIRE Freedom Target</span>
                      <span className="font-mono text-amber-400 font-bold">{fireProgressPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${fireProgressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Macro Headline Ribbon */}
                <div className="bg-slate-900/80 rounded-xl px-3 py-2 border border-slate-800 flex items-center gap-2 mb-3">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
                  <span className="text-[10px] text-slate-300 font-medium truncate">
                    {state.economicHeadline || 'Fed maintains benchmark rate at 5.25%. Yield curve inverted.'}
                  </span>
                </div>

                {/* Institutional App Grid (6 Core CFP/CFA Apps) */}
                <div className="grid grid-cols-3 gap-3 px-1">
                  {/* 1. MarketPulse */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('MARKETPULSE');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center">MarketPulse</span>
                  </button>

                  {/* 2. AlphaTrade */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('ALPHATRADE');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center">AlphaTrade</span>
                  </button>

                  {/* 3. RealEstate Compass */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('REALESTATE');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Building className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center">RealEstate</span>
                  </button>

                  {/* 4. Treasury Vault */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('TREASURY');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center">Treasury</span>
                  </button>

                  {/* 5. Wealth & Tax Advisor */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('ADVISORY');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center">Tax Advisor</span>
                  </button>

                  {/* 6. Radio Broadcast */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentApp('RADIO');
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                      <Radio className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center">Radio Wire</span>
                  </button>
                </div>
              </div>

              {/* Bottom Quick-Action Dock */}
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-2 flex items-center justify-around border border-slate-700/50">
                <button
                  onClick={() => {
                    soundFx.playCameraSnap();
                    onAlert('📸 Financial Snapshot captured & logged to record history.');
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center text-white cursor-pointer transition-colors"
                  title="Capture Snapshot"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={() => radioEngine.nextStation()}
                  className="w-10 h-10 rounded-xl bg-rose-600/90 hover:bg-rose-500 flex items-center justify-center text-white cursor-pointer transition-colors"
                  title="Switch Radio Station"
                >
                  <Radio className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center text-white cursor-pointer transition-colors"
                  title="Close Terminal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 2: MARKETPULSE (INSTITUTIONAL MACRO WIRE)      */}
          {/* -------------------------------------------------- */}
          {currentApp === 'MARKETPULSE' && (
            <div className="space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
              {/* Macro Indicators Matrix */}
              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">US Treasury Yield Curve</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-bold">
                    INVERTED (-40 bps)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">3-Month</span>
                    <strong className="text-xs text-amber-400">5.25%</strong>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">2-Year</span>
                    <strong className="text-xs text-amber-400">4.65%</strong>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">10-Year</span>
                    <strong className="text-xs text-emerald-400">4.25%</strong>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">30-Year</span>
                    <strong className="text-xs text-emerald-400">4.40%</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                  <strong className="text-amber-300">CFA Analysis:</strong> An inverted yield curve (10Y minus 2Y &lt; 0) historically signals economic deceleration. Maintain liquid emergency cash and dollar-cost average into diversified broad equities.
                </p>
              </div>

              {/* Economic Radar */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Core CPI Inflation</span>
                  <div className="text-base font-black text-rose-400 font-mono mt-0.5">
                    {(state.inflationRate * 100).toFixed(1)}%
                  </div>
                  <span className="text-[9px] text-slate-400">Target: 2.0% annual</span>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Fed Policy Rate</span>
                  <div className="text-base font-black text-cyan-400 font-mono mt-0.5">
                    {(state.interestRate * 100).toFixed(2)}%
                  </div>
                  <span className="text-[9px] text-slate-400">Higher for longer</span>
                </div>
              </div>

              {/* Institutional Breaking News Feed */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Institutional Market Wire
                </div>

                {[
                  {
                    source: 'FEDERAL RESERVE BULLETIN',
                    tag: 'POLICY',
                    time: '12m ago',
                    headline: 'FOMC votes to maintain benchmark interest rates at 5.25%-5.50% range.',
                    detail: 'Chairman emphasizes data dependency: "We will not rush easing until disinflation toward 2% is demonstrably sustainable."'
                  },
                  {
                    source: 'IRS REVENUE BULLETIN',
                    tag: 'TAX CODE',
                    time: '45m ago',
                    headline: 'Annual Elective Deferral Limits Increased for Tax-Advantaged Accounts.',
                    detail: 'Traditional & Roth 401(k) maximum ceiling adjusted to $23,000. IRA contribution limit raised to $7,000.'
                  },
                  {
                    source: 'TREASURY AUCTION DESK',
                    tag: 'FIXED INCOME',
                    time: '2h ago',
                    headline: 'Strong Indirect Demand at 10-Year Benchmark Treasury Auction.',
                    detail: 'High bid-to-cover ratio of 2.52x signals robust institutional pension appetite for long-duration risk-free paper.'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/40 rounded-xl p-2.5 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="font-extrabold text-cyan-400 tracking-wider">{item.source}</span>
                      <span className="text-slate-500 font-mono">{item.time}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 leading-snug">{item.headline}</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 3: ALPHATRADE (ASSET LOCATION & PORTFOLIO)     */}
          {/* -------------------------------------------------- */}
          {currentApp === 'ALPHATRADE' && (
            <div className="space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
              {/* Asset Location Hierarchy Info */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/40 rounded-2xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    CFP® Asset Location Strategy
                  </span>
                  <span className="text-xs font-mono font-black text-white">
                    ${portfolioVal.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Hold high-turnover equities in <strong>Roth (Tax-Free)</strong>, bonds and REITs in <strong>Tax-Deferred</strong>, and broad index funds in <strong>Taxable</strong> for long-term capital gains rates!
                </p>
              </div>

              {/* Trade Amount Selector */}
              <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Order Size:</span>
                <div className="flex items-center gap-1">
                  {[50, 100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTradeAmount(amt)}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                        tradeAmount === amt
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Catalog with Location Badges */}
              <div className="space-y-2">
                {state.assets.map((asset) => {
                  const pos = state.portfolio.find((p) => p.assetId === asset.id);
                  const sharesOwned = pos ? pos.shares.toFixed(2) : '0';
                  const holdingValue = pos ? Math.round(pos.shares * asset.currentPrice) : 0;

                  return (
                    <div 
                      key={asset.id} 
                      className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/70 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-white">{asset.symbol}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                              {asset.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 font-medium truncate max-w-[170px]">
                            {asset.name}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            ${asset.currentPrice.toLocaleString()}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            Yield: {((asset.dividendYield || 0) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Holdings & Pedagogical Asset Location Badge */}
                      <div className="flex items-center justify-between text-[10px] bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-400">Holding: </span>
                          <strong className="text-white font-mono">{sharesOwned} shs</strong>
                          {holdingValue > 0 && (
                            <span className="text-cyan-400 ml-1 font-mono">(${holdingValue.toLocaleString()})</span>
                          )}
                        </div>

                        <div className="text-[9px] font-bold text-amber-300">
                          {asset.assetLocationRecommendation === 'TAXABLE' && '📍 Best: Taxable Brokerage'}
                          {asset.assetLocationRecommendation === 'TAX_DEFERRED' && '📍 Best: Traditional 401(k)'}
                          {asset.assetLocationRecommendation === 'TAX_FREE' && '📍 Best: Roth IRA / HSA'}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          onClick={() => handleBuy(asset.id, tradeAmount)}
                          className="py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          Buy ${tradeAmount}
                        </button>
                        <button
                          onClick={() => handleSell(asset.id)}
                          disabled={!pos || pos.shares <= 0}
                          className="py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          Sell 25%
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 4: REALESTATE COMPASS & UNDERWRITING           */}
          {/* -------------------------------------------------- */}
          {currentApp === 'REALESTATE' && (
            <div className="space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
              {/* Institutional Real Estate Underwriting Metrics */}
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Commercial & Residential Underwriting
                </span>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Evaluate properties using <strong>Cap Rates (NOI / Cost)</strong> and <strong>Cash-on-Cash Return</strong>. Real estate allows non-cash tax depreciation write-offs!
                </p>
              </div>

              {/* Property Opportunities */}
              <div className="space-y-2.5">
                {[
                  {
                    name: 'Suburban Turnkey Duplex',
                    price: 320000,
                    rent: 2400,
                    capRate: 7.8,
                    cashOnCash: 9.4,
                    depreciation: 9200,
                    district: 'Oak Grove Residential',
                    icon: '🏡',
                  },
                  {
                    name: 'Ocean Boardwalk Luxury Condo',
                    price: 680000,
                    rent: 4800,
                    capRate: 6.9,
                    cashOnCash: 8.1,
                    depreciation: 18500,
                    district: 'Oceanfront Pier',
                    icon: '🏖️',
                  },
                  {
                    name: 'The Summit FIRE Penthouse',
                    price: 1200000,
                    rent: 8500,
                    capRate: 7.2,
                    cashOnCash: 8.6,
                    depreciation: 34000,
                    district: 'Billionaires Row',
                    icon: '👑',
                  },
                ].map((prop) => {
                  const downPayment = prop.price * 0.20;
                  const alreadyOwned = state.sideHustles.some((sh) => sh.title === prop.name);

                  return (
                    <div 
                      key={prop.name}
                      className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{prop.icon}</span>
                          <div>
                            <div className="text-xs font-black text-white">{prop.name}</div>
                            <div className="text-[9px] text-slate-400">{prop.district}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-extrabold text-amber-400">
                            ${prop.price.toLocaleString()}
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">
                            Down: ${(downPayment / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </div>

                      {/* Underwriting KPIs */}
                      <div className="grid grid-cols-3 gap-1 text-center bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-[10px] font-mono">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-sans">Cap Rate</span>
                          <strong className="text-emerald-400">{prop.capRate}%</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-sans">CoC Yield</span>
                          <strong className="text-cyan-400">{prop.cashOnCash}%</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-sans">Tax Deprec.</span>
                          <strong className="text-amber-400">${prop.depreciation}/yr</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-300 font-medium">Net Monthly Rent:</span>
                        <strong className="text-emerald-400 font-mono">+${prop.rent.toLocaleString()}/mo</strong>
                      </div>

                      <button
                        onClick={() => handleAcquireProperty(prop.name, prop.price, prop.rent)}
                        disabled={alreadyOwned || state.cash < downPayment}
                        className={`w-full py-2 rounded-xl font-black text-xs cursor-pointer transition-all ${
                          alreadyOwned
                            ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 cursor-default'
                            : state.cash >= downPayment
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                            : 'bg-slate-700/60 text-slate-400 opacity-60'
                        }`}
                      >
                        {alreadyOwned 
                          ? '✓ Acquired in Portfolio' 
                          : state.cash >= downPayment 
                          ? `Acquire with $${downPayment.toLocaleString()} Down` 
                          : `Need $${(downPayment - state.cash).toLocaleString()} more down payment`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 5: TREASURY VAULT & LIQUIDITY RUNWAY           */}
          {/* -------------------------------------------------- */}
          {currentApp === 'TREASURY' && (
            <div className="space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
              {/* Account Balances Card */}
              <div className="bg-indigo-950/50 border border-indigo-500/40 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-bold">Liquid Checking Account</span>
                  <span className="text-sm font-mono font-black text-white">
                    ${Math.round(state.cash).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-indigo-800/40">
                  <div>
                    <span className="text-xs text-amber-300 font-bold block">4.5% High-Yield Vault</span>
                    <span className="text-[9px] text-slate-400">Compounded monthly (risk-free)</span>
                  </div>
                  <span className="text-sm font-mono font-black text-emerald-400">
                    ${Math.round(state.emergencyFund).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Emergency Fund Runway Meter */}
              <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">
                    Emergency Liquidity Runway
                  </span>
                  <span className={`text-xs font-mono font-black ${
                    Number(emergencyMonths) >= 6 
                      ? 'text-emerald-400' 
                      : Number(emergencyMonths) >= 3 
                      ? 'text-amber-400' 
                      : 'text-rose-400'
                  }`}>
                    {emergencyMonths} Months
                  </span>
                </div>

                {/* Visual Progress Meter */}
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      Number(emergencyMonths) >= 6 
                        ? 'bg-emerald-500' 
                        : Number(emergencyMonths) >= 3 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (Number(emergencyMonths) / 6) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>Target: 3 - 6 Months</span>
                  <span>Living Burn: ${monthlyExpenses.toLocaleString()}/mo</span>
                </div>
              </div>

              {/* Instant Transfer Controls */}
              <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">
                  Vault Transfer Operations
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (state.cash >= 500) {
                        state.cash -= 500;
                        state.emergencyFund += 500;
                        soundFx.playCoin();
                        onUpdateState({ ...state });
                        onAlert('Vault Deposit: Transferred $500 to 4.5% High-Yield Vault!');
                      } else {
                        onAlert('Insufficient checking cash.');
                      }
                    }}
                    className="py-2.5 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    Deposit $500
                  </button>

                  <button
                    onClick={() => {
                      if (state.emergencyFund >= 500) {
                        state.emergencyFund -= 500;
                        state.cash += 500;
                        soundFx.playCoin();
                        onUpdateState({ ...state });
                        onAlert('Vault Withdrawal: Transferred $500 to Checking!');
                      } else {
                        onAlert('Insufficient vault balance.');
                      }
                    }}
                    className="py-2.5 px-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Withdraw $500
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 6: CFP® / CFA® WEALTH & TAX ADVISORY          */}
          {/* -------------------------------------------------- */}
          {currentApp === 'ADVISORY' && (
            <div className="space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
              {/* 4% Safe Withdrawal Rule Calculator */}
              <div className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider">
                    4% Safe Withdrawal Rule (FIRE)
                  </span>
                  <Award className="w-4 h-4 text-violet-400" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Desired Monthly Retirement Spend:</span>
                    <strong className="text-white font-mono">${targetRetirementSpending.toLocaleString()}</strong>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={20000}
                    step={500}
                    value={targetRetirementSpending}
                    onChange={(e) => setTargetRetirementSpending(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Required Capital Nest Egg</span>
                    <strong className="text-sm font-black text-emerald-400 font-mono">
                      ${Math.round(fireTarget).toLocaleString()}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Current Progress</span>
                    <strong className="text-xs font-mono text-cyan-400">
                      {fireProgressPct}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Standard vs Itemized Tax Optimization */}
              <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/70 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                  Tax Deduction Optimization
                </span>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  2026 Standard Deduction is <strong>$14,600</strong> (Single) / <strong>$29,200</strong> (Married). Itemize only if mortgage interest + state taxes (SALT $10k cap) + charitable gifts exceed standard deduction.
                </p>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-[10px] flex items-center justify-between">
                  <span className="text-slate-400">Recommended Selection:</span>
                  <strong className="text-emerald-400 font-mono">STANDARD DEDUCTION ($14,600)</strong>
                </div>
              </div>

              {/* Roth Conversion Ladder Analyzer */}
              <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/70 space-y-2">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
                  Roth Conversion Ladder Strategy
                </span>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Convert pre-tax Traditional 401(k) funds to Roth during low-income career pivot years to lock in historically low marginal tax brackets. Converted principal can be withdrawn penalty-free after 5 years!
                </p>
              </div>
            </div>
          )}

          {/* -------------------------------------------------- */}
          {/* APP 7: RADIO BROADCAST PLAYER                      */}
          {/* -------------------------------------------------- */}
          {currentApp === 'RADIO' && (
            <div className="space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-3xl shadow-xl shadow-rose-500/20">
                  📻
                </div>
                <div>
                  <div className="font-black text-sm text-white">{currentStation.name}</div>
                  <div className="text-xs text-pink-400 font-mono">{currentStation.frequency}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{currentStation.currentTrack}</div>
                </div>

                {/* Stations List */}
                <div className="space-y-1.5 pt-2 text-left">
                  {RADIO_STATIONS.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => radioEngine.setStation(station.id)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        currentStation.id === station.id
                          ? 'bg-rose-600/30 border border-rose-500/50 text-white'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <span>{station.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{station.frequency}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Home Bar Indicator */}
        <div 
          onClick={() => {
            soundFx.playClick();
            if (currentApp === 'HOME') {
              onClose();
            } else {
              setCurrentApp('HOME');
            }
          }}
          className="w-32 h-1 bg-slate-500 hover:bg-slate-300 mx-auto rounded-full mt-2 cursor-pointer transition-colors"
        />
      </div>
    </div>
  );
};
