import { ExpansionPack } from '../../types/game';

export const greenExpansionPack: ExpansionPack = {
  id: 'pack_green_wealth',
  name: 'Green Wealth & ESG Future',
  version: '1.0.0',
  description: 'Invest in clean energy transition, solar tax credits, carbon credits, and sustainable wealth building!',
  author: 'FinTwist Core Team',
  icon: '🌱',
  themeColor: '#059669',
  isBuiltIn: true,
  assets: [
    {
      id: 'green_clean_tech_etf',
      name: 'iShares Global Clean Energy (ICLN)',
      symbol: 'ICLN',
      category: 'GREEN_ENERGY',
      description: 'Basket of global companies producing solar, wind, battery storage, and smart power grids.',
      educationalNote: 'Clean energy has strong secular tailwinds from governmental carbon reduction targets, but fluctuates with interest rates and materials costs.',
      initialPrice: 16.5,
      currentPrice: 16.5,
      historicalPrices: [14.8, 15.2, 16.0, 16.5],
      dividendYield: 0.018,
      volatility: 0.32,
      expectedAnnualReturn: 0.11,
      minPurchase: 20,
      expansionPackId: 'pack_green_wealth',
      icon: '☀️',
      riskRating: 3,
    },
    {
      id: 'green_carbon_credits',
      name: 'Kraneshares Global Carbon ETF (KRBN)',
      symbol: 'KRBN',
      category: 'COMMODITY',
      description: 'Tracks cap-and-trade carbon allowance futures in European and American compliance carbon markets.',
      educationalNote: 'Carbon pricing mechanisms make polluting expensive, incentivizing corporate decarbonization.',
      initialPrice: 38.0,
      currentPrice: 38.0,
      historicalPrices: [34.0, 36.5, 37.2, 38.0],
      dividendYield: 0,
      volatility: 0.40,
      expectedAnnualReturn: 0.12,
      minPurchase: 40,
      expansionPackId: 'pack_green_wealth',
      icon: '🍃',
      riskRating: 4,
    },
  ],
  events: [
    {
      id: 'green_event_solar_credit',
      title: 'Rooftop Solar & The 30% Clean Energy Tax Credit',
      category: 'OPPORTUNITY',
      icon: '⚡',
      story: 'A certified solar installer offers a system that slashes your monthly electric bill from $180 down to $15. Net cost after the 30% government tax credit is $8,500.',
      explanation: 'Evaluating home efficiency investments as annuities: Saving $165/month ($1,980/year) on an $8,500 investment equals a guaranteed 23.3% annual return on your money tax-free!',
      choices: [
        {
          text: 'Install the solar array for $8,500 net',
          description: 'Lock in guaranteed 23% annual return through energy savings.',
          cashChange: -8500,
          happinessChange: 7,
          educationalTakeaway: 'Reducing fixed recurring expenses (utility bills) produces guaranteed, inflation-proof, tax-free returns.',
        },
        {
          text: 'Stick with grid power and invest the money in stocks instead',
          description: 'Keep your cash liquid for the stock market.',
          educationalTakeaway: 'Opportunity cost matters: compare guaranteed utility savings against expected stock market returns.',
        },
      ],
      expansionPackId: 'pack_green_wealth',
    },
  ],
  achievements: [
    {
      id: 'ach_planet_saver',
      title: 'Green Capitalist',
      description: 'Invest in sustainable clean energy and carbon reduction assets.',
      icon: '🌍',
      rewardXP: 180,
      condition: (state) => {
        return state.portfolio.some(
          (p) => p.assetId === 'green_clean_tech_etf' || p.assetId === 'green_carbon_credits'
        );
      },
    },
  ],
};
