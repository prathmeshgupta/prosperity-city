/**
 * Prosperity City Metropolis Architecture
 * Expansive 96x72 tile open-world metropolis (3,840px x 2,880px)
 * Across 10 distinct, vibrant districts:
 * 1. University Heights & Academic Quad (Top-Left)
 * 2. Silicon Forge AI & Innovation Quarter (Top Center-Left)
 * 3. Wall Street Financial & Banking Canyon (Top Center-Right)
 * 4. Central Civic Plaza & Marble Fountain (Center)
 * 5. Commercial Boulevard & Auto Mile (Mid-Left)
 * 6. Healthcare, Longevity & Wellness District (Mid-Right)
 * 7. Arts, Freelance & Side-Hustle Strip (Lower Center-Left)
 * 8. Residential Suburbs & Real Estate Row (Lower Center-Right)
 * 9. Oceanfront Marina & Web3 Pier (Far Right Waterfront)
 * 10. Clean Energy Wind Farm & Shady Outskirts (Fringe)
 */

export const TILE_SIZE = 40; // 40px per tile
export const MAP_WIDTH = 96; // 96 tiles = 3,840px
export const MAP_HEIGHT = 72; // 72 tiles = 2,880px

export interface BuildingEntrance {
  id: string;
  name: string;
  subtitle: string;
  district: string;
  icon: string;
  color: string;
  tileX: number;
  tileY: number;
  type: 
    | 'BANK'
    | 'STOCK_EXCHANGE'
    | 'CAREER_TOWER'
    | 'UNIVERSITY'
    | 'SUPERSTORE'
    | 'AUTO_DEALER'
    | 'REAL_ESTATE'
    | 'HOME'
    | 'RENTAL_PROPERTY'
    | 'CAFE'
    | 'CLINIC'
    | 'CRYPTO_LOUNGE'
    | 'SHADY_ALLEY'
    | 'TOWN_HALL'
    | 'WEALTH_ADVISORY'
    | 'BOND_PIT'
    | 'TAX_OFFICE'
    | 'TECH_INCUBATOR';
  description: string;
  isOwnedByPlayer?: boolean;
  price?: number;
}

