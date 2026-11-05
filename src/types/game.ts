export type GameMode = 'rpg' | 'story' | 'sandbox' | 'academy' | 'expansions' | 'analytics';

export type MarketSentiment = 'BOOM' | 'BULL' | 'NORMAL' | 'BEAR' | 'CRASH' | 'STAGFLATION';

export type AssetCategory = 
  | 'CASH' 
  | 'SAVINGS' 
  | 'INDEX_FUND' 
  | 'BLUE_CHIP' 
  | 'TECH_GROWTH' 
  | 'GOV_BOND' 
  | 'REAL_ESTATE_REIT' 
  | 'CRYPTO' 
  | 'PHYSICAL_PROPERTY' 
  | 'STARTUP_EQUITY' 
  | 'COMMODITY' 
  | 'GREEN_ENERGY';

export interface AssetDefinition {
  id: string;
  name: string;
  symbol: string;
  category: AssetCategory;
  description: string;
  educationalNote: string;
  initialPrice: number;
  currentPrice: number;
  historicalPrices: number[];
  dividendYield: number; // annual percentage, e.g. 0.02 for 2%
  volatility: number;    // annual std dev multiplier, e.g. 0.15
  expectedAnnualReturn: number; // e.g. 0.08
  minPurchase: number;
  expansionPackId?: string;
  icon: string;
  riskRating: 1 | 2 | 3 | 4 | 5; // 1 = lowest, 5 = highest
}

export interface PortfolioPosition {
  assetId: string;
  shares: number;
  costBasis: number;
}

export interface DebtItem {
  id: string;
  name: string;
  category: 'CREDIT_CARD' | 'STUDENT_LOAN' | 'AUTO_LOAN' | 'MORTGAGE' | 'PERSONAL';
  principal: number;
  interestRate: number; // Annual percentage e.g. 0.22 for 22%
  minimumMonthlyPayment: number;
  educationalTip: string;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  category: 'HEALTH' | 'RENTERS' | 'AUTO' | 'TERM_LIFE';
  monthlyPremium: number;
  coverageDescription: string;
  isActive: boolean;
  deductible: number;
}

export interface Archetype {
  id: string;
  name: string;
  title: string;
  age: number;
  avatar: string;
  bio: string;
  startingCash: number;
  startingSavings: number;
  startingSalary: number; // annual
  startingDebts: DebtItem[];
  startingHappiness: number;
  startingHealth: number;
  creditScore: number;
  recommendedFor: string;
}

export interface TwistChoice {
  text: string;
  description?: string;
  cashChange?: number;
  debtChange?: { debtId?: string; amount: number; name?: string; interestRate?: number };
  happinessChange?: number;
  healthChange?: number;
  salaryChange?: number;
  creditScoreChange?: number;
  assetBonus?: { assetId: string; shares: number };
  educationalTakeaway: string;
  statRequirement?: { key: 'cash' | 'creditScore' | 'health'; min: number };
}

export interface TwistEvent {
  id: string;
  title: string;
  category: 'OPPORTUNITY' | 'EMERGENCY' | 'MARKET' | 'CAREER' | 'LIFESTYLE' | 'SCAM' | 'TAX';
  icon: string;
  story: string;
  explanation: string; // The financial concept explained
  choices: TwistChoice[];
  condition?: (state: GameState) => boolean;
  expansionPackId?: string;
}

export interface CareerMilestone {
  id: string;
  title: string;
  field: string;
  annualSalary: number;
  requiredEducationMonths: number;
  description: string;
  energyCost: number; // affects health/happiness
}

export interface SideHustle {
  id: string;
  title: string;
  monthlyIncome: number;
  hoursPerWeek: number;
  startupCost: number;
  isActive: boolean;
  description: string;
}

export interface FinancialHealthGrade {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  score: number; // 0-100
  emergencyBufferMonths: number;
  debtToIncomeRatio: number;
  savingsRate: number;
  diversificationScore: number; // 0-100
  summary: string;
  recommendations: string[];
}

export interface SnapshotHistory {
  month: number;
  age: number;
  netWorth: number;
  cash: number;
  portfolioValue: number;
  debtTotal: number;
  monthlySavings: number;
  happiness: number;
  sentiment: MarketSentiment;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardXP: number;
  unlockedAt?: number; // month
  condition: (state: GameState) => boolean;
}

export interface GameState {
  // Character
  character: {
    name: string;
    avatar: string;
    age: number;
    initialAge: number;
    archetypeId: string;
    careerTitle: string;
    annualSalary: number;
    happiness: number;   // 0 - 100
    health: number;      // 0 - 100
    creditScore: number; // 300 - 850
    lifestyleLevel: 'FRUGAL' | 'BALANCED' | 'COMFORTABLE' | 'LUXURY';
  };

  // Time & Economic cycle
  month: number;
  turnDurationMonths: number; // 1 or 3 months per turn
  sentiment: MarketSentiment;
  inflationRate: number; // e.g. 0.03
  interestRate: number;  // Fed rate e.g. 0.045
  economicHeadline: string;

  // Balance sheet
  cash: number;
  emergencyFund: number; // HYSA paying interest
  hysaInterestRate: number; // e.g. 0.045

  // Investments
  portfolio: PortfolioPosition[];
  assets: AssetDefinition[];

  // Debts & Insurance
  debts: DebtItem[];
  insurance: InsurancePolicy[];

  // Retirement
  retirement: {
    traditional401k: number;
    rothIRA: number;
    employee401kContributionPct: number; // 0 - 0.15
    employerMatchLimitPct: number;       // e.g. 0.06 (matches up to 6%)
    employerMatchRate: number;           // e.g. 0.50 (50% match) or 1.0 (100% match)
  };

  // Side hustles & Upskilling
  sideHustles: SideHustle[];
  educationInProgress?: {
    milestoneId: string;
    monthsRemaining: number;
  };

  // Log & History
  history: SnapshotHistory[];
  recentEvents: { month: number; text: string; type: 'info' | 'positive' | 'negative' }[];
  achievements: Achievement[];
  totalXP: number;

  // Active expansion packs
  activeExpansionIds: string[];

  // Game status
  isGameOver: boolean;
  gameOverReason?: string;
}

export interface ExpansionPack {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon: string;
  themeColor: string;
  isBuiltIn: boolean;
  assets?: AssetDefinition[];
  events?: TwistEvent[];
  achievements?: Achievement[];
  customCareers?: CareerMilestone[];
  customLessons?: AcademyLesson[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  tagline: string;
  category: 'BASICS' | 'INVESTING' | 'DEBT' | 'PSYCHOLOGY' | 'RETIREMENT' | 'ADVANCED';
  icon: string;
  readTime: string;
  content: {
    headline: string;
    sections: {
      heading: string;
      body: string;
      takeaway?: string;
      diagramType?: 'rule72' | 'snowball' | 'emergency' | 'compound' | 'feeImpact' | 'inflation' | 'assetMix';
    }[];
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  xpReward: number;
  isCompleted?: boolean;
}
