import { Achievement } from '../types/game';

export const BASE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_investment',
    title: 'First Step on Wall Street',
    description: 'Purchase your very first share of an index fund or stock.',
    icon: '🌱',
    rewardXP: 50,
    condition: (state) => state.portfolio.some((p) => p.shares > 0),
  },
  {
    id: 'ach_emergency_buffer_3m',
    title: 'Bulletproof Cushion',
    description: 'Build an Emergency Fund covering at least 3 months of basic living expenses.',
    icon: '🛡️',
    rewardXP: 100,
    condition: (state) => {
      const monthlyBurn = (state.character.annualSalary * 0.5) / 12;
      return state.emergencyFund >= monthlyBurn * 3;
    },
  },
  {
    id: 'ach_debt_free_consumer',
    title: 'Toxic Debt Slayer',
    description: 'Completely eliminate all high-interest credit card debt balances.',
    icon: '⚔️',
    rewardXP: 150,
    condition: (state) => {
      const ccDebts = state.debts.filter((d) => d.category === 'CREDIT_CARD');
      return ccDebts.length === 0 || ccDebts.every((d) => d.principal <= 0);
    },
  },
  {
    id: 'ach_net_worth_10k',
    title: 'The First Milestone',
    description: 'Reach a total net worth of $10,000.',
    icon: '🥉',
    rewardXP: 80,
    condition: (state) => {
      const net = calculateNetWorth(state);
      return net >= 10000;
    },
  },
  {
    id: 'ach_net_worth_100k',
    title: 'The Hardest First $100k',
    description: 'Charlie Munger: "The first $100k is a pain, but you gotta do it." Cross $100,000 Net Worth!',
    icon: '🥈',
    rewardXP: 250,
    condition: (state) => {
      const net = calculateNetWorth(state);
      return net >= 100000;
    },
  },
  {
    id: 'ach_net_worth_half_million',
    title: 'Halfway to Millionaire',
    description: 'Cross $500,000 Net Worth!',
    icon: '🥇',
    rewardXP: 500,
    condition: (state) => {
      const net = calculateNetWorth(state);
      return net >= 500000;
    },
  },
  {
    id: 'ach_millionaire',
    title: 'The Millionaire Club',
    description: 'Surpass $1,000,000 in liquid and invested net worth!',
    icon: '👑',
    rewardXP: 1000,
    condition: (state) => {
      const net = calculateNetWorth(state);
      return net >= 1000000;
    },
  },
  {
    id: 'ach_diversified_pro',
    title: 'All-Weather Asset Master',
    description: 'Own positions across at least 4 distinct asset categories simultaneously.',
    icon: '🌐',
    rewardXP: 120,
    condition: (state) => {
      const categories = new Set(
        state.portfolio
          .filter((p) => p.shares > 0)
          .map((p) => {
            const def = state.assets.find((a) => a.id === p.assetId);
            return def?.category;
          })
          .filter(Boolean)
      );
      return categories.size >= 4;
    },
  },
  {
    id: 'ach_match_master',
    title: 'Free Money Collector',
    description: 'Contribute enough to capture 100% of your employer 401(k) match.',
    icon: '🎁',
    rewardXP: 100,
    condition: (state) => {
      return state.retirement.employee401kContributionPct >= state.retirement.employerMatchLimitPct;
    },
  },
  {
    id: 'ach_happiness_zen',
    title: 'Rich in Life',
    description: 'Maintain Happiness above 90 while maintaining positive cashflow.',
    icon: '🧘',
    rewardXP: 150,
    condition: (state) => state.character.happiness >= 90 && state.cash > 2000,
  },
];

function calculateNetWorth(state: {
  cash: number;
  emergencyFund: number;
  retirement: { traditional401k: number; rothIRA: number };
  portfolio: { assetId: string; shares: number }[];
  assets: { id: string; currentPrice: number }[];
  debts: { principal: number }[];
}): number {
  let total = state.cash + state.emergencyFund + state.retirement.traditional401k + state.retirement.rothIRA;
  for (const pos of state.portfolio) {
    const asset = state.assets.find((a) => a.id === pos.assetId);
    if (asset) {
      total += pos.shares * asset.currentPrice;
    }
  }
  for (const debt of state.debts) {
    total -= debt.principal;
  }
  return total;
}
