import { ExpansionPack } from '../../types/game';

export const realEstateExpansionPack: ExpansionPack = {
  id: 'pack_real_estate_tycoon',
  name: 'Real Estate Mogul',
  version: '1.1.0',
  description: 'Master physical rental properties, mortgages, leverage, tenant emergencies, REITs, and cash flow operations!',
  author: 'FinTwist Core Team',
  icon: '🏘️',
  themeColor: '#10B981',
  isBuiltIn: true,
  assets: [
    {
      id: 're_vanguard_reit',
      name: 'Vanguard Real Estate REIT (VNQ)',
      symbol: 'VNQ',
      category: 'REAL_ESTATE_REIT',
      description: 'Publicly traded index of 160+ commercial, residential, and industrial properties paying consistent quarterly dividends.',
      educationalNote: 'REITs pass through at least 90% of taxable income to shareholders as dividends. High yield, 100% liquid.',
      initialPrice: 88,
      currentPrice: 88,
      historicalPrices: [82, 85, 87, 88],
      dividendYield: 0.042, // 4.2% dividend
      volatility: 0.22,
      expectedAnnualReturn: 0.085,
      minPurchase: 50,
      expansionPackId: 'pack_real_estate_tycoon',
      icon: '🏢',
      riskRating: 2,
    },
    {
      id: 're_suburban_duplex',
      name: 'Suburban Turnkey Duplex',
      symbol: 'DPLX',
      category: 'PHYSICAL_PROPERTY',
      description: 'Two-unit residential income property generating $2,400/month gross rental cash flow against mortgage and maintenance.',
      educationalNote: 'Physical real estate provides tax depreciation, mortgage paydown, and leverage, but demands active property management and liquidity buffers.',
      initialPrice: 320000,
      currentPrice: 320000,
      historicalPrices: [300000, 310000, 315000, 320000],
      dividendYield: 0.065, // net rental cap rate
      volatility: 0.12,
      expectedAnnualReturn: 0.09,
      minPurchase: 64000, // 20% down payment
      expansionPackId: 'pack_real_estate_tycoon',
      icon: '🏡',
      riskRating: 3,
    },
  ],
  events: [
    {
      id: 're_event_tenant_boiler',
      title: 'Midnight Boiler Catastrophe!',
      category: 'EMERGENCY',
      icon: '🔧',
      story: 'It is -5°F outside and your rental property tenant calls panicking: the 20-year-old heating boiler just burst, leaking rusty water across the basement!',
      explanation: 'Landlords must account for CapEx (Capital Expenditures) reserves. Seasoned real estate investors set aside 8-10% of gross rents specifically for appliance replacements and roof repairs.',
      choices: [
        {
          text: 'Pay $3,200 for a high-efficiency replacement boiler immediately',
          description: 'Keep your tenants warm, loyal, and preserve property value.',
          cashChange: -3200,
          happinessChange: 4,
          educationalTakeaway: 'Immediate CapEx maintenance preserves tenant retention and protects property value from water rot.',
        },
        {
          text: 'Apply a cheap $400 patch and pray it holds until summer',
          description: 'A risky band-aid solution that could blow up worse later.',
          cashChange: -400,
          happinessChange: -6,
          educationalTakeaway: 'Deferred maintenance on real estate almost always compounds into catastrophic multi-thousand dollar failures.',
        },
      ],
      expansionPackId: 'pack_real_estate_tycoon',
    },
    {
      id: 're_event_refinance',
      title: 'Mortgage Rate Drop: Refinance Window!',
      category: 'OPPORTUNITY',
      icon: '📉',
      story: 'The central bank cut rates, and mortgage lenders are offering refinancing at 1.5% below your existing rate. Refinancing costs $2,500 in closing fees but saves $280 every single month.',
      explanation: 'The "Break-Even Calculation": Closing cost ($2,500) divided by monthly savings ($280) = 8.9 months to break even. If you plan to hold the property longer than 9 months, refinancing is pure profit!',
      choices: [
        {
          text: 'Refinance! Pay $2,500 upfront closing fees to save $280/mo',
          description: 'Break even in 9 months, then pocket $3,360/year every year after.',
          cashChange: -2500,
          happinessChange: 6,
          educationalTakeaway: 'Always calculate the break-even period on mortgage refinancing: (Closing Costs ÷ Monthly Savings) = Months to Profit.',
        },
        {
          text: 'Pass on it to conserve short-term cash',
          description: 'Keep current mortgage terms unchanged.',
          educationalTakeaway: 'Passing on rate drops leaves tens of thousands of dollars in lifetime interest on the table.',
        },
      ],
      expansionPackId: 'pack_real_estate_tycoon',
    },
  ],
  achievements: [
    {
      id: 'ach_cashflow_king',
      title: 'Cashflow Landlord',
      description: 'Acquire real estate assets and generate regular rental/dividend income.',
      icon: '🏰',
      rewardXP: 200,
      condition: (state) => {
        return state.portfolio.some(
          (p) => (p.assetId === 're_vanguard_reit' && p.shares >= 25) || p.assetId === 're_suburban_duplex'
        );
      },
    },
  ],
};
