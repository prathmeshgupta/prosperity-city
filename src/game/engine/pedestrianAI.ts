import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../world/mapData';

export type PedestrianType = 'BANKER' | 'TECH_BRO' | 'JOGGER' | 'STUDENT' | 'SOCIALITE';

export interface Pedestrian {
  id: string;
  name: string;
  type: PedestrianType;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  speed: number;
  walkFrame: number;
  outfitColor: string;
  hairColor: string;
  accessory: 'BRIEFCASE' | 'PHONE' | 'COFFEE' | 'BACKPACK' | 'SUNGLASSES';
  quip: string | null;
  quipTimer: number;
  isPanicking: boolean;
  panicTimer: number;
}

const QUIPS_BANKER = [
  'Did you see the 10-Year yield invert?!',
  'Sell the puts before the Fed announcement!',
  'My bonus better be in cash this year.',
  'Late for the M&A closing call!',
];

const QUIPS_TECH = [
  'We just raised a $20M seed at $100M cap.',
  'Replacing all analysts with local LLMs.',
  'My oat milk cold brew is 15 minutes late.',
  'Vest and rest, baby.',
];

const QUIPS_STUDENT = [
  'Student loans amortize over 25 years?!',
  'CFA Level 1 study session at the library.',
  'I put all my tuition into Solana.',
];

const QUIPS_SOCIALITE = [
  'Penthouse closing on the ocean boardwalk!',
  'My tax attorney says Monaco is lovely.',
  'Darling, real wealth is quiet equity.',
];

const QUIPS_JOGGER = [
  'Tracking my VO2 max on my watch!',
  'Endorphins beat intraday volatility.',
  'On my 10k morning run!',
];

export class PedestrianEngine {
  public pedestrians: Pedestrian[] = [];

  constructor() {
    this.initPedestrians();
  }

  public initPedestrians() {
    this.pedestrians = [];

    // Distinct sidewalk waypoints across all 10 districts
    const sidewalkNodes = [
      // Financial District
      { x: 20 * TILE_SIZE, y: 13.5 * TILE_SIZE, type: 'BANKER' as const, outfit: '#1e293b', hair: '#475569', acc: 'BRIEFCASE' as const },
      { x: 26 * TILE_SIZE, y: 13.5 * TILE_SIZE, type: 'BANKER' as const, outfit: '#0f172a', hair: '#1e293b', acc: 'PHONE' as const },
      { x: 34 * TILE_SIZE, y: 16.5 * TILE_SIZE, type: 'BANKER' as const, outfit: '#334155', hair: '#64748b', acc: 'BRIEFCASE' as const },
      // Tech Corridor
      { x: 44 * TILE_SIZE, y: 13.5 * TILE_SIZE, type: 'TECH_BRO' as const, outfit: '#4f46e5', hair: '#7c3aed', acc: 'COFFEE' as const },
      { x: 50 * TILE_SIZE, y: 13.5 * TILE_SIZE, type: 'TECH_BRO' as const, outfit: '#06b6d4', hair: '#0284c7', acc: 'PHONE' as const },
      // Civic Plaza & Fountain
      { x: 42 * TILE_SIZE, y: 23 * TILE_SIZE, type: 'SOCIALITE' as const, outfit: '#ec4899', hair: '#f59e0b', acc: 'SUNGLASSES' as const },
      { x: 47 * TILE_SIZE, y: 25 * TILE_SIZE, type: 'STUDENT' as const, outfit: '#10b981', hair: '#047857', acc: 'BACKPACK' as const },
      { x: 49 * TILE_SIZE, y: 27 * TILE_SIZE, type: 'JOGGER' as const, outfit: '#f97316', hair: '#18181b', acc: 'PHONE' as const },
      // University Quarter
      { x: 62 * TILE_SIZE, y: 27.5 * TILE_SIZE, type: 'STUDENT' as const, outfit: '#8b5cf6', hair: '#3b0764', acc: 'BACKPACK' as const },
      { x: 66 * TILE_SIZE, y: 30.5 * TILE_SIZE, type: 'STUDENT' as const, outfit: '#6366f1', hair: '#4338ca', acc: 'COFFEE' as const },
      // Commercial Boulevard
      { x: 38 * TILE_SIZE, y: 41.5 * TILE_SIZE, type: 'BANKER' as const, outfit: '#1e3a8a', hair: '#172554', acc: 'PHONE' as const },
      { x: 52 * TILE_SIZE, y: 44.5 * TILE_SIZE, type: 'TECH_BRO' as const, outfit: '#059669', hair: '#064e3b', acc: 'COFFEE' as const },
      // Residential Park & Beach Boardwalk
      { x: 68 * TILE_SIZE, y: 41.5 * TILE_SIZE, type: 'JOGGER' as const, outfit: '#e11d48', hair: '#881337', acc: 'PHONE' as const },
      { x: 76 * TILE_SIZE, y: 44.5 * TILE_SIZE, type: 'SOCIALITE' as const, outfit: '#f43f5e', hair: '#fbbf24', acc: 'SUNGLASSES' as const },
      { x: 82 * TILE_SIZE, y: 25 * TILE_SIZE, type: 'SOCIALITE' as const, outfit: '#38bdf8', hair: '#fef08a', acc: 'SUNGLASSES' as const },
      { x: 85 * TILE_SIZE, y: 27 * TILE_SIZE, type: 'JOGGER' as const, outfit: '#fbbf24', hair: '#b45309', acc: 'PHONE' as const },
    ];

    sidewalkNodes.forEach((node, idx) => {
      this.pedestrians.push({
        id: `ped_${idx}`,
        name: `Citizen #${idx + 1}`,
        type: node.type,
        x: node.x,
        y: node.y,
        dirX: Math.random() > 0.5 ? 1 : -1,
        dirY: 0,
        speed: node.type === 'JOGGER' ? 95 : 45 + Math.random() * 20,
        walkFrame: Math.random() * 10,
        outfitColor: node.outfit,
        hairColor: node.hair,
        accessory: node.acc,
        quip: null,
        quipTimer: 0,
        isPanicking: false,
        panicTimer: 0,
      });
    });
  }

