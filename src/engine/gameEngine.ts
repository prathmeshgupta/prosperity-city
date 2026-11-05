import { GameState, TwistEvent, TwistChoice, MarketSentiment } from '../types/game';
import { BASE_TWIST_EVENTS } from '../data/baseEvents';
import { expansionManager } from '../expansions/registry';
import { soundFx } from '../audio/soundFx';

export interface AdvanceTurnResult {
  nextState: GameState;
  unlockedAchievements: string[];
  pendingEvent: TwistEvent | null;
  quarterCashflow: {
    grossIncome: number;
    taxes: number;
    livingExpenses: number;
    debtPayments: number;
    retirementSaved: number;
    dividendsEarned: number;
    hysaInterestEarned: number;
    netCashflow: number;
  };
}

export function advanceTurn(currentState: GameState): AdvanceTurnResult {
  const state: GameState = JSON.parse(JSON.stringify(currentState));
  const months = state.turnDurationMonths;
  state.month += months;
  state.character.age = Math.floor(state.character.initialAge + (state.month - 1) / 12);

  // 1. Economic Sentiment Drift
  state.sentiment = getNextSentiment(state.sentiment);
  state.economicHeadline = getRandomHeadline(state.sentiment);

  // 2. Gross Income calculation
  const quarterlyBaseSalary = (state.character.annualSalary / 12) * months;
  const quarterlySideHustle = state.sideHustles
    .filter((s) => s.isActive)
    .reduce((acc, s) => acc + s.monthlyIncome * months, 0);
  const grossIncome = quarterlyBaseSalary + quarterlySideHustle;

  // 3. Taxes (approx ~22% effective)
  const taxes = Math.round(grossIncome * 0.22);

  // 4. Retirement 401(k) deduction and Employer Match
  const employee401k = Math.round(quarterlyBaseSalary * state.retirement.employee401kContributionPct);
  const matchablePct = Math.min(
    state.retirement.employee401kContributionPct,
    state.retirement.employerMatchLimitPct
  );
  const employerMatch = Math.round(quarterlyBaseSalary * matchablePct * state.retirement.employerMatchRate);
  const total401kDeposit = employee401k + employerMatch;
  state.retirement.traditional401k += total401kDeposit;

  // 5. Living Expenses based on Lifestyle level
  const lifestyleRatio =
    state.character.lifestyleLevel === 'FRUGAL' ? 0.35 :
    state.character.lifestyleLevel === 'BALANCED' ? 0.50 :
    state.character.lifestyleLevel === 'COMFORTABLE' ? 0.65 : 0.85;
  const livingExpenses = Math.round(quarterlyBaseSalary * lifestyleRatio);

  // 6. Insurance Premiums
  const totalInsurance = state.insurance
    .filter((ins) => ins.isActive)
    .reduce((sum, ins) => sum + ins.monthlyPremium * months, 0);

  // 7. Debts: Interest accrual & minimum payments
  let totalDebtPayments = 0;
  for (const debt of state.debts) {
    if (debt.principal > 0) {
      // Interest accrued over the period
      const periodicRate = (debt.interestRate / 12) * months;
      debt.principal += Math.round(debt.principal * periodicRate);

      // Minimum payment
      const payment = Math.min(debt.principal, debt.minimumMonthlyPayment * months);
      debt.principal -= payment;
      totalDebtPayments += payment;
    }
  }

  // 8. HYSA Interest Credited
  const hysaQuarterlyRate = (state.hysaInterestRate / 12) * months;
  const hysaInterestEarned = Math.round(state.emergencyFund * hysaQuarterlyRate);
  state.emergencyFund += hysaInterestEarned;

  // 9. Asset Price Movement & Dividends
  let totalDividends = 0;
  for (const asset of state.assets) {
    const priceChangePct = calculateAssetPriceReturn(asset, state.sentiment, months);
    const newPrice = Math.max(1, Math.round(asset.currentPrice * (1 + priceChangePct) * 100) / 100);
    asset.currentPrice = newPrice;
    asset.historicalPrices.push(newPrice);
    if (asset.historicalPrices.length > 20) {
      asset.historicalPrices.shift();
    }

    // Dividends for owned shares
    const position = state.portfolio.find((p) => p.assetId === asset.id);
    if (position && position.shares > 0 && asset.dividendYield > 0) {
      const quarterlyDivYield = (asset.dividendYield / 12) * months;
      const payout = Math.round(position.shares * asset.currentPrice * quarterlyDivYield);
      totalDividends += payout;
    }
  }

  // Also compound 401(k) based on general market return (S&P 500 equivalent)
  const sp500 = state.assets.find((a) => a.id === 'asset_sp500');
  const marketReturn = sp500
    ? (sp500.currentPrice - sp500.historicalPrices[sp500.historicalPrices.length - 2]) /
      (sp500.historicalPrices[sp500.historicalPrices.length - 2] || sp500.currentPrice)
    : 0.02;
  state.retirement.traditional401k = Math.max(
    0,
    Math.round(state.retirement.traditional401k * (1 + marketReturn))
  );

  // 10. Net Cashflow to Checking
  const netCashflow =
    grossIncome -
    taxes -
    employee401k -
    livingExpenses -
    totalInsurance -
    totalDebtPayments +
    totalDividends;

  state.cash += netCashflow;

  // If cash drops below zero, pull from emergency fund
  if (state.cash < 0) {
    const deficit = Math.abs(state.cash);
    if (state.emergencyFund >= deficit) {
      state.emergencyFund -= deficit;
      state.cash = 0;
      state.recentEvents.push({
        month: state.month,
        text: `Transferred $${deficit.toLocaleString()} from Emergency Fund to cover cashflow deficit.`,
        type: 'negative',
      });
    } else {
      const covered = state.emergencyFund;
      state.cash = -(deficit - covered);
      state.emergencyFund = 0;
      // High interest credit card created for uncovered overdraft
      const overdraft = Math.abs(state.cash);
      state.cash = 0;
      const cc = state.debts.find((d) => d.category === 'CREDIT_CARD');
      if (cc) {
        cc.principal += overdraft;
      } else {
        state.debts.push({
          id: `debt_overdraft_${state.month}`,
          name: 'Emergency Credit Card Overdraft',
          category: 'CREDIT_CARD',
          principal: overdraft,
          interestRate: 0.24,
          minimumMonthlyPayment: Math.max(25, Math.round(overdraft * 0.04)),
          educationalTip: 'Cash deficits trigger expensive high-interest credit card debt.',
        });
      }
      state.character.happiness = Math.max(10, state.character.happiness - 10);
      state.character.creditScore = Math.max(450, state.character.creditScore - 20);
    }
  }

  // 11. Credit score updates
  const totalDebt = state.debts.reduce((sum, d) => sum + d.principal, 0);
  if (totalDebt === 0 && state.character.creditScore < 800) {
    state.character.creditScore += 3;
  }

  // 12. Calculate total net worth
  const currentNetWorth = getNetWorth(state);

  // 13. Append Snapshot History
  state.history.push({
    month: state.month,
    age: state.character.age,
    netWorth: currentNetWorth,
    cash: state.cash,
    portfolioValue: getPortfolioValue(state),
    debtTotal: totalDebt,
    monthlySavings: Math.round(netCashflow / months),
    happiness: state.character.happiness,
    sentiment: state.sentiment,
  });

  // 14. Check achievements
  const unlockedAchievements: string[] = [];
  for (const ach of state.achievements) {
    if (!ach.unlockedAt && ach.condition(state)) {
      ach.unlockedAt = state.month;
      state.totalXP += ach.rewardXP;
      unlockedAchievements.push(ach.title);
      state.recentEvents.push({
        month: state.month,
        text: `🏆 Achievement Unlocked: ${ach.title} (+${ach.rewardXP} XP)!`,
        type: 'positive',
      });
    }
  }

  // 15. Pick Twist Event
  const pendingEvent = pickRandomTwistEvent(state);

  return {
    nextState: state,
    unlockedAchievements,
    pendingEvent,
    quarterCashflow: {
      grossIncome,
      taxes,
      livingExpenses,
      debtPayments: totalDebtPayments,
      retirementSaved: total401kDeposit,
      dividendsEarned: totalDividends,
      hysaInterestEarned,
      netCashflow,
    },
  };
}

