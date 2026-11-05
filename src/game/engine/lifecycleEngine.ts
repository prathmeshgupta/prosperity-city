import { 
  GameState, 
  ProgressionSpeed, 
  LifeStage, 
  LifeFocus, 
  EnergyAllocation,
  GenerationalRecord,
  GenerationalLegacy
} from '../../types/game';
import { createInitialGameState } from '../../engine/defaultState';

export interface LifeStageDetails {
  stage: LifeStage;
  title: string;
  ageRange: string;
  tagline: string;
  icon: string;
  themeColor: string;
  primaryDilemma: string;
  keyAction: string;
}

export const LIFE_STAGE_CONFIG: Record<LifeStage, LifeStageDetails> = {
  SPARK: {
    stage: 'SPARK',
    title: 'The Spark',
    ageRange: 'Ages 18–24',
    tagline: 'Foundation & Debt Slaying',
    icon: '⚡',
    themeColor: '#38bdf8',
    primaryDilemma: 'Avoid toxic credit card interest and build your first $1k–$3k emergency fund buffer.',
    keyAction: 'Clock in shifts at Apex Tower, split paychecks 50/30/20 in the Bank Vault, and ride the Commuter Bike.',
  },
  CLIMB: {
    stage: 'CLIMB',
    title: 'The Climb',
    ageRange: 'Ages 25–39',
    tagline: 'Wealth Accumulation & Real Assets',
    icon: '🧗',
    themeColor: '#10b981',
    primaryDilemma: 'Resist lifestyle inflation. Buy index funds and your first rental property before expensive cars.',
    keyAction: 'Acquire the Suburban Turnkey Duplex, collect $2,400/mo rent, and compound S&P 500 index funds on Wall Street.',
  },
  PEAK: {
    stage: 'PEAK',
    title: 'The Peak & Pivot',
    ageRange: 'Ages 40–54',
    tagline: 'Peak Earnings & Hedging',
    icon: '⛰️',
    themeColor: '#8b5cf6',
    primaryDilemma: 'Balance high income against mid-career burnout. Diversify into bonds, real estate, and healthcare shield.',
    keyAction: 'Shield wealth with umbrella insurance at Guardian Clinic and optimize passive cashflow.',
  },
  SUMMIT: {
    stage: 'SUMMIT',
    title: 'The Summit',
    ageRange: 'Ages 55–69',
    tagline: 'Financial Independence (FIRE)',
    icon: '🔔',
    themeColor: '#f59e0b',
    primaryDilemma: 'Sequence-of-returns risk: ensure passive income covers expenses under the 4% Safe Withdrawal Rule.',
    keyAction: 'Ring the Golden Freedom Bell in the Central Plaza and transition into Coast-FIRE or passion projects.',
  },
  LEGACY: {
    stage: 'LEGACY',
    title: 'The Legacy',
    ageRange: 'Ages 70+',
    tagline: 'Decumulation, Impact & Dynasty',
    icon: '👑',
    themeColor: '#ec4899',
    primaryDilemma: 'Passing on wisdom and capital efficiently through family trusts and philanthropic endowments.',
    keyAction: 'Enter the Prosperity Hall of Fame at Town Hall and endow your successor for Generational New Game+.',
  },
};

export const LIFE_FOCUS_PRESETS: Record<LifeFocus, {
  name: string;
  tagline: string;
  icon: string;
  allocation: EnergyAllocation;
  perkDescription: string;
}> = {
  BALANCED: {
    name: 'Balanced Life Focus',
    tagline: 'Sustainable wealth, steady vitality, and relationships',
    icon: '⚖️',
    allocation: { career: 35, health: 25, leisure: 25, education: 15 },
    perkDescription: 'Moderate career gains (+15% wage growth), zero burnout risk, stable happiness.',
  },
  HUSTLE: {
    name: 'The Grinder / Career Hustle',
    tagline: 'Maximizing income, overtime shifts, and rapid raises',
    icon: '💼',
    allocation: { career: 60, health: 15, leisure: 10, education: 15 },
    perkDescription: 'High career growth (+35% wage bonuses, rapid promotions), but +10 burnout per period.',
  },
  ZEN: {
    name: 'Zen Longevity & Health First',
    tagline: 'Prioritizing physical vitality, low stress, and deep sleep',
    icon: '🌿',
    allocation: { career: 20, health: 45, leisure: 25, education: 10 },
    perkDescription: 'Maximum health (+8% vitality recovery), clears burnout, reduces medical emergencies by 90%.',
  },
  FIRE_SPRINTER: {
    name: 'FIRE Sprinter (Hyper-Frugal)',
    tagline: 'Sacrificing luxury now for total financial freedom in 10 years',
    icon: '🚀',
    allocation: { career: 45, health: 20, leisure: 10, education: 25 },
    perkDescription: 'High savings capacity, double XP from university studies, rapid index fund accumulation.',
  },
};

