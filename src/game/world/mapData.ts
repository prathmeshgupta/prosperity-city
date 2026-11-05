/**
 * Prosperity City Map Architecture
 * Tile-based 2D grid world with distinct districts, roads, parks, and interactive buildings.
 */

export const TILE_SIZE = 40; // 40px per tile
export const MAP_WIDTH = 48; // 48 tiles wide = 1920px
export const MAP_HEIGHT = 38; // 38 tiles high = 1520px

export type TileType = 
  | 'GRASS'
  | 'ROAD'
  | 'ROAD_MARKING'
  | 'SIDEWALK'
  | 'PLAZA_BRICK'
  | 'WATER'
  | 'WATER_SHORE'
  | 'TREE'
  | 'FLOWER'
  | 'FOUNTAIN'
  | 'BENCH'
  | 'STREET_LAMP'
  | 'BUILDING_WALL'
  | 'BUILDING_ROOF'
  | 'BUILDING_DOOR'
  | 'BUILDING_WINDOW'
  | 'FENCE'
  | 'PARKING';

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
    | 'CAFE'
    | 'CLINIC'
    | 'CRYPTO_LOUNGE'
    | 'SHADY_ALLEY';
  description: string;
  expansionPackId?: string;
}

export const BUILDINGS: BuildingEntrance[] = [
  {
    id: 'bldg_bank',
    name: 'First Prosperity Bank & Vault',
    subtitle: 'Checking, High-Yield Savings & Debt Management',
    district: 'Financial District',
    icon: '🏦',
    color: '#10B981',
    tileX: 28,
    tileY: 9,
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
    tileX: 38,
    tileY: 9,
    type: 'STOCK_EXCHANGE',
    description: 'Step onto the bustling trading floor. Buy S&P 500 index funds, dividend equities, and government bonds.',
  },
  {
    id: 'bldg_career_tower',
    name: 'Apex Career Tower & Enterprise HQ',
    subtitle: 'Primary Income & Professional Upskilling',
    district: 'Business Zone',
    icon: '🏢',
    color: '#3B82F6',
    tileX: 18,
    tileY: 9,
    type: 'CAREER_TOWER',
    description: 'Clock in for your career, negotiate salary raises, and earn high-ROI professional certifications.',
  },
  {
    id: 'bldg_university',
    name: 'FinTwist University & Library',
    subtitle: 'Gamified Academy, Quizzes & Financial Laws',
    district: 'North Campus',
    icon: '🎓',
    color: '#8B5CF6',
    tileX: 8,
    tileY: 9,
    type: 'UNIVERSITY',
    description: 'Master the Rule of 72, the 4% FIRE Rule, and debt snowball strategies in interactive mini-lessons.',
  },
  {
    id: 'bldg_superstore',
    name: 'MegaMart Lifestyle Center',
    subtitle: 'Groceries, Discretionary Spending & Subscriptions',
    district: 'Commercial District',
    icon: '🛒',
    color: '#F59E0B',
    tileX: 8,
    tileY: 22,
    type: 'SUPERSTORE',
    description: 'Balance lifestyle desires: choose between frugal bulk meal prep and luxury spending. Audit subscription vampires.',
  },
  {
    id: 'bldg_auto_dealer',
    name: 'Prestige Motors & Commuter Lot',
    subtitle: 'Reliable Used Cars vs 7-Year Debt Traps',
    district: 'Commercial District',
    icon: '🚗',
    color: '#EF4444',
    tileX: 18,
    tileY: 22,
    type: 'AUTO_DEALER',
    description: 'Inspect reliable cash-bought commuters vs shiny $650/month leased sports sedans.',
  },
  {
    id: 'bldg_real_estate',
    name: 'Prosperity Realty & Property Hub',
    subtitle: 'Turnkey Rentals, Mortgages & REITs',
    district: 'Residential Quarter',
    icon: '🏘️',
    color: '#10B981',
    tileX: 28,
    tileY: 22,
    type: 'REAL_ESTATE',
    description: 'Acquire cashflow rental duplexes, learn 20% down payments, and collect monthly tenant checks.',
  },
  {
    id: 'bldg_home',
    name: 'Your Sweet Apartment / Home',
    subtitle: 'Personal Sanctuary & Monthly Ledger',
    district: 'Residential Quarter',
    icon: '🏡',
    color: '#EC4899',
    tileX: 38,
    tileY: 22,
    type: 'HOME',
    description: 'Rest, review your net worth ledger, advance to the next month, and reflect on your life happiness.',
  },
  {
    id: 'bldg_cafe',
    name: 'The Daily Grind Side-Hustle Cafe',
    subtitle: 'Freelancing, Gigs & Casual Networking',
    district: 'Town Plaza',
    icon: '☕',
    color: '#D97706',
    tileX: 20,
    tileY: 15,
    type: 'CAFE',
    description: 'Pick up weekend freelancing gigs, tutoring contracts, and chat with local entrepreneurs.',
  },
  {
    id: 'bldg_clinic',
    name: 'Guardian Health & Insurance Agency',
    subtitle: 'Risk Shield & Health Insurance Protection',
    district: 'Town Plaza',
    icon: '🏥',
    color: '#14B8A6',
    tileX: 26,
    tileY: 15,
    type: 'CLINIC',
    description: 'Protect your family against catastrophic medical bills and accidents with insurance coverage.',
  },
  {
    id: 'bldg_crypto_lounge',
    name: 'Web3 & Crypto Frontier Arcade',
    subtitle: 'Bitcoin, Ethereum, Staking & Cold Wallets',
    district: 'East Pier (Expansion)',
    icon: '🪙',
    color: '#F59E0B',
    tileX: 42,
    tileY: 15,
    type: 'CRYPTO_LOUNGE',
    description: 'Explore the high-volatility frontier of Bitcoin, Ethereum staking, halving cycles, and self-custody.',
    expansionPackId: 'pack_crypto_frontier',
  },
  {
    id: 'bldg_shady_alley',
    name: 'The Mysterious Shady Alley',
    subtitle: 'Scammy Sam & "Guaranteed 50% Returns"',
    district: 'South Alley',
    icon: '🕶️',
    color: '#64748B',
    tileX: 42,
    tileY: 28,
    type: 'SHADY_ALLEY',
    description: 'Encounter scammers pitching get-rich-quick Ponzi schemes and learn how to spot red flags.',
  },
];
