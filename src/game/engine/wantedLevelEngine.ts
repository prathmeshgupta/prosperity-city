import { soundFx } from '../../audio/soundFx';

export type InfractionType = 
  | 'SIDEWALK_DRIVING'
  | 'AGGRESSIVE_TAX_EVASION'
  | 'INSIDER_TRADING'
  | 'CRYPTO_PUMP_AND_DUMP'
  | 'OFFSHORE_LAUNDERING'
  | 'SEC_SUBPOENA_EVASION';

export interface WantedLevelState {
  heat: number; // 0.0 to 5.0
  stars: number; // 0 to 5
  recentInfraction: string | null;
  lastInfractionTime: number;
  isAccountFrozen: boolean;
  activeEnforcementPatrols: number;
}

export class WantedLevelEngine {
  private heat: number = 0; // Floating point 0.0 to 5.0
  private recentInfraction: string | null = null;
  private lastInfractionTime: number = 0;

  constructor() {}

  public getStars(): number {
    return Math.min(5, Math.floor(this.heat));
  }

  public getHeat(): number {
    return this.heat;
  }

  public getInfraction(): string | null {
    return this.recentInfraction;
  }

  public isAccountFrozen(): boolean {
    return this.getStars() >= 3;
  }

  public addHeat(amount: number, reason: string): { oldStars: number; newStars: number; message: string } {
    const oldStars = this.getStars();
    this.heat = Math.min(5.0, this.heat + amount);
    const newStars = this.getStars();
    this.recentInfraction = reason;
    this.lastInfractionTime = Date.now();

    if (newStars > oldStars) {
      soundFx.playWantedLevelUp();
    }

    return {
      oldStars,
      newStars,
      message: `🚨 SEC & IRS ALERT: ${reason} (+${amount.toFixed(1)} Heat)! Wanted Level: ${'⭐'.repeat(newStars)}`,
    };
  }

  public settleWithAttorney(cash: number): { success: boolean; cost: number; message: string } {
    const stars = this.getStars();
    if (stars === 0) {
      return { success: false, cost: 0, message: 'You have clean regulatory standing with 0 Wanted Stars.' };
    }

    // Cost scales with stars: 1 star = $1,500; 2 stars = $5,000; 3 stars = $15,000; 4 stars = $45,000; 5 stars = $120,000
    const costTable = [0, 1500, 5000, 15000, 45000, 120000];
    const settlementCost = costTable[stars] || 10000;

    if (cash < settlementCost) {
      return {
        success: false,
        cost: settlementCost,
        message: `Insufficient funds. Top-tier Defense Attorney Saul Goodman requires $${settlementCost.toLocaleString()} to settle SEC charges.`,
      };
    }

    this.heat = 0;
    this.recentInfraction = null;
    soundFx.playCoin();

    return {
      success: true,
      cost: settlementCost,
      message: `⚖️ Charges Settled! Attorney negotiated a confidential deferred prosecution agreement. Wanted Level cleared to 0 ⭐!`,
    };
  }

  public update(dt: number) {
    // Natural heat decay if no infractions for 20 seconds
    const timeSinceLast = Date.now() - this.lastInfractionTime;
    if (timeSinceLast > 20000 && this.heat > 0) {
      // Slow cool-down (takes ~45 seconds per star to cool off)
      this.heat = Math.max(0, this.heat - dt * 0.025);
      if (this.heat === 0) {
        this.recentInfraction = null;
      }
    }
  }
}

export const wantedLevelEngine = new WantedLevelEngine();
