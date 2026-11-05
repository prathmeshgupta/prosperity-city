import React, { useState } from 'react';
import { GameState } from '../../../types/game';
import { soundFx } from '../../../audio/soundFx';
import { 
  calculateComprehensiveTaxes, 
  harvestTaxLosses, 
  TAX_JURISDICTIONS, 
  TaxJurisdiction,
  FEDERAL_SINGLE_BRACKETS_2026
} from '../../engine/cfpPlanningEngine';
import { 
  BuildingEntrance 
} from '../../world/mapData';
import { 
  Calculator, 
  Scale, 
  MapPin, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  PiggyBank
} from 'lucide-react';

interface TaxOfficeInteriorProps {
  building: BuildingEntrance;
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  showToast: (msg: string) => void;
}

export const TaxOfficeInterior: React.FC<TaxOfficeInteriorProps> = ({
  state,
  onUpdateState,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'BRACKETS' | 'HARVESTING' | 'GEOGRAPHY' | 'DEDUCTIONS'>('BRACKETS');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<TaxJurisdiction>('METROPOLIS_HUB');

  // Compute live tax breakdown
  const annualSalary = state.character.annualSalary;
  const annual401k = Math.round(annualSalary * state.retirement.employee401kContributionPct);
  const taxes = calculateComprehensiveTaxes(annualSalary, selectedJurisdiction, 'SINGLE', {
    traditional401k: annual401k,
    studentLoanInterestPaid: state.debts.some((d) => d.category === 'STUDENT_LOAN') ? 2000 : 0,
  });

  // Calculate harvestable losses in portfolio
  const lossPositions = state.portfolio
    .map((pos) => {
      const asset = state.assets.find((a) => a.id === pos.assetId);
      if (!asset) return null;
      const unrealizedGainLoss = (asset.currentPrice - pos.costBasis) * pos.shares;
      return {
        asset,
        shares: pos.shares,
        costBasis: pos.costBasis,
        currentPrice: asset.currentPrice,
        unrealizedGainLoss,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null && p.unrealizedGainLoss < 0);

  const totalHarvestableLosses = Math.round(
    lossPositions.reduce((acc, p) => acc + Math.abs(p.unrealizedGainLoss), 0)
  );

  const handleExecuteTLH = () => {
    if (totalHarvestableLosses <= 0) {
      showToast('No positions currently hold unrealized losses to harvest.');
      return;
    }

    const harvest = harvestTaxLosses(0, totalHarvestableLosses, taxes.marginalFederalRate, 0);
    const updatedState = { ...state };
    
    // Reset cost basis of loss positions to current market price (simulating swap into partner index)
    for (const lossPos of lossPositions) {
      const target = updatedState.portfolio.find((p) => p.assetId === lossPos.asset.id);
      if (target) {
        target.costBasis = lossPos.currentPrice;
      }
    }

    // Cash refund from tax savings
    updatedState.cash += harvest.taxSavedAtMarginalRate;
    updatedState.totalXP += 150;
    updatedState.recentEvents.push({
      month: updatedState.month,
      text: `📑 City Tax Bureau: Harvested $${totalHarvestableLosses.toLocaleString()} in losses. Saved $${harvest.taxSavedAtMarginalRate.toLocaleString()} in tax write-offs!`,
      type: 'positive',
    });

    soundFx.playCoin();
    onUpdateState(updatedState);
    showToast(`Tax-Loss Harvesting Successful! +$${harvest.taxSavedAtMarginalRate.toLocaleString()} saved in taxes!`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Bureau Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/30 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
            📑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CFP® Knowledge Domain 6
              </span>
              <h3 className="font-extrabold text-white text-base">Prosperity Tax & Revenue Bureau</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              "Mastering marginal tax brackets, above-the-line pre-tax deductions, and tax-loss harvesting saves thousands of dollars in lifetime wealth drag."
            </p>
          </div>
        </div>

        {/* Marginal vs Effective Rate Pill */}
        <div className="text-right shrink-0 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Effective Tax Rate</div>
          <div className="text-xl font-black text-rose-400">
            {(taxes.effectiveCombinedRate * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400">
            Marginal: <span className="font-bold text-white">{(taxes.marginalFederalRate * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('BRACKETS')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'BRACKETS'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Progressive Brackets</span>
        </button>

        <button
          onClick={() => setActiveTab('HARVESTING')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'HARVESTING'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Tax-Loss Harvesting ({lossPositions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GEOGRAPHY')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'GEOGRAPHY'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>State Tax Arbitrage</span>
        </button>

        <button
          onClick={() => setActiveTab('DEDUCTIONS')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'DEDUCTIONS'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>Pre-Tax Shields</span>
        </button>
      </div>

      {/* TAB 1: PROGRESSIVE BRACKETS */}
      {activeTab === 'BRACKETS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Income</span>
              <div className="text-base font-extrabold text-white mt-0.5">${annualSalary.toLocaleString()}</div>
              <span className="text-[10px] text-slate-500">W-2 Salary + Gigs</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pre-Tax 401(k) / HSA</span>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                -${taxes.aboveTheLineDeductions.totalAboveLine.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-500">Above-the-line deduction</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Standard Deduction</span>
              <div className="text-base font-extrabold text-cyan-400 mt-0.5">
                -${taxes.standardDeduction.toLocaleString()}
              </div>
              <span className="text-[10px] text-cyan-500">2026 IRS Single filer</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Taxable Income</span>
              <div className="text-base font-extrabold text-rose-400 mt-0.5">
                ${taxes.taxableIncome.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Base for bracket rates</span>
            </div>
          </div>

          {/* Progressive Brackets Visualizer Table */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-400" />
              IRS Progressive Tax Bracket Ladder (Single Filer)
            </h4>

            <div className="space-y-2">
              {FEDERAL_SINGLE_BRACKETS_2026.map((b) => {
                const isActive = taxes.taxableIncome > b.min;
                const isMarginal = taxes.marginalFederalRate === b.rate;
                return (
                  <div
                    key={b.rate}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isMarginal
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : isActive
                        ? 'bg-slate-900 border-slate-800 text-slate-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded font-black text-xs ${
                        isMarginal ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {(b.rate * 100).toFixed(0)}%
                      </span>
                      <span>
                        ${b.min.toLocaleString()} – {b.max === Infinity ? 'Above' : `$${b.max.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      {isMarginal && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                          Your Marginal Bracket
                        </span>
                      )}
                      <span>
                        {isActive
                          ? `$${Math.min(
                              taxes.taxableIncome - b.min,
                              b.max - b.min
                            ).toLocaleString()} taxed`
                          : 'Not reached'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>CFP Key Principle:</strong> A raise will <em>never</em> reduce your take-home pay! Only the dollars that fall into your highest marginal bracket are taxed at {(taxes.marginalFederalRate * 100).toFixed(0)}%. All preceding dollars are taxed at 10% and 12%.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TAX-LOSS HARVESTING */}
      {activeTab === 'HARVESTING' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  Portfolio Tax-Loss Scanner
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  IRS Rule: Harvested losses offset capital gains dollar-for-dollar, plus up to <strong>$3,000/year</strong> against your ordinary salary!
                </p>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Harvestable Losses</div>
                <div className="text-xl font-black text-rose-400">${totalHarvestableLosses.toLocaleString()}</div>
              </div>
            </div>

            {lossPositions.length > 0 ? (
              <div className="mt-4 space-y-2">
                {lossPositions.map((p) => (
                  <div
                    key={p.asset.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{p.asset.icon}</span>
                        <span>{p.asset.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {p.shares} shares
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Cost Basis: ${p.costBasis.toFixed(2)} • Current: ${p.currentPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-rose-400">
                        -${Math.abs(Math.round(p.unrealizedGainLoss)).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-500">Unrealized loss</span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleExecuteTLH}
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>HARVEST ${totalHarvestableLosses.toLocaleString()} IN LOSSES (SAVE ${(Math.min(3000, totalHarvestableLosses) * taxes.marginalFederalRate).toFixed(0)} TAXES)</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                All portfolio holdings are currently at a profit! No harvestable losses detected.
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Beware the 30-Day Wash-Sale Rule:</strong> If you sell an asset for a tax loss, you cannot buy a "substantially identical" security within 30 days. In Prosperity City, the engine automatically swaps your harvested position into an equivalent partner index (e.g. S&P 500 VOO into Total Stock VTI) to maintain market exposure!
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STATE TAX ARBITRAGE */}
      {activeTab === 'GEOGRAPHY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(TAX_JURISDICTIONS).map((juris) => {
              const isSelected = selectedJurisdiction === juris.id;
              const calc = calculateComprehensiveTaxes(annualSalary, juris.id, 'SINGLE', {
                traditional401k: annual401k,
              });

              return (
                <div
                  key={juris.id}
                  onClick={() => {
                    setSelectedJurisdiction(juris.id);
                    soundFx.playClick();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-500 shadow-lg shadow-rose-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {juris.id === 'SUNBELT_HAVEN' ? '0% State Tax' : `${(juris.stateIncomeTaxRate * 100).toFixed(1)}% State Tax`}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                    </div>

                    <h4 className="font-extrabold text-sm text-white mt-2">{juris.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{juris.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>State Tax Owed:</span>
                      <span className="font-bold text-white">${calc.stateTax.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Net Take-Home:</span>
                      <span className="font-bold text-emerald-400">${calc.netTakeHomePay.toLocaleString()}/yr</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-xs text-white">Relocate Primary Residence & Tax Nexus</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Moving to Sunbelt Haven saves <strong>${(taxes.stateTax).toLocaleString()}</strong> each year in state income taxes!
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playLevelUp();
                showToast(`Primary residence updated to ${TAX_JURISDICTIONS[selectedJurisdiction].name}!`);
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-rose-500/20"
            >
              Confirm Relocation
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: PRE-TAX SHIELDS */}
      {activeTab === 'DEDUCTIONS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 401(k) Pre-tax */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg mb-2">
                  🏦
                </div>
                <h4 className="font-bold text-sm text-white">Traditional 401(k) / 403(b)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  IRS Limit: $23,500/yr. Every dollar contributed reduces your current-year taxable income at your marginal rate ({(taxes.marginalFederalRate * 100).toFixed(0)}%).
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-xs font-bold text-emerald-400">
                  Current: {(state.retirement.employee401kContributionPct * 100).toFixed(0)}% of salary (${annual401k.toLocaleString()}/yr)
                </div>
              </div>
            </div>

            {/* Health Savings Account (HSA) */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-lg mb-2">
                  🏥
                </div>
                <h4 className="font-bold text-sm text-white">Health Savings Account (HSA)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  The Triple-Tax Advantage: 1) Tax-deductible contributions ($4,300), 2) Tax-free compound growth, and 3) Tax-free distributions for qualified medical bills!
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (state.cash < 4300) {
                      showToast('Need $4,300 cash to max out annual HSA contribution.');
                      return;
                    }
                    state.cash -= 4300;
                    state.totalXP += 200;
                    soundFx.playCoin();
                    onUpdateState({ ...state });
                    showToast('Maxed out annual HSA! +$4,300 in Triple-Tax Advantaged savings!');
                  }}
                  className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  MAX HSA ($4,300)
                </button>
              </div>
            </div>

            {/* 529 College Savings */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg mb-2">
                  🎓
                </div>
                <h4 className="font-bold text-sm text-white">529 College Savings Plan</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Fund education for your children or yourself. Enjoy up to $5,000 state tax deduction and 100% tax-free growth when spent on qualified higher education tuition.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (state.cash < 2500) {
                      showToast('Need $2,500 cash to contribute to 529 plan.');
                      return;
                    }
                    state.cash -= 2500;
                    state.totalXP += 150;
                    soundFx.playCoin();
                    onUpdateState({ ...state });
                    showToast('Contributed $2,500 to 529 Plan! State income tax deduction unlocked!');
                  }}
                  className="w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs cursor-pointer"
                >
                  CONTRIBUTE $2,500
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
