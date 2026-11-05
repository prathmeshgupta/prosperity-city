/**
 * CFP® Holistic Lifecycle & Retirement Decumulation Engine
 * Covers:
 * 1. 5 Human Lifecycle Milestones & Priorities (18-25 Foundation to 65+ Legacy)
 * 2. Sequence of Returns Risk (SRR) & 3-Bucket Cash Buffer Architecture
 * 3. Social Security Claiming Age Math (Age 62 [70%] vs Age 67 [100%] vs Age 70 [124%])
 * 4. Safe Withdrawal Rates (Trinity 4% Rule vs Dynamic Guardrails)
 * 5. Estate Planning: Revocable Living Trusts vs Probate Court drag & Step-up in Basis
 */

export interface LifeStageProfile {
  id: 'FOUNDATION' | 'ACCELERATION' | 'PEAK_EARNINGS' | 'PRE_RETIREMENT' | 'DECUMULATION_DYNASTY';
  name: string;
  ageRange: string;
  coreCFPFocus: string;
  icon: string;
  priorityChecklist: {
    task: string;
    description: string;
    domain: 'CASHFLOW' | 'RISK_MGMT' | 'INVESTMENTS' | 'TAX' | 'RETIREMENT' | 'ESTATE';
    isCritical: boolean;
  }[];
}

