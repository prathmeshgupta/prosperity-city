/**
 * CFA® Candidate Body of Knowledge (CBOK) - Capital Markets & Macroeconomic Engine
 * Covers:
 * 1. Yield Curve Regimes (Normal, Flat, Inverted, Steepening)
 * 2. Fed Funds Target Rates, FOMC Policy Decisions & CPI Inflation
 * 3. Fixed Income Math: Modified Duration, Convexity, and Tax-Equivalent Yield
 * 4. Multi-Asset Pricing & Factor Tilts (Fama-French Value/Size, TIPS, Munis, REITs, Gold, Crypto)
 * 5. Derivative Strategies (Protective Puts & Covered Calls)
 */

import { MarketSentiment } from '../../types/game';

export type YieldCurveRegime = 'NORMAL' | 'FLAT' | 'INVERTED' | 'STEEPENING';

export interface YieldCurvePoints {
  threeMonth: number; // 3-Month T-Bill (short rate)
  twoYear: number;    // 2-Year Treasury Note
  tenYear: number;    // 10-Year Treasury Bond (benchmark)
  thirtyYear: number; // 30-Year Treasury Bond (long bond)
  regime: YieldCurveRegime;
  spread10y3m: number; // tenYear - threeMonth (negative = inverted)
  recessionProbability: number; // 0% - 100%
}

export interface MacroIndicators {
  fedFundsRate: number;      // e.g. 0.0525 (5.25%)
  cpiInflationRate: number;  // e.g. 0.031 (3.1%)
  realInterestRate: number;  // fedFundsRate - cpiInflationRate
  gdpGrowthRate: number;     // e.g. 0.024 (2.4%)
  yieldCurve: YieldCurvePoints;
  fomcPolicyBias: 'HAWKISH' | 'NEUTRAL' | 'DOVISH';
}

/**
 * Computes current yield curve points based on Fed rate, inflation, and market sentiment
 */
export function calculateYieldCurve(
  fedFundsRate: number,
  cpiInflationRate: number,
  sentiment: MarketSentiment
): YieldCurvePoints {
  let threeMonth = fedFundsRate;
  let twoYear = fedFundsRate;
  let tenYear = fedFundsRate;
  let thirtyYear = fedFundsRate;
  let regime: YieldCurveRegime = 'NORMAL';

  switch (sentiment) {
    case 'BOOM':
      // Late cycle or strong growth: Fed hiking, short rates high, yield curve flattening or inverted
      threeMonth = fedFundsRate;
      twoYear = fedFundsRate - 0.002;
      tenYear = fedFundsRate - 0.006; // inverted!
      thirtyYear = fedFundsRate - 0.004;
      regime = 'INVERTED';
      break;

    case 'BULL':
      // Healthy economic expansion: classic upward-sloping normal yield curve
      threeMonth = Math.max(0.015, fedFundsRate - 0.008);
      twoYear = fedFundsRate - 0.003;
      tenYear = fedFundsRate + 0.006;
      thirtyYear = fedFundsRate + 0.012;
      regime = 'NORMAL';
      break;

    case 'NORMAL':
      threeMonth = fedFundsRate;
      twoYear = fedFundsRate + 0.002;
      tenYear = fedFundsRate + 0.005;
      thirtyYear = fedFundsRate + 0.009;
      regime = 'NORMAL';
      break;

    case 'BEAR':
      // Flat or inverted heading into downturn
      threeMonth = fedFundsRate;
      twoYear = fedFundsRate + 0.001;
      tenYear = fedFundsRate - 0.002;
      thirtyYear = fedFundsRate + 0.001;
      regime = 'FLAT';
      break;

    case 'CRASH':
      // Fed emergency cutting rates: short rates plummet, curve steepens sharply
      threeMonth = Math.max(0.005, fedFundsRate - 0.025);
      twoYear = Math.max(0.01, fedFundsRate - 0.015);
      tenYear = fedFundsRate - 0.005;
      thirtyYear = fedFundsRate + 0.008;
      regime = 'STEEPENING';
      break;

    case 'STAGFLATION':
      // High inflation with sluggish growth: high yields across all maturities
      threeMonth = Math.max(0.055, cpiInflationRate + 0.01);
      twoYear = threeMonth + 0.004;
      tenYear = threeMonth + 0.008;
      thirtyYear = threeMonth + 0.012;
      regime = 'NORMAL';
      break;
  }

  const spread10y3m = Math.round((tenYear - threeMonth) * 10000) / 10000;
  
  // Historical Estrella-Mishkin recession probability model from 10y-3m Treasury spread
  let recessionProbability = 0.15;
  if (spread10y3m < -0.01) recessionProbability = 0.85;
  else if (spread10y3m < -0.005) recessionProbability = 0.70;
  else if (spread10y3m < 0) recessionProbability = 0.55;
  else if (spread10y3m < 0.005) recessionProbability = 0.35;
  else recessionProbability = 0.12;

  return {
    threeMonth: Math.round(threeMonth * 10000) / 10000,
    twoYear: Math.round(twoYear * 10000) / 10000,
    tenYear: Math.round(tenYear * 10000) / 10000,
    thirtyYear: Math.round(thirtyYear * 10000) / 10000,
    regime,
    spread10y3m,
    recessionProbability,
  };
}

/**
 * CFA Fixed Income Price Sensitivity Formula
 * ΔP / P ≈ -Duration * Δy + 0.5 * Convexity * (Δy)^2
 */