export const HEREDITARY_PERKS = [
  {
    id: 'TRUST_FUND_DIVIDEND',
    title: 'The Family Trust Fund',
    icon: '🪙',
    description: 'Successor begins with a $15,000 diversified dividend portfolio generating passive cashflow on day one.',
  },
  {
    id: 'REAL_ESTATE_DYNASTY',
    title: 'Real Estate Scion',
    icon: '🏘️',
    description: 'Successor inherits outright title to a Suburban Turnkey Duplex collecting $2,400/month tenant rent.',
  },
  {
    id: 'ACADEMIC_ENDOWMENT',
    title: 'Endowed University Scholar',
    icon: '🎓',
    description: 'Successor receives a permanent +50% XP multiplier on all financial academy lessons and professional certificates.',
  },
  {
    id: 'COMPOUND_PEDIGREE',
    title: 'Compound Interest Pedigree',
    icon: '📈',
    description: 'The family name commands prestige: +1.0% higher APY on High-Yield Savings and lower mortgage interest rates.',
  },
];

/**
 * Calculates current human life stage from age
 */
export function getLifeStage(age: number): LifeStage {
  if (age < 25) return 'SPARK';
  if (age < 40) return 'CLIMB';
  if (age < 55) return 'PEAK';
  if (age < 70) return 'SUMMIT';
  return 'LEGACY';
}

/**
 * Updates progression speed on state (MONTHLY, QUARTERLY, ANNUAL)
 */
export function setProgressionSpeed(state: GameState, speed: ProgressionSpeed): void {
  state.progressionSpeed = speed;
  switch (speed) {
    case 'MONTHLY':
      state.turnDurationMonths = 1;
      break;
    case 'QUARTERLY':
      state.turnDurationMonths = 3;
      break;
    case 'ANNUAL':
      state.turnDurationMonths = 12;
      break;
  }
}

/**
 * Sets player life focus preset
 */
export function setLifeFocus(state: GameState, focus: LifeFocus): void {
  state.lifeFocus = focus;
  state.energyAllocation = { ...LIFE_FOCUS_PRESETS[focus].allocation };
}

/**
 * Simulates energy, health, burnout, and career impacts during turn advancement
 */
export function processLifecycleTurnImpact(state: GameState, months: number): {
  salaryBonus: number;
  burnoutDelta: number;
  healthDelta: number;
  happinessDelta: number;
  xpBonus: number;
  message: string;
} {
  // Ensure defaults if not present
  if (!state.energyAllocation) {
    state.energyAllocation = { career: 35, health: 25, leisure: 25, education: 15 };
  }
  if (!state.lifeFocus) state.lifeFocus = 'BALANCED';
  if (state.burnout === undefined) state.burnout = 15;

  const alloc = state.energyAllocation;

  // 1. Career Impact
  let salaryBonus = 0;
  let burnoutDelta = 0;
  if (alloc.career >= 50) {
    // Hustle bonus: 5% to 15% overtime income
    const basePeriodSalary = (state.character.annualSalary / 12) * months;
    salaryBonus = Math.round(basePeriodSalary * (alloc.career / 300));
    state.cash += salaryBonus;
    burnoutDelta += Math.round((alloc.career - 40) / 3);
  } else if (alloc.career <= 25) {
    // Relaxed career: lower stress
    burnoutDelta -= 8;
  }

  // 2. Health & Vitality Impact
  let healthDelta = 0;
  if (alloc.health >= 35) {
    healthDelta += Math.round((alloc.health - 25) / 5);
    burnoutDelta -= 6;
  } else if (alloc.health < 20) {
    healthDelta -= 4; // neglecting health
  }

  // Age-related physical drag (older ages require more health care)
  if (state.character.age >= 60) {
    healthDelta -= 1;
  }

  // 3. Happiness & Leisure Impact
  let happinessDelta = 0;
  if (alloc.leisure >= 25) {
    happinessDelta += Math.round((alloc.leisure - 20) / 4);
  } else if (alloc.leisure < 15) {
    happinessDelta -= 5; // all work and no play
  }

  // 4. Education & XP Impact
  let xpBonus = 0;
  if (alloc.education >= 15) {
    xpBonus = Math.round(alloc.education * 2.5);
    state.totalXP += xpBonus;
  }

  // Apply clamp to Vitals
  state.burnout = Math.max(0, Math.min(100, (state.burnout || 0) + burnoutDelta));
  state.character.health = Math.max(10, Math.min(100, state.character.health + healthDelta));
  state.character.happiness = Math.max(10, Math.min(100, state.character.happiness + happinessDelta));

  // Burnout penalty if over 75
  if (state.burnout >= 75) {
    state.character.health = Math.max(10, state.character.health - 6);
    state.character.happiness = Math.max(10, state.character.happiness - 8);
  }

  // Update current life stage
  state.lifeStage = getLifeStage(state.character.age);

  let message = `Priorities applied: ${state.lifeFocus} focus.`;
  if (salaryBonus > 0) message += ` Overtime Hustle: +$${salaryBonus.toLocaleString()}.`;
  if (xpBonus > 0) message += ` Studies: +${xpBonus} XP.`;
  if (state.burnout >= 75) message += ` ⚠️ Warning: High burnout (${state.burnout}%)! Consider resting at Home.`;

  return {
    salaryBonus,
    burnoutDelta,
    healthDelta,
    happinessDelta,
    xpBonus,
    message,
  };
}

