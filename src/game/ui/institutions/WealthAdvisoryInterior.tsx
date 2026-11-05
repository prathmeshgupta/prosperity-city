import React, { useState } from 'react';
import { GameState } from '../../../types/game';
import { soundFx } from '../../../audio/soundFx';
import { 
  evaluateEstatePlan, 
  compareSocialSecurityClaimingAges, 
  simulateSequenceOfReturnsRisk,
  CFP_LIFECYCLE_STAGES
} from '../../engine/lifecycleStageEngine';
import { evaluateAssetLocation } from '../../engine/cfpPlanningEngine';
import { BuildingEntrance } from '../../world/mapData';
import { 
  Crown, 
  ShieldCheck, 
  Scale, 
  Clock, 
  Coins, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  FolderLock
} from 'lucide-react';

interface WealthAdvisoryInteriorProps {
  building: BuildingEntrance;
  state: GameState;
  onUpdateState: (newState: GameState) => void;
  showToast: (msg: string) => void;
  onOpenLegacyModal?: () => void;
}

export const WealthAdvisoryInterior: React.FC<WealthAdvisoryInteriorProps> = ({
  state,
  onUpdateState,
  showToast,
  onOpenLegacyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'ESTATE' | 'DECUMULATION' | 'SOCIAL_SECURITY' | 'ASSET_LOCATION'>('ESTATE');
  const [hasLivingTrust, setHasLivingTrust] = useState<boolean>(
    Boolean(state.generationalLegacy?.trustFundBalance && state.generationalLegacy.trustFundBalance > 0)
  );

  // Compute Net Worth
  const currentNetWorth = 
    state.cash + 
    state.emergencyFund + 
    state.retirement.traditional401k + 
    state.retirement.rothIRA +
    state.portfolio.reduce((sum, p) => {
      const a = state.assets.find((ast) => ast.id === p.assetId);
      return sum + (a ? p.shares * a.currentPrice : 0);
    }, 0);

  const estatePlan = evaluateEstatePlan(currentNetWorth, 50000, hasLivingTrust);
  const ssAnalysis = compareSocialSecurityClaimingAges(2800);
  const srrSim = simulateSequenceOfReturnsRisk(Math.max(500000, currentNetWorth), 40000, true);

  // Asset location analysis
  const taxableAssets = state.portfolio.map((p) => {
    const a = state.assets.find((ast) => ast.id === p.assetId);
    return {
      id: p.assetId,
      name: a ? a.name : p.assetId,
      category: a ? a.category : 'INDEX_FUND',
    };
  });
  const assetLocAnalysis = evaluateAssetLocation(
    taxableAssets,
    state.retirement.traditional401k,
    state.retirement.rothIRA
  );

  const handleEstablishTrust = () => {
    if (state.cash < 2500) {
      showToast('Establishing a Revocable Living Trust requires $2,500 legal retainer.');
      return;
    }

    const nextState = { ...state };
    nextState.cash -= 2500;
    nextState.totalXP += 300;
    if (!nextState.generationalLegacy) {
      nextState.generationalLegacy = {
        generation: 1,
        trustFundBalance: 10000,
        hallOfFame: [],
      };
    } else {
      nextState.generationalLegacy.trustFundBalance = (nextState.generationalLegacy.trustFundBalance || 0) + 10000;
    }

    setHasLivingTrust(true);
    soundFx.playLevelUp();
    onUpdateState(nextState);
    showToast('Revocable Living Trust Executed! Your family estate will bypass probate court entirely!');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Office Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/30 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                CFP® Knowledge Domains 7 & 8
              </span>
              <h3 className="font-extrabold text-white text-base">Pinnacle Wealth Management & Family Office</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              "Fiduciary wealth stewardship: Revocable Living Trusts, Sequence-of-Returns cash buffers, Social Security claiming optimization, and tax-location engineering."
            </p>
          </div>
        </div>

        {/* Estate Shield Status */}
        <div className="text-right shrink-0 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Estate Protection</div>
          <div className="text-base font-black text-sky-400 flex items-center gap-1 justify-end">
            {hasLivingTrust ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
            <span>{hasLivingTrust ? 'TRUST ACTIVE' : 'PROBATE EXPOSED'}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Net Worth: <span className="font-bold text-white">${currentNetWorth.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('ESTATE')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'ESTATE'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>Revocable Trusts & Estate</span>
        </button>

        <button
          onClick={() => setActiveTab('DECUMULATION')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'DECUMULATION'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sequence of Returns Risk</span>
        </button>

        <button
          onClick={() => setActiveTab('SOCIAL_SECURITY')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'SOCIAL_SECURITY'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Social Security Age 62 vs 70</span>
        </button>

        <button
          onClick={() => setActiveTab('ASSET_LOCATION')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'ASSET_LOCATION'
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Asset Location Audit</span>
        </button>
      </div>

      {/* TAB 1: REVOCABLE TRUST & PROBATE */}
      {activeTab === 'ESTATE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Scenario A: Probate Court */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              !hasLivingTrust ? 'bg-amber-950/20 border-amber-600/40' : 'bg-slate-900/60 border-slate-800 opacity-60'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    Default: No Trust
                  </span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white mt-2">Probate Court Administration</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Assets pass through county probate court. The process is fully public, takes 12–18 months, and statutory attorney/court fees consume 3%–7% of your gross assets!
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Probate Fees:</span>
                  <span className="font-bold text-rose-400">-${(currentNetWorth * 0.045).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Distribution Delay:</span>
                  <span className="font-bold text-amber-400">14–18 Months</span>
                </div>
              </div>
            </div>

            {/* Scenario B: Revocable Living Trust */}
            <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
              hasLivingTrust ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Fiduciary Standard
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-extrabold text-sm text-white mt-2">Revocable Living Trust (Family Dynasty)</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Assets transfer immediately and privately to successor trustees with zero probate fees. Your heirs receive a <strong>100% step-up in cost basis</strong>, wiping out all lifetime capital gains taxes!
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Probate Legal Fees:</span>
                  <span className="font-bold text-emerald-400">$0.00 (Bypassed)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dynasty Multiplier:</span>
                  <span className="font-bold text-sky-400">+25% Bonus to Heirs in New Game+</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-xs text-white">
                {hasLivingTrust ? 'Revocable Living Trust Active' : 'Draft & Fund Revocable Living Trust'}
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {hasLivingTrust
                  ? 'Your estate documents, pour-over will, and durable powers of attorney are fully executed.'
                  : 'Pay $2,500 legal retainer to establish your family living trust and shield your entire balance sheet.'}
              </p>
            </div>

            {!hasLivingTrust ? (
              <button
                onClick={handleEstablishTrust}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-sky-500/20"
              >
                DRAFT TRUST ($2,500)
              </button>
            ) : (
              <button
                onClick={onOpenLegacyModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Crown className="w-4 h-4" />
                <span>INSPECT DYNASTY VAULT</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SEQUENCE OF RETURNS RISK & 3-BUCKET */}
      {activeTab === 'DECUMULATION' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              The Retirement Danger Zone: Sequence-of-Returns Risk (SRR)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Two retirees with identical 8% average market returns over 10 years will have completely different destinies if one suffers an early bear market while withdrawing funds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-[10px] font-black uppercase text-rose-300">Unbuffered (Selling Equities Every Year)</span>
                <div className="text-lg font-black text-rose-400 mt-1">
                  ${srrSim.unbufferedEndingBalance.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Forced to sell depressed stocks in years 1–3 at market lows to fund living expenses, permanently impairing the portfolio.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-[10px] font-black uppercase text-emerald-300">3-Bucket Strategy (Protected)</span>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  ${srrSim.bufferedEndingBalance.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bucket 1 (3 years cash) funded all expenses during the crash. Equities in Bucket 3 were left untouched to recover!
                </p>
              </div>
            </div>

            {/* 3-Bucket Visual Blueprint */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Bucket 1: Cash / T-Bills</span>
                <div className="font-black text-white mt-1">${srrSim.bucket1CashBuffer.toLocaleString()}</div>
                <span className="text-[10px] text-slate-500">2–3 yrs expenses</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-sky-400">Bucket 2: Fixed Income / TIPS</span>
                <div className="font-black text-white mt-1">${srrSim.bucket2BondBuffer.toLocaleString()}</div>
                <span className="text-[10px] text-slate-500">4–7 yrs income bridge</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-purple-400">Bucket 3: Equities & REITs</span>
                <div className="font-black text-white mt-1">${srrSim.bucket3Equities.toLocaleString()}</div>
                <span className="text-[10px] text-slate-500">Long-term growth engine</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SOCIAL SECURITY OPTIMIZATION */}
      {activeTab === 'SOCIAL_SECURITY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[ssAnalysis.claim62, ssAnalysis.claim67, ssAnalysis.claim70].map((tier) => (
              <div
                key={tier.claimingAge}
                className={`p-4 rounded-2xl border flex flex-col justify-between ${
                  tier.claimingAge === 70
                    ? 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Claim at Age {tier.claimingAge}
                    </span>
                    <span className="text-xs font-bold text-sky-400">{tier.pctOfFullBenefit}% Benefit</span>
                  </div>

                  <div className="text-xl font-black text-white mt-2">
                    ${tier.monthlyBenefit.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-slate-400 font-bold">${tier.annualBenefit.toLocaleString()} annually</div>

                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{tier.advice}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Cumulative at Age 80:</span>
                    <span className="font-bold text-white">${tier.cumulativeAtAge80.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cumulative at Age 85:</span>
                    <span className="font-bold text-emerald-400">${tier.cumulativeAtAge85.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong>CFP Social Security Rule:</strong> Delaying claiming from age 67 to 70 provides an unbeatable <strong>8% real annual return</strong> (+24% permanent bump), guaranteed by the federal government and fully inflation-adjusted via COLA adjustments.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSET LOCATION AUDIT */}
      {activeTab === 'ASSET_LOCATION' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-sky-400" />
                  3-Bucket Asset Location Efficiency Score
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Putting the right asset in the right tax account boosts after-tax returns by 0.5%–0.8% annually!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Location Score</div>
                <div className="text-xl font-black text-sky-400">{assetLocAnalysis.efficiencyScore}/100</div>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2">
              {assetLocAnalysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {/* Account Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400">1. Taxable Brokerage</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Broad index funds (VOO, VXUS), Municipal bonds (MUB). Generates low turnover and long-term capital gains rates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-sky-400">2. Tax-Deferred 401(k)</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  REITs (VNQ), Corporate bonds, dividend blue chips. Shields heavy ordinary income dividends from annual taxes.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-purple-400">3. Tax-Free Roth / HSA</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Highest expected growth equities: Small-Cap Value (AVUV), Tech Growth (QQQ). Compounding is 100% tax-free forever!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