export const CFP_LIFECYCLE_STAGES: Record<string, LifeStageProfile> = {
  FOUNDATION: {
    id: 'FOUNDATION',
    name: 'Phase 1: Foundation & Human Capital',
    ageRange: 'Ages 18–25',
    coreCFPFocus: 'Eliminate toxic debt, build 3-month emergency liquidity, protect human capital with disability coverage.',
    icon: '🌱',
    priorityChecklist: [
      {
        task: 'Build 3–6 Month Emergency Reserve',
        description: 'Keep liquid cash in high-yield savings (4.5% APY) to avoid credit card debt on surprise shocks.',
        domain: 'CASHFLOW',
        isCritical: true,
      },
      {
        task: 'Capture Full Employer 401(k) Match',
        description: 'Never leave free money on the table; 50%-100% immediate return on contribution.',
        domain: 'RETIREMENT',
        isCritical: true,
      },
      {
        task: 'Own-Occupation Disability Insurance',
        description: 'Your future earnings are your largest asset ($2M–$5M lifetime); protect it against injury.',
        domain: 'RISK_MGMT',
        isCritical: true,
      },
      {
        task: 'Build 720+ Credit Score',
        description: 'Establish low credit utilization and 100% on-time payment history for future prime mortgage rates.',
        domain: 'CASHFLOW',
        isCritical: false,
      },
    ],
  },
  ACCELERATION: {
    id: 'ACCELERATION',
    name: 'Phase 2: Wealth Acceleration & Family Formation',
    ageRange: 'Ages 26–35',
    coreCFPFocus: 'Home purchase / house-hacking, 529 education funding, and Backdoor Roth IRA conversions.',
    icon: '🚀',
    priorityChecklist: [
      {
        task: 'Purchase Primary Residence or Duplex',
        description: 'Acquire real estate using fixed-rate 30-year debt to lock in housing costs and build equity.',
        domain: 'INVESTMENTS',
        isCritical: true,
      },
      {
        task: 'Fund 529 College Savings for Dependents',
        description: 'State income tax deduction + tax-free growth and distributions for qualified education expenses.',
        domain: 'TAX',
        isCritical: false,
      },
      {
        task: 'Backdoor Roth IRA Strategy',
        description: 'Bypass IRS income phaseouts via non-deductible traditional contribution converted to Roth.',
        domain: 'TAX',
        isCritical: true,
      },
      {
        task: 'Underwrite 20-Year Term Life Insurance',
        description: '10x–12x annual salary to replace income for dependents at a fraction of Whole Life cost.',
        domain: 'RISK_MGMT',
        isCritical: true,
      },
    ],
  },
  PEAK_EARNINGS: {
    id: 'PEAK_EARNINGS',
    name: 'Phase 3: Peak Earnings & High-Bracket Tax Shields',
    ageRange: 'Ages 36–50',
    coreCFPFocus: 'Asset location optimization, executive RSU/ESPP management, umbrella liability, and tax-loss harvesting.',
    icon: '⛰️',
    priorityChecklist: [
      {
        task: 'Add $2M–$5M Personal Umbrella Liability',
        description: 'Shield substantial net worth from catastrophic slip-and-fall or multi-vehicle auto accident lawsuits.',
        domain: 'RISK_MGMT',
        isCritical: true,
      },
      {
        task: 'Automate Year-End Tax-Loss Harvesting',
        description: 'Offset realized capital gains dollar-for-dollar and wipe out $3,000 of high marginal salary.',
        domain: 'TAX',
        isCritical: true,
      },
      {
        task: 'Diversify Concentrated Stock / RSUs',
        description: 'Prevent company concentration risk by systematically selling vesting shares into index funds.',
        domain: 'INVESTMENTS',
        isCritical: true,
      },
      {
        task: 'Draft Revocable Living Trust & Healthcare Proxy',
        description: 'Ensure assets avoid costly, public 18-month probate court battles in the event of incapacity.',
        domain: 'ESTATE',
        isCritical: true,
      },
    ],
  },
  PRE_RETIREMENT: {
    id: 'PRE_RETIREMENT',
    name: 'Phase 4: Pre-Retirement & Decumulation Transition',
    ageRange: 'Ages 51–65',
    coreCFPFocus: 'Sequence of returns risk mitigation, catch-up contributions, and Roth conversion ladders before RMDs.',
    icon: '⏳',
    priorityChecklist: [
      {
        task: 'Construct 3-Year Cash & Bond Buffer',
        description: 'Prevent selling equities during a bear market in your first years of retirement.',
        domain: 'RETIREMENT',
        isCritical: true,
      },
      {
        task: 'Execute Strategic Roth Conversion Ladder',
        description: 'Convert pre-tax 401(k) to Roth in low-income transition years before Required Minimum Distributions (RMDs at 73).',
        domain: 'TAX',
        isCritical: true,
      },
      {
        task: 'Secure Long-Term Care (LTC) Coverage',
        description: 'Protect retirement principal from $100k+/year skilled nursing or assisted living facility expenses.',
        domain: 'RISK_MGMT',
        isCritical: false,
      },
    ],
  },
  DECUMULATION_DYNASTY: {
    id: 'DECUMULATION_DYNASTY',
    name: 'Phase 5: Decumulation, FIRE & Dynastic Legacy',
    ageRange: 'Ages 65+',
    coreCFPFocus: 'Trinity 4% safe withdrawal rate, Social Security age 70 delay optimization, and dynastic basis step-up.',
    icon: '👑',
    priorityChecklist: [
      {
        task: 'Delay Social Security to Age 70',
        description: 'Capture guaranteed 8% annual delayed retirement credits (+24% to +32% permanent boost over FRA).',
        domain: 'RETIREMENT',
        isCritical: true,
      },
      {
        task: 'Implement Dynamic 4% Safe Withdrawal Rule',
        description: 'Adjust withdrawal rates dynamically during bear markets using Guyton-Klinger guardrails.',
        domain: 'RETIREMENT',
        isCritical: true,
      },
      {
        task: 'Generational Wealth Transfer & Step-Up in Basis',
        description: 'Pass appreciated assets to next generation with 100% cost-basis step-up, eliminating capital gains.',
        domain: 'ESTATE',
        isCritical: true,
      },
    ],
  },
};

/**
 * Social Security Claiming Age Optimizer (CFP Knowledge Domain 7)
 * Assumes a baseline Primary Insurance Amount (PIA) at Full Retirement Age (FRA = 67)
 */
export interface SocialSecurityComparison {
  claimingAge: 62 | 67 | 70;
  monthlyBenefit: number;
  annualBenefit: number;
  pctOfFullBenefit: number;
  cumulativeAtAge80: number;
  cumulativeAtAge85: number;
  breakEvenAgeVs62: number;
  advice: string;
}