export function resolveTwistChoice(currentState: GameState, choice: TwistChoice): GameState {
  const state: GameState = JSON.parse(JSON.stringify(currentState));

  if (choice.cashChange) {
    state.cash += choice.cashChange;
  }
  if (choice.happinessChange) {
    state.character.happiness = Math.max(0, Math.min(100, state.character.happiness + choice.happinessChange));
  }
  if (choice.healthChange) {
    state.character.health = Math.max(0, Math.min(100, state.character.health + choice.healthChange));
  }
  if (choice.salaryChange) {
    state.character.annualSalary += choice.salaryChange;
  }
  if (choice.creditScoreChange) {
    state.character.creditScore = Math.max(300, Math.min(850, state.character.creditScore + choice.creditScoreChange));
  }
  if (choice.debtChange) {
    if (choice.debtChange.debtId) {
      const target = state.debts.find((d) => d.id === choice.debtChange?.debtId);
      if (target) {
        target.principal = Math.max(0, target.principal + choice.debtChange.amount);
      }
    } else {
      state.debts.push({
        id: `debt_twist_${Date.now()}`,
        name: choice.debtChange.name || 'Unplanned Debt',
        category: 'CREDIT_CARD',
        principal: choice.debtChange.amount,
        interestRate: choice.debtChange.interestRate || 0.22,
        minimumMonthlyPayment: Math.max(25, Math.round(choice.debtChange.amount * 0.03)),
        educationalTip: 'Avoid taking on high interest debt during life twists.',
      });
    }
  }
  if (choice.assetBonus) {
    const existing = state.portfolio.find((p) => p.assetId === choice.assetBonus?.assetId);
    if (existing) {
      existing.shares += choice.assetBonus.shares;
    } else {
      state.portfolio.push({
        assetId: choice.assetBonus.assetId,
        shares: choice.assetBonus.shares,
        costBasis: 0,
      });
    }
  }

  state.recentEvents.push({
    month: state.month,
    text: `Decision: ${choice.text}`,
    type: 'info',
  });

  return state;
}

