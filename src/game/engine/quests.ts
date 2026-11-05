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
  {
    chapter: 1,
    title: 'The Broke Apprentice',
    subtitle: 'Build your first $1,000 emergency buffer and dodge car debt',
    storyIntro: 'You just arrived in Prosperity City with empty pockets and a mountain of dreams. Your first task: establish a basic cash buffer so a blown tire doesn’t bankrupt you.',
    rewardCash: 250,
    rewardXP: 100,
    icon: '🛡️',
    isCompleted: false,
    objectives: [
      {
        id: 'q1_emergency_1000',
        description: 'Deposit at least $1,000 into First Prosperity Bank High-Yield Vault',
        isCompleted: false,
        check: (state) => state.emergencyFund >= 1000,
      },
      {
        id: 'q1_talk_sterling',
        description: 'Talk to Banker Sterling outside the bank about the 50/30/20 rule',
        isCompleted: false,
        check: (state, extra) => Boolean(extra?.talkedToSterling),
      },
    ],
  },
  {
    chapter: 2,
    title: 'The Toxic Debt Slayer',
    subtitle: 'Crush high-interest 24% credit card debt',
    storyIntro: 'Credit card interest at 24% APR is an invisible fire consuming your paycheck. It is time to deploy the Debt Avalanche method and eliminate consumer liabilities.',
    rewardCash: 350,
    rewardXP: 150,
    icon: '⚔️',
    isCompleted: false,
    objectives: [
      {
        id: 'q2_eliminate_cc',
        description: 'Eliminate all credit card balances down to $0',
        isCompleted: false,
        check: (state) => {
          const cc = state.debts.filter((d) => d.category === 'CREDIT_CARD');
          return cc.length === 0 || cc.every((d) => d.principal <= 0);
        },
      },
      {
        id: 'q2_credit_score_720',
        description: 'Reach a Credit Score of 700 or higher',
        isCompleted: false,
        check: (state) => state.character.creditScore >= 700,
      },
    ],
  },
  {
    chapter: 3,
    title: 'Stepping onto Wall Street',
    subtitle: 'Acquire your first index fund shares and capture employer match',
    storyIntro: 'Cash defends you, but only productive equity builds generational wealth. Step onto the trading floor of the Wall Street Exchange and become an owner of American business.',
    rewardCash: 500,
    rewardXP: 200,
    icon: '🏛️',
    isCompleted: false,
    objectives: [
      {
        id: 'q3_buy_sp500',
        description: 'Purchase at least 1 share of S&P 500 Index Fund (VOO)',
        isCompleted: false,
        check: (state) => state.portfolio.some((p) => p.assetId === 'asset_sp500' && p.shares >= 1),
      },
      {
        id: 'q3_employer_match',
        description: 'Capture 100% of your employer 401(k) match at Career Tower',
        isCompleted: false,
        check: (state) => state.retirement.employee401kContributionPct >= state.retirement.employerMatchLimitPct,
      },
    ],
  },
  {
    chapter: 4,
    title: 'Physical Real Estate & Deeds',
    subtitle: 'Acquire real estate and lock in cash flow',
    storyIntro: 'Real estate provides inflation-proof rents, tax depreciation, and mortgage paydown. Walk down Residential Row and inspect properties for sale.',
    rewardCash: 800,
    rewardXP: 300,
    icon: '🏘️',
    isCompleted: false,
    objectives: [
      {
        id: 'q4_own_real_estate',
        description: 'Acquire a rental duplex or REIT shares (VNQ)',
        isCompleted: false,
        check: (state) => state.portfolio.some((p) => (p.assetId === 're_vanguard_reit' && p.shares >= 10) || p.assetId === 're_suburban_duplex'),
      },
      {
        id: 'q4_emergency_buffer_3m',
        description: 'Hold at least 3 months of living expenses in cash reserve',
        isCompleted: false,
        check: (state) => {
          const burn = (state.character.annualSalary * 0.5) / 12;
          return state.emergencyFund >= burn * 3;
        },
      },
    ],
  },
  {
    chapter: 5,
    title: 'Human Capital & The Empire',
    subtitle: 'Maximize salary, launch a side hustle, cross $250k Net Worth',
    storyIntro: 'Your earning power combined with disciplined investing has ignited exponential compounding. Scale your salary and watch your wealth velocity accelerate.',
    rewardCash: 1500,
    rewardXP: 450,
    icon: '🚀',
    isCompleted: false,
    objectives: [
      {
        id: 'q5_salary_raise',
        description: 'Deliver projects to increase annual salary by at least $5,000',
        isCompleted: false,
        check: (state) => state.character.annualSalary >= 60000,
      },
      {
        id: 'q5_cross_250k',
        description: 'Reach a Total Net Worth of $250,000',
        isCompleted: false,
        check: (state) => getNetWorth(state) >= 250000,
      },
    ],
  },
  {
    chapter: 6,
    title: 'Ringing the Freedom Bell (FIRE)',
    subtitle: 'Achieve complete Financial Independence and retire early',
    storyIntro: 'The final summit. Your invested assets produce enough passive cash flow to pay for your life indefinitely. The 4% rule guarantees freedom. Walk to the Central Plaza fountain and ring the Golden Freedom Bell!',
    rewardCash: 5000,
    rewardXP: 1000,
    icon: '🔔',
    isCompleted: false,
    objectives: [
      {
        id: 'q6_fire_number',
        description: 'Reach your 25x Annual Expense FIRE Freedom Number',
        isCompleted: false,
        check: (state) => {
          const annualBurn = state.character.annualSalary * 0.5;
          const target = annualBurn * 25;
          return getNetWorth(state) >= target;
        },
      },
      {
        id: 'q6_ring_bell',
        description: 'Walk to the Golden Fountain in the Town Plaza and ring the Freedom Bell',
        isCompleted: false,
        check: (state, extra) => Boolean(extra?.rungFreedomBell),
      },
    ],
  },
];
