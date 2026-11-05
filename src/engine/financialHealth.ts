import { FinancialHealthGrade, GameState } from '../types/game';

export function calculateFinancialHealth(state: GameState): FinancialHealthGrade {
  // Monthly basic burn estimate
  const monthlySalary = state.character.annualSalary / 12;
  const lifestyleExpenseRatio = 
    state.character.lifestyleLevel === 'FRUGAL' ? 0.35 :
    state.character.lifestyleLevel === 'BALANCED' ? 0.50 :
    state.character.lifestyleLevel === 'COMFORTABLE' ? 0.65 : 0.85;

  const basicMonthlyExpenses = monthlySalary * lifestyleExpenseRatio;
  
  // Emergency buffer in months
  const emergencyBufferMonths = basicMonthlyExpenses > 0 
    ? Math.round((state.emergencyFund / basicMonthlyExpenses) * 10) / 10 
    : 0;

  // Total debt
  const totalDebt = state.debts.reduce((acc, d) => acc + d.principal, 0);
  const totalHighInterestDebt = state.debts
    .filter((d) => d.interestRate >= 0.12)
    .reduce((acc, d) => acc + d.principal, 0);

  // Debt to income ratio (annual)
  const debtToIncomeRatio = state.character.annualSalary > 0 
    ? Math.round((totalDebt / state.character.annualSalary) * 100) / 100 
    : 0;

  // Monthly savings rate estimate
  const netWorthHistory = state.history;
  let savingsRate = 0.15;
  if (netWorthHistory.length >= 2) {
    const last = netWorthHistory[netWorthHistory.length - 1];
    const prev = netWorthHistory[netWorthHistory.length - 2];
    const diff = last.netWorth - prev.netWorth;
    const periodIncome = (state.character.annualSalary / 12) * state.turnDurationMonths;
    savingsRate = periodIncome > 0 ? Math.max(0, Math.min(1, diff / periodIncome)) : 0;
  }

  // Diversification score (0 - 100)
  const totalPortfolio = state.portfolio.reduce((sum, p) => {
    const asset = state.assets.find((a) => a.id === p.assetId);
    return sum + (asset ? p.shares * asset.currentPrice : 0);
  }, 0);

  const categories = new Set(
    state.portfolio
      .filter((p) => p.shares > 0)
      .map((p) => state.assets.find((a) => a.id === p.assetId)?.category)
      .filter(Boolean)
  );

  let diversificationScore = Math.min(100, categories.size * 25);
  if (totalPortfolio === 0) diversificationScore = 20;

  // Calculate score out of 100
  let score = 50;

  // Emergency buffer points (max 25)
  if (emergencyBufferMonths >= 6) score += 25;
  else if (emergencyBufferMonths >= 3) score += 20;
  else if (emergencyBufferMonths >= 1) score += 10;
  else score -= 10;

  // High interest debt penalty (max -30)
  if (totalHighInterestDebt > 5000) score -= 30;
  else if (totalHighInterestDebt > 0) score -= 15;
  else score += 20; // zero high-interest debt bonus!

  // Retirement & Investing points (max 25)
  const hasInvestments = totalPortfolio > 5000 || state.retirement.traditional401k > 5000;
  if (hasInvestments) score += 15;
  if (state.retirement.employee401kContributionPct >= state.retirement.employerMatchLimitPct) {
    score += 10;
  }

  // Happiness & Health buffer (max 10)
  if (state.character.happiness > 75 && state.character.health > 75) score += 10;
  else if (state.character.happiness < 40 || state.character.health < 40) score -= 15;

  score = Math.max(10, Math.min(100, Math.round(score)));

  let grade: FinancialHealthGrade['grade'] = 'C';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 58) grade = 'C';
  else if (score >= 45) grade = 'D';
  else grade = 'F';

  // Recommendations
  const recommendations: string[] = [];
  if (totalHighInterestDebt > 0) {
    recommendations.push(`🔥 Destroy high-interest debt first ($${Math.round(totalHighInterestDebt).toLocaleString()} at 12%+ APR) using the Avalanche method.`);
  }
  if (emergencyBufferMonths < 3) {
    recommendations.push(`🛡️ Build your High-Yield Savings emergency buffer to at least 3-6 months (currently at ${emergencyBufferMonths} months).`);
  }
  if (state.retirement.employee401kContributionPct < state.retirement.employerMatchLimitPct) {
    recommendations.push(`🎁 Increase 401(k) contribution to at least ${Math.round(state.retirement.employerMatchLimitPct * 100)}% to capture free employer match money.`);
  }
  if (totalPortfolio === 0 && emergencyBufferMonths >= 3) {
    recommendations.push(`📈 Put your excess savings to work: start dollar-cost averaging into a broad low-cost index fund (e.g. S&P 500).`);
  }
  if (categories.size < 2 && totalPortfolio > 10000) {
    recommendations.push(`🌐 Diversify across asset classes (equities, bonds, real estate REITs, international).`);
  }
  if (state.character.happiness < 50) {
    recommendations.push(`🧘 Dangerously low happiness! Don't forget that money exists to support a vibrant, joyful life.`);
  }

  if (recommendations.length === 0) {
    recommendations.push(`🌟 Outstanding financial health! Continue staying the course and letting compound interest do the heavy lifting.`);
  }

  return {
    grade,
    score,
    emergencyBufferMonths,
    debtToIncomeRatio,
    savingsRate: Math.round(savingsRate * 100),
    diversificationScore,
    summary: getGradeSummary(grade),
    recommendations,
  };
}

function getGradeSummary(grade: string): string {
  switch (grade) {
    case 'A+': return 'Financial Mastermind: Fort Knox safety, healthy cashflows, and compounding empire.';
    case 'A': return 'Excellent Financial Health: High resilience, productive investments, and controlled debts.';
    case 'B': return 'Solid Position: Good trajectory, with minor room for optimization in debt or investing.';
    case 'C': return 'Average / Fragile: Vulnerable to unexpected shocks; needs a stronger emergency cushion.';
    case 'D': return 'At Risk: High debt burden or low cash buffer threatening stability.';
    case 'F': return 'Financial Emergency: Immediate triage required to eliminate toxic interest and rebuild cash.';
    default: return 'Evaluating financial status...';
  }
}