/**
 * Creates Generational Successor for New Game+ (Gen 2+)
 */
export function createGenerationalSuccessor(
  currentState: GameState,
  heirName: string,
  heirAvatar: string,
  perkId: string,
  trustFundAmount: number
): GameState {
  const curGen = currentState.generationalLegacy?.generation || 1;
  const netWorth = Math.round(currentState.cash + currentState.emergencyFund);

  // Preserve ancestor record in Hall of Fame
  const ancestorRecord: GenerationalRecord = {
    generation: curGen,
    name: currentState.character.name,
    finalNetWorth: netWorth,
    finalAge: currentState.character.age,
    careerTitle: currentState.character.careerTitle,
    primaryPerk: perkId,
    date: new Date().toLocaleDateString(),
  };

  const hallOfFame = [
    ...(currentState.generationalLegacy?.hallOfFame || []),
    ancestorRecord,
  ];

  // Create fresh state starting at age 18
  const nextGenState = createInitialGameState('archetype_fresh_grad');
  nextGenState.character.name = heirName;
  nextGenState.character.avatar = heirAvatar;
  nextGenState.character.age = 18;
  nextGenState.character.initialAge = 18;
  nextGenState.month = 1;

  // Apply Inherited Trust Fund & Hereditary Perk
  const actualTrust = Math.min(currentState.cash, trustFundAmount);
  nextGenState.cash = Math.max(1500, actualTrust);
  nextGenState.emergencyFund = 3000;

  // Apply Perk Benefits
  if (perkId === 'REAL_ESTATE_DYNASTY') {
    // Inherits turnkey duplex immediately
    nextGenState.recentEvents.push({
      month: 1,
      text: `🏛️ Generational Inheritance: Inherited the family's Suburban Turnkey Duplex collecting $2,400/month rent!`,
      type: 'positive',
    });
  } else if (perkId === 'ACADEMIC_ENDOWMENT') {
    nextGenState.totalXP = 500;
    nextGenState.recentEvents.push({
      month: 1,
      text: `🎓 Generational Endowment: FinTwist University full scholarship unlocked with 500 starting XP!`,
      type: 'positive',
    });
  } else if (perkId === 'COMPOUND_PEDIGREE') {
    nextGenState.hysaInterestRate = 0.055; // 5.5% APY
    nextGenState.recentEvents.push({
      month: 1,
      text: `📈 Generational Pedigree: Preferred 5.5% APY High-Yield Savings Vault unlocked at First Prosperity Bank!`,
      type: 'positive',
    });
  }

  // Set Generational Legacy block
  nextGenState.generationalLegacy = {
    generation: curGen + 1,
    ancestorName: currentState.character.name,
    familyMotto: `Building Generational Prosperity since Generation 1`,
    hereditaryPerk: perkId,
    trustFundBalance: actualTrust,
    hallOfFame,
  };

  return nextGenState;
}