export function executeBuyAsset(
  state: GameState,
  assetId: string,
  dollarAmount: number
): { success: boolean; message: string; nextState: GameState } {
  if (dollarAmount <= 0) return { success: false, message: 'Invalid dollar amount', nextState: state };
  if (state.cash < dollarAmount) {
    return { success: false, message: 'Insufficient cash in checking account', nextState: state };
  }

  const asset = state.assets.find((a) => a.id === assetId);
  if (!asset) return { success: false, message: 'Asset not found', nextState: state };
  if (dollarAmount < asset.minPurchase) {
    return { success: false, message: `Minimum purchase for ${asset.name} is $${asset.minPurchase}`, nextState: state };
  }

  const nextState: GameState = JSON.parse(JSON.stringify(state));
  const sharesToBuy = Math.round((dollarAmount / asset.currentPrice) * 1000) / 1000;
  nextState.cash -= dollarAmount;

  const existing = nextState.portfolio.find((p) => p.assetId === assetId);
  if (existing) {
    const totalCost = existing.costBasis * existing.shares + dollarAmount;
    existing.shares += sharesToBuy;
    existing.costBasis = Math.round((totalCost / existing.shares) * 100) / 100;
  } else {
    nextState.portfolio.push({
      assetId,
      shares: sharesToBuy,
      costBasis: asset.currentPrice,
    });
  }

  soundFx.playCoin();
  return {
    success: true,
    message: `Purchased ${sharesToBuy} shares of ${asset.name} for $${dollarAmount.toLocaleString()}`,
    nextState,
  };
}

export function executeSellAsset(
  state: GameState,
  assetId: string,
  sharesToSell: number
): { success: boolean; message: string; nextState: GameState } {
  const existing = state.portfolio.find((p) => p.assetId === assetId);
  if (!existing || existing.shares < sharesToSell || sharesToSell <= 0) {
    return { success: false, message: 'Insufficient shares to sell', nextState: state };
  }

  const asset = state.assets.find((a) => a.id === assetId);
  if (!asset) return { success: false, message: 'Asset not found', nextState: state };

  const nextState: GameState = JSON.parse(JSON.stringify(state));
  const target = nextState.portfolio.find((p) => p.assetId === assetId)!;
  const proceed = Math.round(sharesToSell * asset.currentPrice);

  target.shares -= sharesToSell;
  if (target.shares <= 0.0001) {
    nextState.portfolio = nextState.portfolio.filter((p) => p.assetId !== assetId);
  }
  nextState.cash += proceed;

  soundFx.playCoin();
  return {
    success: true,
    message: `Sold ${sharesToSell} shares of ${asset.name} for $${proceed.toLocaleString()}`,
    nextState,
  };
}

