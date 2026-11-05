import { GameState } from '../../types/game';
import { getNetWorth } from '../../engine/gameEngine';

export interface QuestObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  check: (state: GameState, extra?: any) => boolean;
}

export interface ChapterQuest {
  chapter: number;
  act: number;
  actTitle: string;
  title: string;
  subtitle: string;
  storyIntro: string;
  rewardCash: number;
  rewardXP: number;
  icon: string;
  objectives: QuestObjective[];
  isCompleted: boolean;
}

export const CAMPAIGN_CHAPTERS: ChapterQuest[] = [
  // ========================================================
  // ACT I: THE HUMBLE SPARK (AGES 18 - 24)
  // Survival, Emergency Buffers & Debt Annihilation
  // ========================================================
  {
    chapter: 1,
    act: 1,
    actTitle: 'Act I: The Humble Spark',
    title: 'The Broke Apprentice',
    subtitle: 'Build your first $1,000 emergency moat and dodge predatory debt',
    storyIntro: 'You just arrived in Prosperity City with empty pockets and a mountain of dreams. Your first survival priority: establish a $1,000 liquid buffer so an unexpected car repair or dental emergency doesn’t force you into 28% APR credit card debt.',
    rewardCash: 250,
    rewardXP: 100,
    icon: '🛡️',
    isCompleted: false,
    objectives: [
      {
        id: 'q1_emergency_1000',
        description: 'Deposit at least $1,000 into First Prosperity Bank High-Yield Vault (4.5% APY)',
        isCompleted: false,
        check: (state) => state.emergencyFund >= 1000,
      },
      {
        id: 'q1_visit_bank',
        description: 'Enter First Prosperity Bank to inspect the checking and savings counters',
        isCompleted: false,
        check: (state) => state.emergencyFund > 0 || state.cash > 0,
      },
    ],
  },
  {
    chapter: 2,
    act: 1,
    actTitle: 'Act I: The Humble Spark',
    title: 'The Toxic Debt Slayer',
    subtitle: 'Deploy Debt Avalanche to annihilate high-interest credit cards',
    storyIntro: 'Credit card balances compounding at 24% APR are an emergency financial fire burning through your future. Deploy the mathematical Debt Avalanche method (targeting highest interest first) and eliminate all consumer card debt.',
    rewardCash: 400,
    rewardXP: 175,
    icon: '⚔️',
    isCompleted: false,
    objectives: [
      {
        id: 'q2_eliminate_cc',
        description: 'Pay down all revolving credit card balances to $0',
        isCompleted: false,
        check: (state) => {
          const cc = state.debts.filter((d) => d.category === 'CREDIT_CARD');
          return cc.length === 0 || cc.every((d) => d.principal <= 0);
        },
      },
      {
        id: 'q2_credit_score_700',
        description: 'Lift your Credit Score to 700 or higher by maintaining on-time payments',
        isCompleted: false,
        check: (state) => state.character.creditScore >= 700,
      },
    ],
  },
  {
    chapter: 3,
    act: 1,
    actTitle: 'Act I: The Humble Spark',
    title: 'The 50/30/20 Discipline',
    subtitle: 'Master cashflow allocation and build a 3-month living expense reserve',
    storyIntro: 'Wealth is not defined by what you earn, but by the spread between your income and expenses. Master Senator Elizabeth Warren’s 50/30/20 budget: 50% Needs, 30% Wants, and 20% Savings, building a full 3-month reserve.',
    rewardCash: 500,
    rewardXP: 225,
    icon: '⚖️',
    isCompleted: false,
    objectives: [
      {
        id: 'q3_buffer_3_months',
        description: 'Hold at least 3 months of basic living expenses in your High-Yield Vault',
        isCompleted: false,
        check: (state) => {
          const monthlyBurn = (state.character.annualSalary * 0.5) / 12;
          return state.emergencyFund >= monthlyBurn * 3;
        },
      },
      {
        id: 'q3_positive_cashflow',
        description: 'Accumulate at least $5,000 in liquid capital (checking + vault savings)',
        isCompleted: false,
        check: (state) => (state.cash + state.emergencyFund) >= 5000,
      },
    ],
  },

  // ========================================================
  // ACT II: THE ACCELERATION ENGINE (AGES 25 - 32)
  // Tax Shields, Wall Street Equities & Compounding
  // ========================================================
  {
    chapter: 4,
    act: 2,
    actTitle: 'Act II: The Acceleration Engine',
    title: 'Free Money & Tax Shields',
    subtitle: 'Capture 100% of employer 401(k) match and open an HSA',
    storyIntro: 'Failing to capture an employer 401(k) match is literally leaving free compensation on the negotiating table. Step into Apex Career Tower, increase your 401(k) contribution to capture the full match, and open a triple-tax-advantaged HSA.',
    rewardCash: 650,
    rewardXP: 275,
    icon: '💼',
    isCompleted: false,
    objectives: [
      {
        id: 'q4_employer_match',
        description: 'Contribute enough to capture 100% of your employer 401(k) match rate',
        isCompleted: false,
        check: (state) => state.retirement.employee401kContributionPct >= state.retirement.employerMatchLimitPct,
      },
      {
        id: 'q4_hsa_insurance',
        description: 'Maintain active Health Insurance protection at Guardian Health',
        isCompleted: false,
        check: (state) => state.insurance.some((i) => i.category === 'HEALTH' && i.isActive),
      },
    ],
  },
  {
    chapter: 5,
    act: 2,
    actTitle: 'Act II: The Acceleration Engine',
    title: 'Stepping onto Wall Street',
    subtitle: 'Acquire broad-market index fund shares (VOO) on the trading floor',
    storyIntro: 'Cash in the bank protects you, but only productive equity ownership creates true generational wealth. Step onto the trading floor of the Wall Street Exchange and buy your first shares of the top 500 American corporations.',
    rewardCash: 800,
    rewardXP: 325,
    icon: '🏛️',
    isCompleted: false,
    objectives: [
      {
        id: 'q5_buy_sp500',
        description: 'Acquire at least 3 shares of S&P 500 Index Fund (VOO)',
        isCompleted: false,
        check: (state) => state.portfolio.some((p) => p.assetId === 'asset_sp500' && p.shares >= 3),
      },
      {
        id: 'q5_portfolio_5k',
        description: 'Reach a Total Investment Portfolio Value of at least $5,000',
        isCompleted: false,
        check: (state) => {
          const val = state.portfolio.reduce((sum, pos) => {
            const asset = state.assets.find((a) => a.id === pos.assetId);
            return sum + pos.shares * (asset?.currentPrice || 0);
          }, 0);
          return val >= 5000;
        },
      },
    ],
  },
  {
    chapter: 6,
    act: 2,
    actTitle: 'Act II: The Acceleration Engine',
    title: 'Surviving the Bear Market',
    subtitle: 'Hold through market downturns and practice Dollar-Cost Averaging',
    storyIntro: 'The greatest wealth transfer happens during bear markets when amateur investors panic-sell at the bottom. True masters automate their investments, buying low when equities are on sale.',
    rewardCash: 1000,
    rewardXP: 400,
    icon: '📈',
    isCompleted: false,
    objectives: [
      {
        id: 'q6_dca_discipline',
        description: 'Accumulate at least 8 shares across diversified index funds or bonds',
        isCompleted: false,
        check: (state) => {
          const totalShares = state.portfolio.reduce((sum, p) => sum + p.shares, 0);
          return totalShares >= 8;
        },
      },
      {
        id: 'q6_net_worth_50k',
        description: 'Cross the $50,000 Net Worth milestone',
        isCompleted: false,
        check: (state) => getNetWorth(state) >= 50000,
      },
    ],
  },

  // ========================================================
  // ACT III: ASSET EMPIRE & VELOCITY (AGES 33 - 42)
  // Human Capital, Real Estate & The $100k - $250k Sprint
  // ========================================================
  {
    chapter: 7,
    act: 3,
    actTitle: 'Act III: Asset Empire & Velocity',
    title: 'Human Capital Acceleration',
    subtitle: 'Scale your salary, negotiate market-rate pay, or build a side hustle',
    storyIntro: 'Your earning potential is your largest financial asset during your prime working years. Increase your salary, earn professional credentials, or build freelance income at The Daily Grind Cafe.',
    rewardCash: 1250,
    rewardXP: 450,
    icon: '⚡',
    isCompleted: false,
    objectives: [
      {
        id: 'q7_salary_70k',
        description: 'Achieve an annual salary of $70,000 or higher',
        isCompleted: false,
        check: (state) => state.character.annualSalary >= 70000,
      },
      {
        id: 'q7_high_happiness_health',
        description: 'Maintain both Health and Happiness above 70% to prevent burnout',
        isCompleted: false,
        check: (state) => state.character.health >= 70 && state.character.happiness >= 70,
      },
    ],
  },
  {
    chapter: 8,
    act: 3,
    actTitle: 'Act III: Asset Empire & Velocity',
    title: 'Physical Real Estate & Deeds',
    subtitle: 'Acquire real estate or REIT shares for passive tenant cashflow',
    storyIntro: 'Real estate provides inflation-hedged rental cashflow, principal paydown by tenants, and tax depreciation. Visit Residential Row to purchase the Suburban Duplex or invest heavily in Real Estate REITs (VNQ).',
    rewardCash: 1500,
    rewardXP: 550,
    icon: '🏘️',
    isCompleted: false,
    objectives: [
      {
        id: 'q8_real_estate_asset',
        description: 'Own a rental duplex property or at least 15 shares of Real Estate REIT (VNQ)',
        isCompleted: false,
        check: (state) => state.portfolio.some((p) => p.assetId === 're_suburban_duplex' || (p.assetId === 're_vanguard_reit' && p.shares >= 15)),
      },
      {
        id: 'q8_credit_score_750',
        description: 'Attain an Excellent Credit Score of 750+ for prime mortgage rates',
        isCompleted: false,
        check: (state) => state.character.creditScore >= 750,
      },
    ],
  },
  {
    chapter: 9,
    act: 3,
    actTitle: 'Act III: Asset Empire & Velocity',
    title: 'The Charlie Munger Milestone',
    subtitle: 'Cross $100,000 and accelerate to $250,000 Net Worth',
    storyIntro: 'As legendary investor Charlie Munger said: "The first $100,000 is a bitch, but you gotta do it." Once you reach $100,000, the compounded interest of your investments starts earning more than your savings effort!',
    rewardCash: 2000,
    rewardXP: 700,
    icon: '💎',
    isCompleted: false,
    objectives: [
      {
        id: 'q9_net_worth_150k',
        description: 'Reach a Total Net Worth of at least $150,000',
        isCompleted: false,
        check: (state) => getNetWorth(state) >= 150000,
      },
      {
        id: 'q9_zero_consumer_debt',
        description: 'Maintain zero high-interest credit card debt or personal loans',
        isCompleted: false,
        check: (state) => state.debts.every((d) => d.category !== 'CREDIT_CARD' || d.principal <= 0),
      },
    ],
  },

  // ========================================================
  // ACT IV: THE FREEDOM SUMMIT & LEGACY (AGES 43+)
  // Coast-FIRE, The Freedom Bell & Generational Dynasty
  // ========================================================
  {
    chapter: 10,
    act: 4,
    actTitle: 'Act IV: The Freedom Summit & Legacy',
    title: 'The Coast-FIRE Threshold',
    subtitle: 'Cross $250,000 where your investment growth rivals your annual paycheck',
    storyIntro: 'You have entered the exponential compounding zone. Your portfolio produces tens of thousands of dollars each year in pure passive capital gains, dividends, and interest without working another hour.',
    rewardCash: 2500,
    rewardXP: 850,
    icon: '🌊',
    isCompleted: false,
    objectives: [
      {
        id: 'q10_net_worth_250k',
        description: 'Cross the quarter-million-dollar milestone: $250,000 Total Net Worth',
        isCompleted: false,
        check: (state) => getNetWorth(state) >= 250000,
      },
      {
        id: 'q10_retirement_accounts',
        description: 'Amass over $40,000 in tax-advantaged retirement accounts (401k + Roth IRA)',
        isCompleted: false,
        check: (state) => (state.retirement.traditional401k + state.retirement.rothIRA) >= 40000,
      },
    ],
  },
  {
    chapter: 11,
    act: 4,
    actTitle: 'Act IV: The Freedom Summit & Legacy',
    title: 'Ringing the Freedom Bell (FIRE)',
    subtitle: 'Reach 25x annual expenses and achieve complete Financial Independence',
    storyIntro: 'The summit of human autonomy. Your invested assets produce enough passive cash flow under Trinity Study 4% withdrawal rules to pay for all living expenses indefinitely. You answer to no boss. Walk to the Central Plaza fountain and ring the Golden Freedom Bell!',
    rewardCash: 5000,
    rewardXP: 1200,
    icon: '🔔',
    isCompleted: false,
    objectives: [
      {
        id: 'q11_fire_number',
        description: 'Reach your 25x Annual Expense FIRE Freedom Number ($500,000+ Net Worth)',
        isCompleted: false,
        check: (state) => {
          const annualBurn = state.character.annualSalary * 0.5;
          const target = Math.max(500000, annualBurn * 20);
          return getNetWorth(state) >= target;
        },
      },
      {
        id: 'q11_freedom_bell',
        description: 'Walk to the Golden Fountain at the center of Town Plaza and ring the Freedom Bell',
        isCompleted: false,
        check: (state, extra) => Boolean(extra?.rungFreedomBell),
      },
    ],
  },
  {
    chapter: 12,
    act: 4,
    actTitle: 'Act IV: The Freedom Summit & Legacy',
    title: 'The Generational Dynasty & Family Trust',
    subtitle: 'Protect your dynasty, establish trusts, and launch New Game+',
    storyIntro: 'The final master chapter. True financial masters don’t just liberate themselves—they establish revocable family trusts, shield assets from probate, and pass down generational financial literacy to the next era.',
    rewardCash: 10000,
    rewardXP: 2000,
    icon: '👑',
    isCompleted: false,
    objectives: [
      {
        id: 'q12_cross_1m',
        description: 'Cross $750,000 to $1,000,000 in generational wealth',
        isCompleted: false,
        check: (state) => getNetWorth(state) >= 750000,
      },
      {
        id: 'q12_dynasty_ready',
        description: 'Achieve a pristine Financial Health Grade of A or A+ with zero bad debt',
        isCompleted: false,
        check: (state) => state.debts.length === 0 || state.debts.every((d) => d.principal <= 0 || d.interestRate < 0.05),
      },
    ],
  },
];
