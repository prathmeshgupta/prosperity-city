/**
 * Street Props & Interactive Urban Infrastructure
 * Mini-interactivity scattered across Prosperity City streets:
 * - ATMs (deposit/withdraw HYSA on the sidewalk)
 * - Financial News Kiosks (read daily Prosperity Times headlines for XP & market clues)
 * - Artisan Coffee Carts (restore energy, happiness, and cure burnout)
 * - Park Benches & Meditative Chess Tables (rest & recover health)
 * - Real Estate Yard Signs (inspect cap rates and buy properties from the curb)
 */

export interface StreetProp {
  id: string;
  type: 'ATM' | 'NEWS_KIOSK' | 'COFFEE_CART' | 'BENCH' | 'FOR_SALE_SIGN';
  tileX: number;
  tileY: number;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  interactionPrompt: string;
}

export const STREET_PROPS: StreetProp[] = [
  // ATMs on busy sidewalk intersections
  {
    id: 'prop_atm_wallst',
    type: 'ATM',
    tileX: 62,
    tileY: 16,
    name: 'Wall Street Express ATM',
    subtitle: 'First Prosperity Bank 24/7 Vault Terminal',
    icon: '🏧',
    color: '#10b981',
    interactionPrompt: 'Press [E] to deposit cash into your 4.5% High-Yield Vault',
  },
  {
    id: 'prop_atm_plaza',
    type: 'ATM',
    tileX: 44,
    tileY: 30,
    name: 'Civic Plaza 24/7 ATM',
    subtitle: 'Zero-Fee Cash Deposit & Balance Check',
    icon: '🏧',
    color: '#10b981',
    interactionPrompt: 'Press [E] to transfer funds between Checking and HYSA',
  },
  {
    id: 'prop_atm_commercial',
    type: 'ATM',
    tileX: 16,
    tileY: 30,
    name: 'MegaMart Outdoor ATM',
    subtitle: 'Cash Withdrawal & Card Balance',
    icon: '🏧',
    color: '#10b981',
    interactionPrompt: 'Press [E] to access your High-Yield Vault',
  },

  // Financial News Kiosks
  {
    id: 'prop_news_financial',
    type: 'NEWS_KIOSK',
    tileX: 58,
    tileY: 16,
    name: 'Wall Street Daily Journal Kiosk',
    subtitle: 'Latest Market Intelligence & Macro Yield Curves',
    icon: '📰',
    color: '#38bdf8',
    interactionPrompt: 'Press [E] to read daily economic headline (+15 XP)',
  },
  {
    id: 'prop_news_civic',
    type: 'NEWS_KIOSK',
    tileX: 48,
    tileY: 30,
    name: 'The Prosperity Times Newsstand',
    subtitle: 'Civic Tax News, Fed Policy & Local Business',
    icon: '📰',
    color: '#38bdf8',
    interactionPrompt: 'Press [E] to read daily headline (+15 XP)',
  },

  // Coffee & Smoothie Carts
  {
    id: 'prop_coffee_tech',
    type: 'COFFEE_CART',
    tileX: 32,
    tileY: 16,
    name: 'Silicon Brew Artisan Espresso Cart',
    subtitle: 'Fair-Trade Nitro Cold Brew & Matcha',
    icon: '☕',
    color: '#d97706',
    interactionPrompt: 'Press [E] to buy $6 Nitro Cold Brew (Full Energy +10 Happiness)',
  },
  {
    id: 'prop_coffee_promenade',
    type: 'COFFEE_CART',
    tileX: 40,
    tileY: 44,
    name: 'Promenade Smoothie & Crepe Truck',
    subtitle: 'Organic Superfood Bowls & Green Tea',
    icon: '🥑',
    color: '#10b981',
    interactionPrompt: 'Press [E] to buy $8 Organic Smoothie (+15 Health, -20 Burnout)',
  },

  // Park Benches & Meditative Rest
  {
    id: 'prop_bench_fountain_1',
    type: 'BENCH',
    tileX: 44,
    tileY: 38,
    name: 'Plaza Fountain Marble Bench',
    subtitle: 'Soothing Water Sounds & Shaded Trees',
    icon: '🪑',
    color: '#64748b',
    interactionPrompt: 'Press [E] to sit and rest (Reset Burnout to 0%, +10 Health)',
  },
  {
    id: 'prop_bench_fountain_2',
    type: 'BENCH',
    tileX: 48,
    tileY: 38,
    name: 'University Quad Oak Bench',
    subtitle: 'Peaceful Reading Spot under Ancient Oaks',
    icon: '🪑',
    color: '#64748b',
    interactionPrompt: 'Press [E] to sit and rest (Reset Burnout to 0%, +10 Health)',
  },

  // Real Estate For Sale Yard Signs
  {
    id: 'prop_sign_duplex',
    type: 'FOR_SALE_SIGN',
    tileX: 62,
    tileY: 48,
    name: 'Turnkey 2-Unit Duplex Yard Sign',
    subtitle: '$320,000 Listing • $2,400/mo Rental Income',
    icon: '🪧',
    color: '#10b981',
    interactionPrompt: 'Press [E] to inspect rental property cap rate and buy',
  },
  {
    id: 'prop_sign_penthouse',
    type: 'FOR_SALE_SIGN',
    tileX: 74,
    tileY: 48,
    name: 'The Summit Sky Penthouse Yard Sign',
    subtitle: '$1,200,000 Trophy Asset • Complete FIRE Status',
    icon: '🪧',
    color: '#f59e0b',
    interactionPrompt: 'Press [E] to inspect trophy penthouse requirements',
  },
];