export function compareSocialSecurityClaimingAges(baselinePIAMonthly: number = 2500): {
  claim62: SocialSecurityComparison;
  claim67: SocialSecurityComparison;
  claim70: SocialSecurityComparison;
  optimalRecommendation: string;
} {
  // Claim at 62: 70% of FRA PIA
  const b62 = Math.round(baselinePIAMonthly * 0.70);
  // Claim at 67: 100% of FRA PIA
  const b67 = Math.round(baselinePIAMonthly * 1.00);
  // Claim at 70: 124% of FRA PIA (+8% per year for 3 years)
  const b70 = Math.round(baselinePIAMonthly * 1.24);

  const cum62At80 = b62 * 12 * 18;
  const cum67At80 = b67 * 12 * 13;
  const cum70At80 = b70 * 12 * 10;

  const cum62At85 = b62 * 12 * 23;
  const cum67At85 = b67 * 12 * 18;
  const cum70At85 = b70 * 12 * 15;

  return {
    claim62: {
      claimingAge: 62,
      monthlyBenefit: b62,
      annualBenefit: b62 * 12,
      pctOfFullBenefit: 70,
      cumulativeAtAge80: cum62At80,
      cumulativeAtAge85: cum62At85,
      breakEvenAgeVs62: 62,
      advice: 'Early claim: Receives checks for 5 more years, but takes a permanent -30% lifetime haircut.',
    },
    claim67: {
      claimingAge: 67,
      monthlyBenefit: b67,
      annualBenefit: b67 * 12,
      pctOfFullBenefit: 100,
      cumulativeAtAge80: cum67At80,
      cumulativeAtAge85: cum67At85,
      breakEvenAgeVs62: 78,
      advice: 'Full Retirement Age: 100% statutory benefit. Breaks even with claiming at 62 around age 78.',
    },
    claim70: {
      claimingAge: 70,
      monthlyBenefit: b70,
      annualBenefit: b70 * 12,
      pctOfFullBenefit: 124,
      cumulativeAtAge80: cum70At80,
      cumulativeAtAge85: cum70At85,
      breakEvenAgeVs62: 82,
      advice: 'Maximum Delay: Guaranteed 8% real annual return from age 67 to 70 (+24% permanent bump). Superior inflation-protected longevity hedge.',
    },
    optimalRecommendation:
      'For retirees with average or above-average longevity, delaying to Age 70 provides an unbeatable government-guaranteed, CPI-indexed pension stream that outperforms fixed income annuities.',
  };
}

/**
 * Sequence of Returns Risk (SRR) & 3-Bucket Simulator
 * Demonstrates how a market crash early in retirement depletes a fixed withdrawal portfolio
 */
export interface SequenceOfReturnsSim {
  unbufferedFailureYear: number | null; // year portfolio hits $0
  unbufferedEndingBalance: number;
  bufferedEndingBalance: number;
  bucket1CashBuffer: number;
  bucket2BondBuffer: number;
  bucket3Equities: number;
  annualWithdrawal: number;
  takeaway: string;
}