export function transferCashEmergency(
  state: GameState,
  amount: number,
  direction: 'to_emergency' | 'to_checking'
): { success: boolean; message: string; nextState: GameState } {
  if (amount <= 0) return { success: false, message: 'Invalid amount', nextState: state };

  const nextState: GameState = JSON.parse(JSON.stringify(state));
  if (direction === 'to_emergency') {
    if (nextState.cash < amount) {
      return { success: false, message: 'Insufficient checking cash', nextState: state };
    }
    nextState.cash -= amount;
    nextState.emergencyFund += amount;
    return {
      success: true,
      message: `Deposited $${amount.toLocaleString()} into High-Yield Emergency Fund.`,
      nextState,
    };
  } else {
    if (nextState.emergencyFund < amount) {
      return { success: false, message: 'Insufficient funds in emergency account', nextState: state };
    }
    nextState.emergencyFund -= amount;
    nextState.cash += amount;
    return {
      success: true,
      message: `Transferred $${amount.toLocaleString()} into Checking cash.`,
      nextState,
    };
  }
}

export function payExtraDebt(
  state: GameState,
  debtId: string,
  amount: number
): { success: boolean; message: string; nextState: GameState } {
  if (amount <= 0) return { success: false, message: 'Invalid amount', nextState: state };
  if (state.cash < amount) return { success: false, message: 'Insufficient cash', nextState: state };

  const nextState: GameState = JSON.parse(JSON.stringify(state));
  const debt = nextState.debts.find((d) => d.id === debtId);
  if (!debt) return { success: false, message: 'Debt not found', nextState: state };

  const actualPayment = Math.min(debt.principal, amount);
  debt.principal -= actualPayment;
  nextState.cash -= actualPayment;

  if (debt.principal <= 0) {
    nextState.debts = nextState.debts.filter((d) => d.id !== debtId);
    nextState.character.happiness = Math.min(100, nextState.character.happiness + 5);
    nextState.character.creditScore = Math.min(850, nextState.character.creditScore + 10);
    soundFx.playLevelUp();
    return {
      success: true,
      message: `🎉 Debt Fully Crushed: You paid off ${debt.name}!`,
      nextState,
    };
  }

  soundFx.playClick();
  return {
    success: true,
    message: `Paid $${actualPayment.toLocaleString()} toward ${debt.name}. Remaining: $${Math.round(debt.principal).toLocaleString()}`,
    nextState,
  };
}

export function getNetWorth(state: GameState): number {
  let nw = state.cash + state.emergencyFund + state.retirement.traditional401k + state.retirement.rothIRA;
  for (const pos of state.portfolio) {
    const asset = state.assets.find((a) => a.id === pos.assetId);
    if (asset) {
      nw += pos.shares * asset.currentPrice;
    }
  }
  for (const debt of state.debts) {
    nw -= debt.principal;
  }
  return Math.round(nw);
}

export function getPortfolioValue(state: GameState): number {
  return Math.round(
    state.portfolio.reduce((sum, p) => {
      const asset = state.assets.find((a) => a.id === p.assetId);
      return sum + (asset ? p.shares * asset.currentPrice : 0);
    }, 0)
  );
}

// ----------------- Helpers -----------------

