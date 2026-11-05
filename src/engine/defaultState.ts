import { Archetype, AssetDefinition, GameState } from '../types/game';
import { ARCHETYPES } from '../data/archetypes';
import { BASE_ASSETS } from '../data/baseAssets';
import { BASE_ACHIEVEMENTS } from '../data/achievements';
import { expansionManager } from '../expansions/registry';
import { cryptoExpansionPack } from '../expansions/packs/cryptoPack';
import { realEstateExpansionPack } from '../expansions/packs/realEstatePack';
import { startupExpansionPack } from '../expansions/packs/startupPack';
import { greenExpansionPack } from '../expansions/packs/greenPack';

// Register built-in expansion packs on engine load
let isInitialized = false;
export function initExpansionsOnce() {
  if (isInitialized) return;
  expansionManager.registerPack(cryptoExpansionPack, true);
  expansionManager.registerPack(realEstateExpansionPack, true);
  expansionManager.registerPack(startupExpansionPack, false); // optional by default
  expansionManager.registerPack(greenExpansionPack, false);   // optional by default
  isInitialized = true;
}

export function createInitialGameState(archetypeId: string = 'archetype_fresh_grad'): GameState {
  initExpansionsOnce();

  const archetype: Archetype =
    ARCHETYPES.find((a) => a.id === archetypeId) || ARCHETYPES[0];

  // Active expansion assets
  const activePacks = expansionManager.getActivePacks();
  const allAssets: AssetDefinition[] = [...BASE_ASSETS];
  for (const pack of activePacks) {
    if (pack.assets) {
      for (const asset of pack.assets) {
        if (!allAssets.some((a) => a.id === asset.id)) {
          allAssets.push(asset);
        }
      }
    }
  }

  // Active achievements
  const allAchievements = [...BASE_ACHIEVEMENTS];
  for (const pack of activePacks) {
    if (pack.achievements) {
      for (const ach of pack.achievements) {
        if (!allAchievements.some((a) => a.id === ach.id)) {
          allAchievements.push(ach);
        }
      }
    }
  }

  const initialMonth = 1;
  const initialNetWorth =
    archetype.startingCash +
    archetype.startingSavings -
    archetype.startingDebts.reduce((acc, d) => acc + d.principal, 0);

  return {
    character: {
      name: archetype.name,
      avatar: archetype.avatar,
      age: archetype.age,
      initialAge: archetype.age,
      archetypeId: archetype.id,
      careerTitle: archetype.title,
      annualSalary: archetype.startingSalary,
      happiness: archetype.startingHappiness,
      health: archetype.startingHealth,
      creditScore: archetype.creditScore,
      lifestyleLevel: 'BALANCED',
    },

    month: initialMonth,
    turnDurationMonths: 3, // 1 turn = 1 quarter (fast, brisk pacing!)
    sentiment: 'NORMAL',
    inflationRate: 0.032,
    interestRate: 0.045,
    economicHeadline: 'Economy steady as consumers balance spending with interest rate expectations.',

    cash: archetype.startingCash,
    emergencyFund: archetype.startingSavings,
    hysaInterestRate: 0.045, // 4.5% APY

    portfolio: [],
    assets: allAssets,

    debts: JSON.parse(JSON.stringify(archetype.startingDebts)),
    insurance: [
      {
        id: 'ins_health',
        name: 'Major Medical Health Insurance',
        category: 'HEALTH',
        monthlyPremium: 180,
        coverageDescription: 'Protects against catastrophic medical bills with a $1,500 deductible.',
        isActive: true,
        deductible: 1500,
      },
      {
        id: 'ins_renters',
        name: 'Renters & Personal Property Insurance',
        category: 'RENTERS',
        monthlyPremium: 15,
        coverageDescription: 'Covers up to $30,000 personal possessions against fire, theft, and water damage.',
        isActive: true,
        deductible: 500,
      },
    ],

    retirement: {
      traditional401k: 0,
      rothIRA: 0,
      employee401kContributionPct: 0.06, // default 6% to get match
      employerMatchLimitPct: 0.06,
      employerMatchRate: 0.50, // 50% match
    },

    sideHustles: [],
    history: [
      {
        month: initialMonth,
        age: archetype.age,
        netWorth: initialNetWorth,
        cash: archetype.startingCash,
        portfolioValue: 0,
        debtTotal: archetype.startingDebts.reduce((acc, d) => acc + d.principal, 0),
        monthlySavings: 0,
        happiness: archetype.startingHappiness,
        sentiment: 'NORMAL',
      },
    ],

    recentEvents: [
      {
        month: initialMonth,
        text: `Welcome to FinTwist! You have embarked on your financial journey as ${archetype.name} (${archetype.title}).`,
        type: 'info',
      },
    ],

    achievements: allAchievements,
    totalXP: 0,
    activeExpansionIds: expansionManager.getActivePackIds(),

    isGameOver: false,
  };
}