export function simulateSequenceOfReturnsRisk(
  initialPortfolio: number = 1000000,
  annualWithdrawal: number = 40000, // 4% Rule
  crashInEarlyYears: boolean = true
): SequenceOfReturnsSim {
  // Returns over 10 retirement years
  const returnsEarlyCrash = [-0.22, -0.15, -0.05, 0.18, 0.22, 0.12, 0.10, 0.08, 0.14, 0.11];
  const returnsLateCrash = [0.11, 0.14, 0.08, 0.10, 0.12, 0.22, 0.18, -0.05, -0.15, -0.22];
  const marketReturns = crashInEarlyYears ? returnsEarlyCrash : returnsLateCrash;

  // 1. Unbuffered: Selling equities every year to fund withdrawals
  let unbufferedBalance = initialPortfolio;
  let unbufferedFailureYear: number | null = null;

  for (let yr = 0; yr < marketReturns.length; yr++) {
    unbufferedBalance -= annualWithdrawal;
    if (unbufferedBalance <= 0) {
      unbufferedFailureYear = yr + 1;
      unbufferedBalance = 0;
      break;
    }
    unbufferedBalance *= 1 + marketReturns[yr];
  }

  // 2. 3-Bucket Buffered:
  // Bucket 1: 3 years cash = $120,000 (0% return)
  // Bucket 2: 4 years short bonds = $160,000 (4.5% steady return)
  // Bucket 3: Remainder in equities = $720,000 (fluctuates with market)
  let b1 = annualWithdrawal * 3;
  let b2 = annualWithdrawal * 4;
  let b3 = initialPortfolio - b1 - b2;

  for (let yr = 0; yr < marketReturns.length; yr++) {
    const marketDrop = marketReturns[yr] < 0;

    if (marketDrop) {
      // In bear markets, withdraw exclusively from Bucket 1 (Cash). Do NOT sell stocks!
      b1 -= annualWithdrawal;
      if (b1 < 0) {
        b2 += b1;
        b1 = 0;
      }
    } else {
      // In bull markets, withdraw from equity gains and replenish Bucket 1
      b3 -= annualWithdrawal;
      if (b1 < annualWithdrawal * 2 && b3 > 0) {
        const topUp = Math.min(b3 * 0.1, annualWithdrawal);
        b3 -= topUp;
        b1 += topUp;
      }
    }

    b2 *= 1.045; // steady bond yield
    b3 *= 1 + marketReturns[yr];
  }

  const roundedUnbuffered = Math.round(unbufferedBalance);
  const bufferedEndingBalance = Math.round(b1 + b2 + b3);

  return {
    unbufferedFailureYear,
    unbufferedEndingBalance: roundedUnbuffered,
    bufferedEndingBalance,
    bucket1CashBuffer: Math.round(b1),
    bucket2BondBuffer: Math.round(b2),
    bucket3Equities: Math.round(b3),
    annualWithdrawal,
    takeaway:
      roundedUnbuffered < bufferedEndingBalance
        ? `Sequence of Returns Risk proved: Without a cash buffer, selling depressed stocks locked in losses, ending with $${roundedUnbuffered.toLocaleString()}. With the 3-Bucket cash buffer, you never sold during drops, preserving $${bufferedEndingBalance.toLocaleString()}!`
        : `Steady market conditions allowed equities to thrive. Ending balance: $${bufferedEndingBalance.toLocaleString()}.`,
  };
}

/**
 * Estate Planning: Revocable Living Trust vs Probate Court
 */
export interface EstatePlanningComparison {
  hasLivingTrust: boolean;
  probateFeeDrag: number;       // 3% to 7% of estate
  courtSettlementMonths: number;// 12 to 18 months
  privacyStatus: 'PUBLIC_COURT_RECORD' | 'PRIVATE_FAMILY_TRANSFER';
  stepUpInBasisApplied: boolean;
  capitalGainsTaxOnHeirs: number;
  dynasticSuccessionMultiplier: number; // For New Game+
}

export function evaluateEstatePlan(
  totalEstateNetWorth: number,
  unrealizedCapitalGains: number,
  hasRevocableTrust: boolean
): EstatePlanningComparison {
  if (hasRevocableTrust) {
    return {
      hasLivingTrust: true,
      probateFeeDrag: 0,
      courtSettlementMonths: 0,
      privacyStatus: 'PRIVATE_FAMILY_TRANSFER',
      stepUpInBasisApplied: true,
      capitalGainsTaxOnHeirs: 0, // 100% basis step-up to fair market value on date of death!
      dynasticSuccessionMultiplier: 1.25, // +25% bonus capital to next generation heir
    };
  }

  // Without trust: Subject to probate court statutory fees (California/NY average ~4.5%)
  const probateFeeDrag = Math.round(totalEstateNetWorth * 0.045);
  // Potential delays and legal disputes
  return {
    hasLivingTrust: false,
    probateFeeDrag,
    courtSettlementMonths: 16,
    privacyStatus: 'PUBLIC_COURT_RECORD',
    stepUpInBasisApplied: true,
    capitalGainsTaxOnHeirs: 0,
    dynasticSuccessionMultiplier: 0.95, // 5% lost to probate delays and attorney fees
  };
}