function getNextSentiment(current: MarketSentiment): MarketSentiment {
  const rand = Math.random();
  switch (current) {
    case 'BOOM':
      return rand < 0.4 ? 'BULL' : rand < 0.65 ? 'NORMAL' : 'BEAR';
    case 'BULL':
      return rand < 0.5 ? 'BULL' : rand < 0.75 ? 'BOOM' : rand < 0.9 ? 'NORMAL' : 'BEAR';
    case 'NORMAL':
      return rand < 0.4 ? 'NORMAL' : rand < 0.65 ? 'BULL' : rand < 0.85 ? 'BEAR' : 'STAGFLATION';
    case 'BEAR':
      return rand < 0.4 ? 'BEAR' : rand < 0.7 ? 'NORMAL' : rand < 0.85 ? 'CRASH' : 'BULL';
    case 'CRASH':
      return rand < 0.5 ? 'BEAR' : rand < 0.8 ? 'NORMAL' : 'CRASH';
    case 'STAGFLATION':
      return rand < 0.4 ? 'STAGFLATION' : rand < 0.7 ? 'BEAR' : 'NORMAL';
  }
}

function getRandomHeadline(sentiment: MarketSentiment): string {
  const headlines: Record<MarketSentiment, string[]> = {
    BOOM: [
      'Tech giants post record quarterly profits as AI adoption accelerates globally.',
      'Euphoria sweeps Wall Street; retail investor participation reaches all-time highs.',
      'IPO boom heats up as venture firms ring the opening bell.',
    ],
    BULL: [
      'Consumer confidence surges as corporate earnings beat analyst consensus.',
      'S&P 500 notches fresh record high amid strong labor market figures.',
      'Central bank maintains supportive stance as economic growth stays resilient.',
    ],
    NORMAL: [
      'Markets trade sideways as investors digest employment and GDP data.',
      'Treasury yields stabilize; corporate balance sheets remain well capitalized.',
      'Analysts recommend disciplined dollar-cost averaging in balanced markets.',
    ],
    BEAR: [
      'Tech valuations compress as interest rate expectations remain elevated.',
      'Consumers tighten discretionary budgets; retail sales moderate.',
      'Volatility index (VIX) rises as cautious institutional investors increase cash reserves.',
    ],
    CRASH: [
      'Global equities suffer sharp liquidation shock amid geopolitical tensions.',
      'Bargain hunters spot generational opportunities in blue-chip equities.',
      'Financial educators remind long-term savers: "Market timing destroys wealth."',
    ],
    STAGFLATION: [
      'Commodity price spikes pinch profit margins; central bank in delicate policy bind.',
      'Defensive dividend payers and tangible assets outperform speculative growth.',
      'Supply chain bottlenecks pressure consumer pocketbooks.',
    ],
  };

  const pool = headlines[sentiment] || headlines.NORMAL;
  return pool[Math.floor(Math.random() * pool.length)];
}

function calculateAssetPriceReturn(
  asset: { category: string; volatility: number; expectedAnnualReturn: number },
  sentiment: MarketSentiment,
  months: number
): number {
  const annualT = months / 12;
  const sentimentBias: Record<MarketSentiment, number> = {
    BOOM: 0.12,
    BULL: 0.06,
    NORMAL: 0.0,
    BEAR: -0.08,
    CRASH: -0.22,
    STAGFLATION: -0.05,
  };

  // Higher beta assets feel sentiment more intensely
  const beta = asset.category === 'CRYPTO' ? 2.5 :
               asset.category === 'TECH_GROWTH' ? 1.6 :
               asset.category === 'STARTUP_EQUITY' ? 2.0 :
               asset.category === 'BLUE_CHIP' ? 0.9 :
               asset.category === 'GOV_BOND' ? 0.2 : 1.0;

  const drift = (asset.expectedAnnualReturn + sentimentBias[sentiment] * beta) * annualT;
  const shock = (Math.random() - 0.5) * 2 * asset.volatility * Math.sqrt(annualT);
  return drift + shock;
}

function pickRandomTwistEvent(state: GameState): TwistEvent | null {
  // Combine base events + active expansion pack events
  const allEvents = [...BASE_TWIST_EVENTS];
  const activePacks = expansionManager.getActivePacks();
  for (const pack of activePacks) {
    if (pack.events) {
      allEvents.push(...pack.events);
    }
  }

  // Filter valid events
  const valid = allEvents.filter((e) => !e.condition || e.condition(state));
  if (valid.length === 0) return null;

  // 75% chance of triggering an event on turn advance to keep game pacing active!
  if (Math.random() > 0.75) return null;

  return valid[Math.floor(Math.random() * valid.length)];
}
