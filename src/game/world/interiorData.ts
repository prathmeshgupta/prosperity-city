import { BuildingEntrance } from './mapData';

export interface InteriorStation {
  id: string;
  name: string;
  icon: string;
  tileX: number; // in room coordinates (0 to 16)
  tileY: number; // in room coordinates (0 to 12)
  widthTiles: number;
  heightTiles: number;
  color: string;
  actionLabel: string;
  actionType: 
    | 'BANK_TELLER' 
    | 'BANK_VAULT' 
    | 'STOCK_BROKER' 
    | 'STOCK_TERMINAL' 
    | 'CAFE_BAR' 
    | 'CAFE_TABLE' 
    | 'HOME_BED' 
    | 'HOME_LAPTOP' 
    | 'AUTO_SHOWROOM' 
    | 'TOWN_HALL_DESK';
  description: string;
}

export interface InteriorRoom {
  buildingId: string;
  name: string;
  subtitle: string;
  widthTiles: number;  // 16 tiles = 640px
  heightTiles: number; // 12 tiles = 480px
  floorType: 'MARBLE_CHECKER' | 'PARQUET_WOOD' | 'RUSTIC_PLANK' | 'STUDIO_OAK';
  wallColor: string;
  trimColor: string;
  doorTileX: number;
  doorTileY: number;
  playerSpawnX: number;
  playerSpawnY: number;
  stations: InteriorStation[];
}

export const INTERIOR_ROOMS: Record<string, InteriorRoom> = {
  // 1. FIRST PROSPERITY BANK
  bldg_bank: {
    buildingId: 'bldg_bank',
    name: 'First Prosperity Bank & Vault',
    subtitle: 'Main Branch Banking Hall',
    widthTiles: 16,
    heightTiles: 12,
    floorType: 'MARBLE_CHECKER',
    wallColor: '#064e3b',
    trimColor: '#10b981',
    doorTileX: 8,
    doorTileY: 11,
    playerSpawnX: 8 * 40,
    playerSpawnY: 10 * 40,
    stations: [
      {
        id: 'station_teller',
        name: 'Banker Sterling’s Teller Window',
        icon: '🤵',
        tileX: 7,
        tileY: 3,
        widthTiles: 4,
        heightTiles: 2,
        color: '#10b981',
        actionLabel: 'Deposit / Withdraw & Loans',
        actionType: 'BANK_TELLER',
        description: 'Manage your 4.5% APY High-Yield Savings Vault and pay off debt.',
      },
      {
        id: 'station_vault',
        name: 'Reinforced Steel Security Vault',
        icon: '🔒',
        tileX: 2,
        tileY: 2,
        widthTiles: 3,
        heightTiles: 3,
        color: '#f59e0b',
        actionLabel: '50/30/20 Vault Sorter Minigame',
        actionType: 'BANK_VAULT',
        description: 'Sort your incoming paychecks into Needs, Wants, and Savings!',
      },
    ],
  },

  // 2. WALL STREET STOCK EXCHANGE
  bldg_stock_exchange: {
    buildingId: 'bldg_stock_exchange',
    name: 'Wall Street Exchange Trading Floor',
    subtitle: 'Equities, Index Funds & Bond Desks',
    widthTiles: 16,
    heightTiles: 12,
    floorType: 'PARQUET_WOOD',
    wallColor: '#0f172a',
    trimColor: '#06b6d4',
    doorTileX: 8,
    doorTileY: 11,
    playerSpawnX: 8 * 40,
    playerSpawnY: 10 * 40,
    stations: [
      {
        id: 'station_broker_pit',
        name: 'Floor Broker Trading Pit',
        icon: '🏛️',
        tileX: 7,
        tileY: 3,
        widthTiles: 4,
        heightTiles: 2,
        color: '#06b6d4',
        actionLabel: 'Trade Stocks & Index Funds',
        actionType: 'STOCK_BROKER',
        description: 'Buy S&P 500 index funds, blue-chips, tech equities, and treasury bonds.',
      },
      {
        id: 'station_wave_runner',
        name: 'DCA Wave Simulation Station',
        icon: '🌊',
        tileX: 2,
        tileY: 4,
        widthTiles: 3,
        heightTiles: 2,
        color: '#3b82f6',
        actionLabel: 'Play DCA Wave Rider Minigame',
        actionType: 'STOCK_TERMINAL',
        description: 'Ride market waves and catch compound interest coins!',
      },
    ],
  },

  // 3. THE DAILY GRIND CAFE
  bldg_cafe: {
    buildingId: 'bldg_cafe',
    name: 'The Daily Grind Side-Hustle Cafe',
    subtitle: 'Artisanal Coffee & Freelance Network',
    widthTiles: 16,
    heightTiles: 12,
    floorType: 'RUSTIC_PLANK',
    wallColor: '#292524',
    trimColor: '#d97706',
    doorTileX: 8,
    doorTileY: 11,
    playerSpawnX: 8 * 40,
    playerSpawnY: 10 * 40,
    stations: [
      {
        id: 'station_cafe_bar',
        name: 'Espresso Bar & Pastry Counter',
        icon: '☕',
        tileX: 7,
        tileY: 3,
        widthTiles: 4,
        heightTiles: 2,
        color: '#d97706',
        actionLabel: 'Order Coffee & Gigs',
        actionType: 'CAFE_BAR',
        description: 'Sip fresh espresso to restore energy or pick up freelance consulting gigs.',
      },
      {
        id: 'station_cafe_lounge',
        name: 'Networking Lounge Table',
        icon: '💻',
        tileX: 2,
        tileY: 5,
        widthTiles: 3,
        heightTiles: 2,
        color: '#f59e0b',
        actionLabel: 'Work on Side Hustle',
        actionType: 'CAFE_TABLE',
        description: 'Draft pitch decks, freelance code, or audit spreadsheets.',
      },
    ],
  },

  // 4. STARTER STUDIO HOME
  bldg_home: {
    buildingId: 'bldg_home',
    name: 'Your Starter Studio Apartment',
    subtitle: 'Sanctuary, Rest & Personal Ledger',
    widthTiles: 16,
    heightTiles: 12,
    floorType: 'STUDIO_OAK',
    wallColor: '#1e293b',
    trimColor: '#ec4899',
    doorTileX: 8,
    doorTileY: 11,
    playerSpawnX: 8 * 40,
    playerSpawnY: 10 * 40,
    stations: [
      {
        id: 'station_bed',
        name: 'Cozy Rest Bed',
        icon: '🛏️',
        tileX: 2,
        tileY: 3,
        widthTiles: 3,
        heightTiles: 3,
        color: '#ec4899',
        actionLabel: 'Sleep & Restore Vitality',
        actionType: 'HOME_BED',
        description: 'Get a full 8 hours of sleep: +15% Health, +15% Happiness, resets burnout.',
      },
      {
        id: 'station_laptop_desk',
        name: 'Financial Planning Desk & Laptop',
        icon: '💻',
        tileX: 11,
        tileY: 3,
        widthTiles: 3,
        heightTiles: 2,
        color: '#10b981',
        actionLabel: 'Open Budget Ledger & Priorities',
        actionType: 'HOME_LAPTOP',
        description: 'Inspect debts, review net worth trajectory, and adopt Compound Hound 🐕.',
      },
    ],
  },
};
