/**
 * CFP® Board Principal Knowledge Domains - Financial Planning & Tax Optimization Engine
 * Covers:
 * 1. Federal & State Income Tax Engine (IRS 2026/2027 brackets, standard deductions)
 * 2. Pre-Tax Deductions: 401(k), HSA, 529 College Savings, Student Loan Interest
 * 3. Long-Term Capital Gains, NIIT (3.8%), and Tax-Loss Harvesting
 * 4. Geographic & State Tax Arbitrage (Metropolis 10.5% vs Sunbelt Haven 0%)
 * 5. Comprehensive Risk Management & Insurance Underwriting (Own-Occ Disability, Umbrella, LTC)
 * 6. Asset Location 3-Bucket Framework (Taxable vs Tax-Deferred vs Tax-Free)
 */

export type TaxJurisdiction = 'METROPOLIS_HUB' | 'SUNBELT_HAVEN' | 'SUBURBAN_PARK';

export interface TaxJurisdictionInfo {
  id: TaxJurisdiction;
  name: string;
  stateIncomeTaxRate: number; // e.g. 0.105 for 10.5%
  propertyTaxRate: number;    // e.g. 0.018 for 1.8%
  livingCostMultiplier: number;
  salaryBonusMultiplier: number;
  description: string;
}

export const TAX_JURISDICTIONS: Record<TaxJurisdiction, TaxJurisdictionInfo> = {
  METROPOLIS_HUB: {
    id: 'METROPOLIS_HUB',
    name: 'Metropolis Financial District (High Tax, High Salary)',
    stateIncomeTaxRate: 0.105,
    propertyTaxRate: 0.012,
    livingCostMultiplier: 1.25,
    salaryBonusMultiplier: 1.25,
    description: 'Premier financial and tech center. Top compensation, but 10.5% combined state and municipal tax drag.',
  },
  SUNBELT_HAVEN: {
    id: 'SUNBELT_HAVEN',
    name: 'Sunbelt Innovation Haven (0% State Income Tax)',
    stateIncomeTaxRate: 0.0,
    propertyTaxRate: 0.021,
    livingCostMultiplier: 0.90,
    salaryBonusMultiplier: 1.0,
    description: 'Zero state income tax state (like Texas or Florida). Saves thousands in tax drag, but higher property tax.',
  },
  SUBURBAN_PARK: {
    id: 'SUBURBAN_PARK',
    name: 'Suburban Green Belt (Balanced Moderate Tax)',
    stateIncomeTaxRate: 0.048,
    propertyTaxRate: 0.014,
    livingCostMultiplier: 1.0,
    salaryBonusMultiplier: 1.05,
    description: 'Moderate 4.8% state tax, top-rated public universities, ideal for 529 state college deductions.',
  },
};

export interface TaxBracket {
  rate: number;
  min: number;
  max: number;
}

export const FEDERAL_SINGLE_BRACKETS_2026: TaxBracket[] = [
  { rate: 0.10, min: 0, max: 11925 },
  { rate: 0.12, min: 11925, max: 48475 },
  { rate: 0.22, min: 48475, max: 103350 },
  { rate: 0.24, min: 103350, max: 197300 },
  { rate: 0.32, min: 197300, max: 250525 },
  { rate: 0.35, min: 250525, max: 626350 },
  { rate: 0.37, min: 626350, max: Infinity },
];

export const STANDARD_DEDUCTION_SINGLE_2026 = 15000;
export const STANDARD_DEDUCTION_MARRIED_2026 = 30000;

export interface TaxCalculationResult {
  grossIncome: number;
  aboveTheLineDeductions: {
    traditional401k: number;
    hsaContribution: number;
    college529Deduction: number;
    studentLoanInterest: number;
    totalAboveLine: number;
  };
  adjustedGrossIncome: number; // AGI
  standardDeduction: number;
  taxableIncome: number;
  federalOrdinaryTax: number;
  effectiveFederalRate: number;
  marginalFederalRate: number;
  stateTax: number;
  effectiveCombinedRate: number;
  ficaMedicareTax: number; // 7.65% Social Security & Medicare
  totalTaxOwed: number;
  netTakeHomePay: number;
}

/**
 * Calculates authentic IRS Federal and State marginal tax breakdown
 */
