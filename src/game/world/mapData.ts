/**
 * Prosperity City Metropolis Architecture
 * Expansive 64x50 tile open-world map with 8 distinct districts:
 * 1. Central Town Square & Civic Park
 * 2. Wall Street Financial Center
 * 3. Commercial Boulevard & Entertainment
 * 4. University Campus & Innovation Park
 * 5. Residential Row & Suburbs (with buyable houses)
 * 6. The Neon Docks & Web3 Pier
 * 7. Eco & Clean Energy Outskirts
 * 8. Shady Back-Alley
 */

export const TILE_SIZE = 40; // 40px per tile
export const MAP_WIDTH = 64; // 64 tiles = 2,560px
export const MAP_HEIGHT = 50; // 50 tiles = 2,000px

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
    | 'TOWN_HALL';
  description: string;
  isOwnedByPlayer?: boolean;
  price?: number;
}

export const BUILDINGS: BuildingEntrance[] = [
  // Financial District (Top Center-Right)
  {
    id: 'bldg_bank',
    name: 'First Prosperity Bank & Vault',
    subtitle: 'Checking, High-Yield Savings & Debt Management',
    district: 'Financial District',
    icon: '🏦',
    color: '#10B981',
    tileX: 36,
    tileY: 10,
    type: 'BANK',
    description: 'Deposit funds into your 4.5% APY High-Yield Savings vault, manage loans, and eliminate toxic credit card interest.',
  },
  {
    id: 'bldg_stock_exchange',
    name: 'Wall Street Exchange & Trading Floor',
    subtitle: 'Index Funds, Blue Chips, Tech & Bonds',
    district: 'Financial District',
    icon: '🏛️',
    color: '#06B6D4',
    tileX: 46,
    tileY: 10,
    type: 'STOCK_EXCHANGE',
    description: 'Step onto the bustling trading floor with live digital tickers. Buy S&P 500 index funds, dividend equities, and government bonds.',
  },
  
  // University & Career Zone (Top Left)
  {
    id: 'bldg_university',
    name: 'FinTwist University & Library',
    subtitle: 'Gamified Academy, Quizzes & Compounding Laws',
    district: 'University Campus',
    icon: '🎓',
    color: '#8B5CF6',
    tileX: 10,
    tileY: 10,
    type: 'UNIVERSITY',
    description: 'Master the Rule of 72, the 4% FIRE Rule, and debt snowball strategies in interactive mini-lessons.',
  },
  {
    id: 'bldg_career_tower',
    name: 'Apex Career Tower & Enterprise HQ',
    subtitle: 'Primary Income & Professional Upskilling',
    district: 'Business Zone',
    icon: '🏢',
    color: '#3B82F6',
    tileX: 22,
    tileY: 10,
    type: 'CAREER_TOWER',
    description: 'Clock in for your career, negotiate salary raises, and earn high-ROI professional certifications.',
  },

  // Central Town Plaza (Center)
  {
    id: 'bldg_town_hall',
    name: 'Prosperity Town Hall & Records',
    subtitle: 'Mayor Office, City Deeds & Civic Registry',
    district: 'Central Plaza',
    icon: '🏛️',
    color: '#F59E0B',
    tileX: 30,
    tileY: 19,
    type: 'TOWN_HALL',
    description: 'The civic heart of Prosperity City. Check municipal tax rates, inspect property deeds, and view city records.',
  },
  {
    id: 'bldg_cafe',
    name: 'The Daily Grind Side-Hustle Cafe',
    subtitle: 'Freelancing, Gigs & Casual Networking',
    district: 'Central Plaza',
    icon: '☕',
    color: '#D97706',
    tileX: 22,
    tileY: 26,
    type: 'CAFE',
    description: 'Pick up weekend freelancing gigs, tutoring contracts, and chat with local entrepreneurs over coffee.',
  },
  {
    id: 'bldg_clinic',
    name: 'Guardian Health & Insurance Agency',
    subtitle: 'Risk Shield & Health Insurance Protection',
    district: 'Central Plaza',
    icon: '🏥',
    color: '#14B8A6',
    tileX: 38,
    tileY: 26,
    type: 'CLINIC',
    description: 'Protect your family against catastrophic medical bills and accidents with health, renters, and life insurance coverage.',
  },

  // Commercial District (Mid Left)
  {
    id: 'bldg_superstore',
    name: 'MegaMart Lifestyle Center',
    subtitle: 'Groceries, Discretionary Spending & Subscriptions',
    district: 'Commercial Boulevard',
    icon: '🛒',
    color: '#F59E0B',
    tileX: 10,
    tileY: 26,
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
    tileX: 10,
    tileY: 38,
    type: 'AUTO_DEALER',
    description: 'Inspect reliable cash-bought commuters vs shiny $620/month leased sports sedans.',
  },

  // Residential District & Real Estate Row (Bottom Center)
  {
    id: 'bldg_home',
    name: 'Your Starter Studio Apartment',
    subtitle: 'Rented Sanctuary & Monthly Ledger',
    district: 'Residential Quarter',
    icon: '🏡',
    color: '#EC4899',
    tileX: 24,
    tileY: 38,
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
    tileX: 36,
    tileY: 38,
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
    tileX: 46,
    tileY: 38,
    type: 'REAL_ESTATE',
    description: 'Browse local property listings, apply for fixed 30-year mortgages, and inspect real estate cap rates.',
  },

  // Web3 Pier (Far Right Ocean Waterfront)
  {
    id: 'bldg_crypto_lounge',
    name: 'Web3 & Crypto Pier Arcade',
    subtitle: 'Bitcoin, Ethereum, Staking & Cold Wallets',
    district: 'Ocean Pier',
    icon: '🪙',
    color: '#F59E0B',
    tileX: 56,
    tileY: 22,
    type: 'CRYPTO_LOUNGE',
    description: 'Explore the high-volatility frontier of Bitcoin, Ethereum staking, halving cycles, and self-custody hardware wallets.',
  },

  // Shady Back-Alley (Far Bottom Right)
  {
    id: 'bldg_shady_alley',
    name: 'The Mysterious Shady Alleyway',
    subtitle: 'Scammy Sam & "Guaranteed 50% Returns"',
    district: 'South Alley',
    icon: '🕶️',
    color: '#64748B',
    tileX: 56,
    tileY: 42,
    type: 'SHADY_ALLEY',
    description: 'Encounter street scammers pitching get-rich-quick Ponzi schemes and learn how to spot red flags.',
  },
];