  public alertNearbyCar(carX: number, carY: number) {
    for (const p of this.pedestrians) {
      const dist = Math.hypot(p.x - carX, p.y - carY);
      if (dist < 120) {
        p.isPanicking = true;
        p.panicTimer = 2.5;
        // Run away from car
        const angle = Math.atan2(p.y - carY, p.x - carX);
        p.dirX = Math.cos(angle);
        p.dirY = Math.sin(angle);
        p.speed = 130;
        p.quip = 'WATCH OUT!';
        p.quipTimer = 2.0;
      }
    }
  }

  public update(dt: number) {
    for (const p of this.pedestrians) {
      p.walkFrame += dt * (p.speed / 10);

      // Handle panic countdown
      if (p.isPanicking) {
        p.panicTimer -= dt;
        if (p.panicTimer <= 0) {
          p.isPanicking = false;
          p.speed = p.type === 'JOGGER' ? 95 : 50;
        }
      }

      // Handle quip timer
      if (p.quipTimer > 0) {
        p.quipTimer -= dt;
        if (p.quipTimer <= 0) {
          p.quip = null;
        }
      } else {
        // Random chance to speak every ~15 seconds
        if (Math.random() < 0.003) {
          let quipList = QUIPS_BANKER;
          if (p.type === 'TECH_BRO') quipList = QUIPS_TECH;
          if (p.type === 'STUDENT') quipList = QUIPS_STUDENT;
          if (p.type === 'SOCIALITE') quipList = QUIPS_SOCIALITE;
          if (p.type === 'JOGGER') quipList = QUIPS_JOGGER;
          p.quip = quipList[Math.floor(Math.random() * quipList.length)];
          p.quipTimer = 3.5;
        }
      }

      // Movement
      p.x += p.dirX * p.speed * dt;
      p.y += p.dirY * p.speed * dt;

      // Reverse direction at sidewalks end (Never walk into ocean water!)
      const minX = 14 * TILE_SIZE;
      const isBoardwalk = p.y >= 23.5 * TILE_SIZE && p.y <= 28.5 * TILE_SIZE;
      const maxX = isBoardwalk ? 91 * TILE_SIZE : 79 * TILE_SIZE;
      if (p.x < minX) {
        p.x = minX;
        p.dirX = 1;
      } else if (p.x > maxX) {
        p.x = maxX;
        p.dirX = -1;
      }

      // Periodic random turn
      if (Math.random() < 0.008 && !p.isPanicking) {
        p.dirX *= -1;
      }
    }
  }
}

export const pedestrianEngine = new PedestrianEngine();