export function calculateComprehensiveTaxes(
  grossAnnualIncome: number,
  jurisdiction: TaxJurisdiction = 'METROPOLIS_HUB',
  filingStatus: 'SINGLE' | 'MARRIED' = 'SINGLE',
  preTaxDeductions: {
    traditional401k?: number;
    hsaContribution?: number;
    college529Contribution?: number;
    studentLoanInterestPaid?: number;
  } = {}
): TaxCalculationResult {
  const stdDeduction =
    filingStatus === 'MARRIED'
      ? STANDARD_DEDUCTION_MARRIED_2026
      : STANDARD_DEDUCTION_SINGLE_2026;

  // 1. Above-The-Line Deductions (reduces AGI directly)
  const traditional401k = Math.min(23500, preTaxDeductions.traditional401k || 0);
  const hsaContribution = Math.min(4300, preTaxDeductions.hsaContribution || 0);
  const college529Deduction = Math.min(5000, preTaxDeductions.college529Contribution || 0);
  const studentLoanInterest = Math.min(2500, preTaxDeductions.studentLoanInterestPaid || 0);

  const totalAboveLine = traditional401k + hsaContribution + college529Deduction + studentLoanInterest;
  const adjustedGrossIncome = Math.max(0, grossAnnualIncome - totalAboveLine);

  // 2. Taxable Income after Standard Deduction
  const taxableIncome = Math.max(0, adjustedGrossIncome - stdDeduction);

  // 3. Progressive Federal Bracket Calculation
  let federalOrdinaryTax = 0;
  let marginalFederalRate = 0.10;

  for (const bracket of FEDERAL_SINGLE_BRACKETS_2026) {
    if (taxableIncome > bracket.min) {
      const taxableInThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      federalOrdinaryTax += taxableInThisBracket * bracket.rate;
      marginalFederalRate = bracket.rate;
    }
  }

  // 4. State Income Tax
  const stateInfo = TAX_JURISDICTIONS[jurisdiction];
  const stateTaxable = Math.max(0, adjustedGrossIncome - college529Deduction);
  const stateTax = Math.round(stateTaxable * stateInfo.stateIncomeTaxRate);

  // 5. FICA / Social Security (6.2% up to $168,600) + Medicare (1.45%)
  const socialSecurityTax = Math.min(grossAnnualIncome, 168600) * 0.062;
  const medicareTax = grossAnnualIncome * 0.0145;
  const ficaMedicareTax = Math.round(socialSecurityTax + medicareTax);

  const totalTaxOwed = Math.round(federalOrdinaryTax + stateTax + ficaMedicareTax);
  const netTakeHomePay = Math.max(0, grossAnnualIncome - totalTaxOwed - traditional401k - hsaContribution);

  const effectiveFederalRate = grossAnnualIncome > 0 ? federalOrdinaryTax / grossAnnualIncome : 0;
  const effectiveCombinedRate = grossAnnualIncome > 0 ? totalTaxOwed / grossAnnualIncome : 0;

  return {
    grossIncome: grossAnnualIncome,
    aboveTheLineDeductions: {
      traditional401k,
      hsaContribution,
      college529Deduction,
      studentLoanInterest,
      totalAboveLine,
    },
    adjustedGrossIncome,
    standardDeduction: stdDeduction,
    taxableIncome,
    federalOrdinaryTax: Math.round(federalOrdinaryTax),
    effectiveFederalRate,
    marginalFederalRate,
    stateTax,
    effectiveCombinedRate,
    ficaMedicareTax,
    totalTaxOwed,
    netTakeHomePay,
  };
}

/**
 * Tax-Loss Harvesting (TLH) Execution
 * CFP rule: Realized losses offset capital gains 1:1, plus up to $3,000 ordinary income per year.
 * Excess carries forward indefinitely.
 */
export interface TaxLossHarvestResult {
  realizedCapitalGain: number;
  realizedCapitalLoss: number;
  netCapitalGainLoss: number;
  ordinaryIncomeOffsetUsed: number; // max $3,000
  taxSavedAtMarginalRate: number;
  carryforwardLossRemaining: number;
  washSaleWarning: boolean;
  educationalTakeaway: string;
}

export function harvestTaxLosses(
  realizedGainsThisYear: number,
  harvestableLossesAmount: number,
  marginalTaxRate: number,
  existingLossCarryforward: number = 0
): TaxLossHarvestResult {
  const totalLossesAvailable = harvestableLossesAmount + existingLossCarryforward;
  const net = realizedGainsThisYear - totalLossesAvailable;

  let ordinaryIncomeOffsetUsed = 0;
  let carryforwardLossRemaining = 0;
  let taxSavedAtMarginalRate = 0;

  if (net < 0) {
    // We have excess losses
    const excessLoss = Math.abs(net);
    ordinaryIncomeOffsetUsed = Math.min(3000, excessLoss);
    carryforwardLossRemaining = excessLoss - ordinaryIncomeOffsetUsed;
    taxSavedAtMarginalRate = Math.round(
      realizedGainsThisYear * 0.15 + ordinaryIncomeOffsetUsed * marginalTaxRate
    );
  } else {
    // Losses wiped out part or all of the gain
    taxSavedAtMarginalRate = Math.round(totalLossesAvailable * 0.15);
  }

  return {
    realizedCapitalGain: realizedGainsThisYear,
    realizedCapitalLoss: harvestableLossesAmount,
    netCapitalGainLoss: net,
    ordinaryIncomeOffsetUsed,
    taxSavedAtMarginalRate,
    carryforwardLossRemaining,
    washSaleWarning: false,
    educationalTakeaway:
      ordinaryIncomeOffsetUsed > 0
        ? `Successfully harvested $${harvestableLossesAmount.toLocaleString()} in losses. Wiped out $${Math.min(realizedGainsThisYear, totalLossesAvailable).toLocaleString()} in capital gains and offset $${ordinaryIncomeOffsetUsed.toLocaleString()} of your high-bracket salary, saving $${taxSavedAtMarginalRate.toLocaleString()} in taxes! Remember the 30-day Wash-Sale rule: swap into an equivalent but non-identical index.`
        : `Harvested losses offset $${totalLossesAvailable.toLocaleString()} of gains, preventing taxable gain realizations.`,
  };
}