export function calculateBondPriceChange(
  durationYears: number,
  convexity: number = 25,
  yieldChangePct: number // e.g. +0.01 for +100bps yield hike
): number {
  const durationImpact = -durationYears * yieldChangePct;
  const convexityImpact = 0.5 * convexity * Math.pow(yieldChangePct, 2);
  return durationImpact + convexityImpact;
}

/**
 * Municipal Bond Tax-Equivalent Yield (TEY) Formula:
 * TEY = Tax-Exempt Muni Yield / (1 - Marginal Tax Rate)
 */
export function calculateTaxEquivalentYield(
  muniYield: number,
  federalMarginalTaxRate: number,
  stateTaxRate: number = 0
): number {
  const combinedTaxRate = federalMarginalTaxRate + stateTaxRate;
  if (combinedTaxRate >= 1) return muniYield * 2;
  return muniYield / (1 - combinedTaxRate);
}

/**
 * TIPS (Treasury Inflation-Protected Securities) Total Return
 * Real Yield + Principal Adjustment based on CPI inflation
 */
export function calculateTIPSReturn(
  realYield: number,
  cpiInflationRate: number,
  months: number
): number {
  const annualFraction = months / 12;
  const realYieldReturn = realYield * annualFraction;
  const inflationPrincipalAdjustment = cpiInflationRate * annualFraction;
  return realYieldReturn + inflationPrincipalAdjustment;
}

/**
 * CFA Capital Asset Pricing Model (CAPM) Expected Return:
 * E(R_i) = R_f + Beta_i * (E(R_m) - R_f)
 */
export function calculateCAPMExpectedReturn(
  riskFreeRate: number,
  marketExpectedReturn: number,
  beta: number
): number {
  const marketRiskPremium = marketExpectedReturn - riskFreeRate;
  return riskFreeRate + beta * marketRiskPremium;
}

/**
 * Fama-French 3-Factor Model Expected Return:
 * E(R_i) = R_f + b_i * (R_m - R_f) + s_i * SMB + h_i * HML
 * Used for AVUV Small-Cap Value premium
 */
export function calculateFamaFrenchExpectedReturn(
  riskFreeRate: number,
  marketRiskPremium: number,
  beta: number,
  smbPremium: number = 0.025, // Small minus Big premium
  hmlPremium: number = 0.032  // High minus Low (Value) premium
): number {
  return riskFreeRate + beta * marketRiskPremium + 0.8 * smbPremium + 0.7 * hmlPremium;
}

/**
 * Option Hedging & Income Calculations
 */
export interface DerivativeStrategyResult {
  strategy: 'PROTECTIVE_PUT' | 'COVERED_CALL';
  costBasisImpact: number;
  unhedgedReturn: number;
  hedgedReturn: number;
  strikePrice: number;
  premiumAmount: number;
  educationalTakeaway: string;
}

export function evaluateProtectivePut(
  currentStockPrice: number,
  priceChangePct: number,
  strikePct: number = 0.90, // 90% floor protection
  putPremiumPct: number = 0.025 // 2.5% premium cost
): DerivativeStrategyResult {
  const strikePrice = currentStockPrice * strikePct;
  const rawPriceAfter = currentStockPrice * (1 + priceChangePct);
  const premiumAmount = currentStockPrice * putPremiumPct;

  // With a put, your stock price cannot fall below the strike price (the put pays the difference)
  const effectivePriceAfter = Math.max(rawPriceAfter, strikePrice) - premiumAmount;
  const hedgedReturn = (effectivePriceAfter - currentStockPrice) / currentStockPrice;

  return {
    strategy: 'PROTECTIVE_PUT',
    costBasisImpact: premiumAmount,
    unhedgedReturn: priceChangePct,
    hedgedReturn,
    strikePrice,
    premiumAmount,
    educationalTakeaway:
      priceChangePct < -0.10
        ? `A market plunge occurred (${(priceChangePct * 100).toFixed(1)}%), but your Protective Put capped your loss at -10% + option cost! Net return: ${(hedgedReturn * 100).toFixed(1)}%.`
        : `Your portfolio grew (${(priceChangePct * 100).toFixed(1)}%), but you paid ${(putPremiumPct * 100).toFixed(1)}% as an insurance premium. Net return: ${(hedgedReturn * 100).toFixed(1)}%.`,
  };
}

export function evaluateCoveredCall(
  currentStockPrice: number,
  priceChangePct: number,
  strikePct: number = 1.05, // 5% cap upside
  callPremiumIncomePct: number = 0.018 // 1.8% income collected
): DerivativeStrategyResult {
  const strikePrice = currentStockPrice * strikePct;
  const rawPriceAfter = currentStockPrice * (1 + priceChangePct);
  const premiumIncome = currentStockPrice * callPremiumIncomePct;

  // Stock upside capped at strike price
  const stockCappedPrice = Math.min(rawPriceAfter, strikePrice) + premiumIncome;
  const hedgedReturn = (stockCappedPrice - currentStockPrice) / currentStockPrice;

  return {
    strategy: 'COVERED_CALL',
    costBasisImpact: -premiumIncome,
    unhedgedReturn: priceChangePct,
    hedgedReturn,
    strikePrice,
    premiumAmount: premiumIncome,
    educationalTakeaway:
      priceChangePct > 0.05
        ? `Stock rocketed +${(priceChangePct * 100).toFixed(1)}%, but your shares were called away at the 5% cap. You pocketed the 1.8% premium, totaling +${(hedgedReturn * 100).toFixed(1)}%.`
        : `Stock was flat or slightly down (${(priceChangePct * 100).toFixed(1)}%). The 1.8% call premium buffered your position, boosting return to ${(hedgedReturn * 100).toFixed(1)}%.`,
  };
}
