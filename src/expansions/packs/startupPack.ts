import { ExpansionPack } from '../../types/game';

export const startupExpansionPack: ExpansionPack = {
  id: 'pack_startup_venture',
  name: 'Silicon Valley & Venture Capital',
  version: '1.0.0',
  description: 'Step into the shoes of tech founders, angel investors, seed syndicates, vesting schedules, and unicorn exits!',
  author: 'FinTwist Core Team',
  icon: '🦄',
  themeColor: '#8B5CF6',
  isBuiltIn: true,
  assets: [
    {
      id: 'startup_angel_syndicate',
      name: 'Seed Stage AI Syndicate',
      symbol: 'ANGEL',
      category: 'STARTUP_EQUITY',
      description: 'Diversified syndicate pool funding 15 pre-seed AI and robotics startups. Illiquid for 7-10 years.',
      educationalNote: 'Early stage angel investing has a power-law return curve: 80% fail, 15% return 1-2x, and 5% generate 50x+ outliers.',
      initialPrice: 5000,
      currentPrice: 5000,
      historicalPrices: [5000, 5000, 5200, 5000],
      dividendYield: 0,
      volatility: 0.95,
      expectedAnnualReturn: 0.22,
      minPurchase: 2500,
      expansionPackId: 'pack_startup_venture',
      icon: '💡',
      riskRating: 5,
    },
  ],
  events: [
    {
      id: 'startup_event_seed_pitch',
      title: 'College Roommate Pitching Seed Round',
      category: 'OPPORTUNITY',
      icon: '☕',
      story: 'Your brilliant college roommate who worked at DeepMind wants to raise a $500,000 friends & family round for an autonomous workflow engine. They offer you 1% equity for a $5,000 check.',
      explanation: 'Early venture checks are extremely illiquid and risky. The Rule of Accredited Investing: Never invest money into private startups that you would need within 10 years.',
      choices: [
        {
          text: 'Write the $5,000 angel check and join the cap table',
          description: 'High risk, asymmetric lottery-ticket upside with a trusted operator.',
          cashChange: -5000,
          assetBonus: { assetId: 'startup_angel_syndicate', shares: 1 },
          happinessChange: 6,
          educationalTakeaway: 'Venture bets require portfolio power law: winners must be big enough to pay for all the losers.',
        },
        {
          text: 'Politely decline and offer mentoring/advice instead',
          description: 'Protect your liquid cash reserves.',
          happinessChange: 2,
          educationalTakeaway: 'Preserving capital until you have substantial liquid net worth prevents untimely cash crunches.',
        },
      ],
      expansionPackId: 'pack_startup_venture',
    },
  ],
  achievements: [
    {
      id: 'ach_angel_investor',
      title: 'Venture Capitalist',
      description: 'Back an early-stage startup syndicate or build an equity stake.',
      icon: '🦄',
      rewardXP: 300,
      condition: (state) => {
        return state.portfolio.some((p) => p.assetId === 'startup_angel_syndicate' && p.shares >= 1);
      },
    },
  ],
};
