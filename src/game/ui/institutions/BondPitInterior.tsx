import React, { useState } from 'react';
import { GameState } from '../../../types/game';
import { soundFx } from '../../../audio/soundFx';
import { executeBuyAsset } from '../../../engine/gameEngine';
import { 
  calculateYieldCurve, 
  calculateBondPriceChange, 
  calculateTaxEquivalentYield,
  YieldCurvePoints 
} from '../../engine/cfaMarketEngine';
import { calculateComprehensiveTaxes } from '../../engine/cfpPlanningEngine';
import { BuildingEntrance } from '../../world/mapData';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Activity, 
  Sliders, 
  Landmark, 
  CheckCircle2, 
  Info,
  DollarSign
} from 'lucide-react';

interface BondPitInteriorProps {
  building: BuildingEntrance;
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  showToast: (msg: string) => void;
}

export const BondPitInterior: React.FC<BondPitInteriorProps> = ({
  state,
  onUpdateState,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'YIELD_CURVE' | 'DURATION_TESTER' | 'BOND_SHOP'>('YIELD_CURVE');
  const [testedRateShift, setTestedRateShift] = useState<number>(0.0); // -0.02 to +0.02

  // Live yield curve
  const yieldCurve: YieldCurvePoints = calculateYieldCurve(
    state.interestRate,
    state.inflationRate,
    state.sentiment
  );

  // Player's marginal tax rate for municipal bond TEY calculation
  const taxes = calculateComprehensiveTaxes(state.character.annualSalary, 'METROPOLIS_HUB', 'SINGLE');

  // Purchase helper
  const handleBuyBond = (assetId: string, amount: number) => {
    const result = executeBuyAsset(state, assetId, amount);
    if (result.success) {
      onUpdateState(result.nextState);
      showToast(result.message);
    } else {
      showToast(result.message);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Trading Floor Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
            📜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CFA® Fixed Income & Macro Desk
              </span>
              <h3 className="font-extrabold text-white text-base">Federal Reserve & Sovereign Debt Floor</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              "Bonds are the backbone of global capitalism. Master yield curves, duration sensitivity, TIPS inflation hedges, and tax-exempt municipal bonds."
            </p>
          </div>
        </div>

        {/* Fed Funds & Inversion Status */}
        <div className="text-right shrink-0 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Fed Funds Rate</div>
          <div className="text-xl font-black text-emerald-400">
            {(state.interestRate * 100).toFixed(2)}%
          </div>
          <div className="text-[10px] font-bold">
            Curve: <span className={yieldCurve.regime === 'INVERTED' ? 'text-rose-400' : 'text-emerald-400'}>
              {yieldCurve.regime}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('YIELD_CURVE')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'YIELD_CURVE'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Yield Curve Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('DURATION_TESTER')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'DURATION_TESTER'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Duration & Convexity Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('BOND_SHOP')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'BOND_SHOP'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Institutional Bond Desk</span>
        </button>
      </div>

      {/* TAB 1: YIELD CURVE TERMINAL */}
      {activeTab === 'YIELD_CURVE' && (
        <div className="space-y-4">
          
          {/* Yield Curve Visualizer Bars */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  US Sovereign Treasury Yield Curve (Maturity Ladder)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  10Y–3M Spread: <strong className={yieldCurve.spread10y3m < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                    {(yieldCurve.spread10y3m * 100).toFixed(2)}%
                  </strong> ({yieldCurve.spread10y3m < 0 ? 'Inverted: Classic leading recession signal' : 'Healthy positive slope'})
                </p>
              </div>

              {/* Recession Warning Meter */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Recession Probability</div>
                <div className={`text-base font-black ${
                  yieldCurve.recessionProbability > 0.5 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {(yieldCurve.recessionProbability * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Visual Maturity Bars */}
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: '3-Month T-Bill', yield: yieldCurve.threeMonth, maturity: 'Cash Equivalent' },
                { label: '2-Year Note', yield: yieldCurve.twoYear, maturity: 'Short-Term Sovereign' },
                { label: '10-Year Bond', yield: yieldCurve.tenYear, maturity: 'Benchmark Sovereign' },
                { label: '30-Year Bond', yield: yieldCurve.thirtyYear, maturity: 'Long Treasury' },
              ].map((pt) => {
                const heightPercent = Math.min(100, Math.max(30, (pt.yield / 0.08) * 100));
                return (
                  <div key={pt.label} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center justify-between h-44">
                    <span className="text-[10px] font-bold text-slate-400">{pt.label}</span>
                    
                    {/* Bar graphic */}
                    <div className="w-full flex items-end justify-center h-24">
                      <div
                        className="w-12 rounded-t-lg bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500 relative group flex items-start justify-center pt-2"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="text-[11px] font-black text-slate-950">
                          {(pt.yield * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] text-slate-500 mt-2">{pt.maturity}</span>
                  </div>
                );
              })}
            </div>

            {/* CFA Explanation Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>CFA Capital Markets Insight:</strong> An <em>inverted yield curve</em> occurs when investors rush to lock in long-term bonds anticipating a central bank rate-cutting cycle and recession. Over the past 70 years, an inverted 10Y-3M spread has successfully predicted every single US recession!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DURATION & CONVEXITY TESTER */}
      {activeTab === 'DURATION_TESTER' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Bond Price Sensitivity Simulator (Modified Duration & Convexity)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              CFA Formula: <span className="font-mono text-emerald-300">ΔP / P ≈ -Duration * Δy + 0.5 * Convexity * (Δy)²</span>.
              Simulate what happens to bond prices when the Federal Reserve hikes or cuts benchmark interest rates:
            </p>

            {/* Rate Shift Controller Buttons */}
            <div className="flex gap-2 mb-5">
              {[
                { label: '-200 bps (Aggressive Cut)', shift: -0.02 },
                { label: '-100 bps (Rate Cut)', shift: -0.01 },
                { label: '0 bps (Unchanged)', shift: 0.0 },
                { label: '+100 bps (Rate Hike)', shift: 0.01 },
                { label: '+200 bps (Aggressive Hike)', shift: 0.02 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    setTestedRateShift(btn.shift);
                    soundFx.playClick();
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    testedRateShift === btn.shift
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Impact Table Across Bond Classes */}
            <div className="space-y-3">
              {[
                {
                  name: '3-Month Cash T-Bills',
                  duration: 0.25,
                  symbol: 'BIL',
                  description: 'Negligible price risk. Immediate yield reset.',
                },
                {
                  name: 'US Total Bond Market (BND)',
                  duration: 6.5,
                  symbol: 'BND',
                  description: 'Core aggregate duration. Standard retirement portfolio anchor.',
                },
                {
                  name: '10-Year Intermediate Treasury (IEF)',
                  duration: 7.8,
                  symbol: 'IEF',
                  description: 'Significant interest rate sensitivity. Major capital gain on rate cuts.',
                },
                {
                  name: '20+ Year Long-Term Treasury (TLT)',
                  duration: 16.5,
                  symbol: 'TLT',
                  description: 'Extreme volatility. Massive rally in market crashes, steep drop in inflation hikes.',
                },
              ].map((bond) => {
                const priceChangePct = calculateBondPriceChange(bond.duration, 25, testedRateShift);
                const isPositive = priceChangePct >= 0;

                return (
                  <div
                    key={bond.symbol}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-extrabold text-white flex items-center gap-2">
                        <span>{bond.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          Duration: {bond.duration} yrs
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{bond.description}</div>
                    </div>

                    <div className="text-right">
                      <div className={`text-base font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{(priceChangePct * 100).toFixed(2)}%
                      </div>
                      <span className="text-[10px] text-slate-500">Capital Value Shift</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOND SHOP */}
      {activeTab === 'BOND_SHOP' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'asset_treasury_bonds',
                name: 'US Total Bond Market (BND)',
                yield: '4.4%',
                taxNote: 'Taxed as ordinary income',
                category: 'Core Bond Aggregate',
                min: 10,
              },
              {
                id: 'asset_treasury_10y',
                name: '10-Year Intermediate Treasury (IEF)',
                yield: '4.2%',
                taxNote: 'Exempt from state income tax',
                category: 'Duration Play',
                min: 20,
              },
              {
                id: 'asset_tips',
                name: 'TIPS Inflation-Protected Bonds (TIP)',
                yield: '2.4% + CPI Inflation',
                taxNote: 'Principal expands with CPI',
                category: 'Inflation Shield',
                min: 25,
              },
              {
                id: 'asset_muni_bonds',
                name: 'Municipal Tax-Exempt Bonds (MUB)',
                yield: '3.7% (Tax-Free)',
                taxNote: `Tax-Equivalent Yield: ${(calculateTaxEquivalentYield(0.037, taxes.marginalFederalRate, 0.105) * 100).toFixed(2)}%!`,
                category: 'High Earner Tax Shield',
                min: 25,
              },
            ].map((item) => {
              const asset = state.assets.find((a) => a.id === item.id);
              if (!asset) return null;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300">
                        {item.category}
                      </span>
                      <span className="font-extrabold text-sm text-emerald-400">{item.yield}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-white mt-2 flex items-center gap-1.5">
                      <span>{asset.icon}</span>
                      <span>{asset.name}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{asset.description}</p>
                    
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-950 text-[11px] text-cyan-300 font-bold border border-slate-800/80">
                      💡 {item.taxNote}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Price Per Share</div>
                      <div className="text-sm font-bold text-white">${asset.currentPrice.toFixed(2)}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBuyBond(asset.id, 500)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        Buy $500
                      </button>
                      <button
                        onClick={() => handleBuyBond(asset.id, 2500)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Buy $2.5k
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