/**
 * CFP Asset Location (3-Bucket Framework):
 * 1. Taxable (Brokerage): Broad stock index funds, Municipal bonds, high turnover positions for tax loss harvesting
 * 2. Tax-Deferred (Traditional 401k/IRA): Bonds, REITs (taxed as ordinary income), Dividend blue-chips
 * 3. Tax-Free (Roth IRA, HSA): Highest growth assets (Small-Cap Value, Tech, High-yield growth)
 */
export interface AssetLocationAnalysis {
  efficiencyScore: number; // 0 - 100
  recommendations: string[];
  taxableAssets: { id: string; name: string; isOptimal: boolean; advice: string }[];
  taxDeferredAssets: { id: string; name: string; isOptimal: boolean; advice: string }[];
  taxFreeAssets: { id: string; name: string; isOptimal: boolean; advice: string }[];
}

export function evaluateAssetLocation(
  taxableHoldings: { id: string; category: string; name: string }[],
  taxDeferredBalance: number,
  taxFreeBalance: number
): AssetLocationAnalysis {
  const recommendations: string[] = [];
  const taxableEvaluated = taxableHoldings.map((h) => {
    if (h.category === 'GOV_BOND' || h.category === 'REAL_ESTATE_REIT') {
      recommendations.push(
        `Move ${h.name} out of Taxable Brokerage into your Traditional 401(k) to prevent continuous ordinary income tax drag.`
      );
      return {
        id: h.id,
        name: h.name,
        isOptimal: false,
        advice: 'Suboptimal: Generates ordinary income dividends taxed at your highest marginal rate.',
      };
    }
    return {
      id: h.id,
      name: h.name,
      isOptimal: true,
      advice: 'Optimal: Low turnover equity index fund, highly tax-efficient in taxable accounts.',
    };
  });

  let efficiencyScore = 80;
  if (taxDeferredBalance > 0 && taxableHoldings.some((h) => h.category === 'REAL_ESTATE_REIT')) {
    efficiencyScore -= 20;
  }
  if (taxFreeBalance === 0) {
    efficiencyScore -= 15;
    recommendations.push('Fund a Roth IRA or HSA to build a tax-free compound growth bucket.');
  }

  return {
    efficiencyScore: Math.max(20, Math.min(100, efficiencyScore)),
    recommendations: recommendations.length > 0 ? recommendations : ['Asset location is currently optimal!'],
    taxableAssets: taxableEvaluated,
    taxDeferredAssets: [
      {
        id: 'asset_401k',
        name: 'Traditional 401(k) / IRA',
        isOptimal: true,
        advice: 'Best for bonds, REITs, and income-producing assets shielded from annual taxes.',
      },
    ],
    taxFreeAssets: [
      {
        id: 'asset_roth_hsa',
        name: 'Roth IRA & Health Savings Account (HSA)',
        isOptimal: true,
        advice: 'Best for maximum compounding assets: 100% tax-free growth and tax-free withdrawals.',
      },
    ],
  };
}

/**
 * Comprehensive Risk Management / Insurance Underwriting Policies
 */
export interface ComprehensiveInsuranceSuite {
  ownOccupationDisability: {
    isActive: boolean;
    monthlyBenefit: number;
    monthlyPremium: number;
    coverageDescription: string;
  };
  umbrellaLiability: {
    isActive: boolean;
    coverageLimit: number; // e.g. $2,000,000
    annualPremium: number;
    coverageDescription: string;
  };
  hsaHealthPlan: {
    isActive: boolean;
    hasHSA: boolean;
    annualDeductible: number;
    monthlyPremium: number;
  };
  longTermCare: {
    isActive: boolean;
    monthlyBenefit: number;
    monthlyPremium: number;
  };
}