export const BUILDINGS: BuildingEntrance[] = [
  // ----------------------------------------------------
  // DISTRICT 1: UNIVERSITY HEIGHTS & ACADEMIC QUAD (Top Left)
  // ----------------------------------------------------
  {
    id: 'bldg_university',
    name: 'FinTwist University & Library',
    subtitle: 'Gamified Academy, Quizzes & Compounding Laws',
    district: 'University Heights',
    icon: '🎓',
    color: '#8B5CF6',
    tileX: 12,
    tileY: 10,
    type: 'UNIVERSITY',
    description: 'Master the Rule of 72, the 4% FIRE Rule, and debt snowball strategies in interactive mini-lessons.',
  },

  // ----------------------------------------------------
  // DISTRICT 2: SILICON FORGE & TECH QUARTER (Top Center-Left)
  // ----------------------------------------------------
  {
    id: 'bldg_tech_incubator',
    name: 'Silicon Forge AI Incubator',
    subtitle: 'Venture Capital, Seed Rounds & Startup Equity',
    district: 'Silicon Forge',
    icon: '🚀',
    color: '#818CF8',
    tileX: 34,
    tileY: 10,
    type: 'TECH_INCUBATOR',
    description: '15% discount ESPP exercises, RSU vesting tax schedules, and angel venture syndicate investing.',
  },

  // ----------------------------------------------------
  // DISTRICT 3: WALL STREET FINANCIAL CANYON (Top Center-Right)
  // ----------------------------------------------------
  {
    id: 'bldg_bank',
    name: 'First Prosperity Bank & Vault',
    subtitle: 'Checking, High-Yield Savings & Debt Management',
    district: 'Financial District',
    icon: '🏦',
    color: '#10B981',
    tileX: 52,
    tileY: 10,
    type: 'BANK',
    description: 'Deposit funds into your 4.5% APY High-Yield Savings vault, manage loans, and eliminate toxic credit card interest.',
  },
  {
    id: 'bldg_stock_exchange',
    name: 'Wall Street Exchange & Trading Floor',
    subtitle: 'Index Funds, Blue Chips, Tech & Derivatives',
    district: 'Financial District',
    icon: '🏛️',
    color: '#06B6D4',
    tileX: 62,
    tileY: 10,
    type: 'STOCK_EXCHANGE',
    description: 'Step onto the bustling trading floor with live digital tickers. Buy S&P 500 index funds, small-cap value tilts, and commodities.',
  },
  {
    id: 'bldg_bond_pit',
    name: 'Federal Treasury & Municipal Bond Desk',
    subtitle: 'Yield Curves, Duration Simulator & Tax-Exempt Munis',
    district: 'Financial District',
    icon: '📜',
    color: '#34D399',
    tileX: 70,
    tileY: 10,
    type: 'BOND_PIT',
    description: 'Inspect live US Treasury yield curves, test interest rate duration shifts, and purchase tax-exempt municipal bonds.',
  },
  {
    id: 'bldg_wealth_advisory',
    name: 'Pinnacle Wealth Management & Family Office',
    subtitle: 'Revocable Living Trusts, 3-Bucket Decumulation & Estate',
    district: 'Financial District',
    icon: '🏛️',
    color: '#38BDF8',
    tileX: 76,
    tileY: 10,
    type: 'WEALTH_ADVISORY',
    description: 'Draft revocable living trusts to bypass probate court, model sequence-of-returns risk, and optimize Social Security to age 70.',
  },

  // ----------------------------------------------------
  // DISTRICT 4: CIVIC PLAZA & TOWN SQUARE (Center)
  // ----------------------------------------------------
  {
    id: 'bldg_town_hall',
    name: 'Prosperity Town Hall & Records',
    subtitle: 'Mayor Office, City Deeds & Civic Registry',
    district: 'Civic Plaza',
    icon: '🏛️',
    color: '#F59E0B',
    tileX: 46,
    tileY: 24,
    type: 'TOWN_HALL',
    description: 'The civic heart of Prosperity City. Check municipal tax rates, inspect property deeds, and ring the Golden Freedom Bell!',
  },
  {
    id: 'bldg_tax_office',
    name: 'City Tax & Accounting Bureau',
    subtitle: 'Progressive Brackets, Deductions & Tax-Loss Harvesting',
    district: 'Civic Plaza',
    icon: '📑',
    color: '#F43F5E',
    tileX: 38,
    tileY: 24,
    type: 'TAX_OFFICE',
    description: 'Audit your annual returns, harvest investment tax losses, and compare state income tax arbitrage (0% Sunbelt Haven vs 10.5% Metropolis).',
  },

  // ----------------------------------------------------
  // DISTRICT 5: COMMERCIAL BOULEVARD & AUTO ROW (Mid-Left)
  // ----------------------------------------------------
  {
    id: 'bldg_superstore',
    name: 'MegaMart Lifestyle Center',
    subtitle: 'Groceries, Discretionary Spending & Subscriptions',
    district: 'Commercial Boulevard',
    icon: '🛒',
    color: '#F59E0B',
    tileX: 12,
    tileY: 34,
    type: 'SUPERSTORE',
    description: 'Balance lifestyle desires: compare unit pricing ($/oz), spot hidden subscription traps, and buy groceries.',
  },
  {
    id: 'bldg_auto_dealer',
    name: 'Prestige Motors & Commuter Lot',
    subtitle: 'Reliable Used Cars vs 7-Year Debt Traps',
    district: 'Commercial Boulevard',
    icon: '🚗',
    color: '#EF4444',
    tileX: 20,
    tileY: 34,
    type: 'AUTO_DEALER',
    description: 'Inspect reliable cash-bought commuters vs shiny $620/month leased sports sedans.',
  },
  {
    id: 'bldg_farmers_market',
    name: 'FreshLife Organic Co-op Market',
    subtitle: 'Whole Foods, Clean Nutrition & Smart Unit Pricing',
    district: 'Commercial Boulevard',
    icon: '🥑',
    color: '#4ADE80',
    tileX: 28,
    tileY: 34,
    type: 'SUPERSTORE',
    description: 'Buy bulk organic staples, compare per-ounce unit prices, and keep your body energized for career execution.',
  },

  // ----------------------------------------------------
  // DISTRICT 6: HEALTHCARE & LONGEVITY DISTRICT (Mid-Right)
  // ----------------------------------------------------
  {
    id: 'bldg_clinic',
    name: 'Guardian Health & Insurance Exchange',
    subtitle: 'Own-Occupation Disability, Umbrella & Health Shield',
    district: 'Healthcare Promenade',
    icon: '🏥',
    color: '#14B8A6',
    tileX: 62,
    tileY: 34,
    type: 'CLINIC',
    description: 'Protect human capital with own-occupation disability insurance and shield your net worth with a $2,000,000 personal umbrella policy.',
  },
  {
    id: 'bldg_fitness_center',
    name: 'Pulse Fitness & Wellness Gym',
    subtitle: 'Vitality, Preventative Health & Longevity Habits',
    district: 'Healthcare Promenade',
    icon: '💪',
    color: '#F97316',
    tileX: 72,
    tileY: 34,
    type: 'CLINIC',
    description: 'Invest in physical fitness and sleep hygiene: +25% Health bonus and lower lifetime healthcare costs.',
  },

  // ----------------------------------------------------
  // DISTRICT 7: ARTS, FREELANCE & SIDE-HUSTLE STRIP (Lower Center-Left)
  // ----------------------------------------------------
  {
    id: 'bldg_career_tower',
    name: 'Apex Career Tower & Enterprise HQ',
    subtitle: 'Primary Income, Promotions & Certifications',
    district: 'Innovation Center',
    icon: '🏢',
    color: '#3B82F6',
    tileX: 36,
    tileY: 48,
    type: 'CAREER_TOWER',
    description: 'Clock in for your career, negotiate salary raises, and earn high-ROI professional certifications.',
  },
  {
    id: 'bldg_cafe',
    name: 'The Daily Grind Side-Hustle Cafe',
    subtitle: 'Freelancing, Gigs & Casual Networking',
    district: 'Innovation Center',
    icon: '☕',
    color: '#D97706',
    tileX: 26,
    tileY: 48,
    type: 'CAFE',
    description: 'Pick up weekend freelancing gigs, tutoring contracts, and chat with local entrepreneurs over coffee.',
  },

  // ----------------------------------------------------
  // DISTRICT 8: RESIDENTIAL SUBURBS & REAL ESTATE ROW (Lower Center-Right)
  // ----------------------------------------------------
  {
    id: 'bldg_home',
    name: 'Your Starter Studio Apartment',
    subtitle: 'Rented Sanctuary & Monthly Ledger',
    district: 'Residential Quarter',
    icon: '🏡',
    color: '#EC4899',
    tileX: 52,
    tileY: 48,
    type: 'HOME',
    description: 'Rest to restore energy and happiness, review your monthly budget ledger, and plan your next moves.',
    isOwnedByPlayer: true,
  },
  {
    id: 'bldg_duplex_property',
    name: 'Suburban Turnkey Duplex (For Sale)',
    subtitle: '2-Unit Income Property • $2,400/mo Rents',
    district: 'Residential Quarter',
    icon: '🏘️',
    color: '#10B981',
    tileX: 62,
    tileY: 48,
    type: 'RENTAL_PROPERTY',
    description: 'A 2-unit turnkey rental property. Put 20% down ($64,000) to collect monthly tenant checks and tax depreciation!',
    isOwnedByPlayer: false,
    price: 320000,
  },
  {
    id: 'bldg_real_estate',
    name: 'Prosperity Realty & Escrow Office',
    subtitle: 'Deeds, Mortgages, Inspections & Titles',
    district: 'Residential Quarter',
    icon: '📜',
    color: '#6366F1',
    tileX: 72,
    tileY: 48,
    type: 'REAL_ESTATE',
    description: 'Browse local property listings, apply for fixed 30-year mortgages, and inspect real estate cap rates.',
  },
  {
    id: 'bldg_luxury_penthouse',
    name: 'The Summit FIRE Sky Penthouse',
    subtitle: 'Trophy Residence • $1,200,000 Luxury Estate',
    district: 'Billionaires Row',
    icon: '👑',
    color: '#FBBF24',
    tileX: 76,
    tileY: 60,
    type: 'RENTAL_PROPERTY',
    description: 'The ultimate endgame residential real estate acquisition. Requires $1.2M capital for complete financial royalty status.',
    price: 1200000,
  },

  // ----------------------------------------------------
  // DISTRICT 9: OCEANFRONT MARINA & WEB3 BOARDWALK (Far Right Waterfront)
  // ----------------------------------------------------
  {
    id: 'bldg_crypto_lounge',
    name: 'Web3 & Crypto Pier Arcade',
    subtitle: 'Bitcoin, Ethereum, Staking & Cold Wallets',
    district: 'Ocean Pier Boardwalk',
    icon: '🪙',
    color: '#F59E0B',
    tileX: 86,
    tileY: 26,
    type: 'CRYPTO_LOUNGE',
    description: 'Explore the high-volatility frontier of Bitcoin, Ethereum staking, halving cycles, and self-custody hardware wallets.',
  },

  // ----------------------------------------------------
  // DISTRICT 10: SHADY OUTSKIRTS (Fringe South)
  // ----------------------------------------------------
  {
    id: 'bldg_shady_alley',
    name: 'The Mysterious Shady Alleyway',
    subtitle: 'Scammy Sam & "Guaranteed 50% Returns"',
    district: 'South Back-Alley',
    icon: '🕶️',
    color: '#64748B',
    tileX: 62,
    tileY: 62,
    type: 'SHADY_ALLEY',
    description: 'Encounter street scammers pitching get-rich-quick Ponzi schemes and learn how to spot red flags.',
  },
];
