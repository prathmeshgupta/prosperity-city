import { AcademyLesson } from '../types/game';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson_compounding_72',
    title: 'The Magic of Compounding & Rule of 72',
    tagline: 'How money doubles quietly while you sleep',
    category: 'BASICS',
    icon: '⏳',
    readTime: '3 min',
    content: {
      headline: 'Compound interest is the eighth wonder of the world.',
      sections: [
        {
          heading: 'Linear vs. Exponential Growth',
          body: 'When you work a job, you earn linear income: 1 hour worked = 1 hour paid. But when your money earns interest, and that interest earns its own interest, growth transforms from a straight line into an exponential hockey stick curve.',
          takeaway: 'Time in the market is vastly more powerful than timing the market. Starting 10 years earlier matters more than doubling your savings later.',
          diagramType: 'rule72',
        },
        {
          heading: 'The Rule of 72 Mental Shortcut',
          body: 'Want to know how many years it takes for your investment to double? Divide 72 by your expected annual return percentage. At 7% return, your money doubles every 10.3 years (72 ÷ 7). At 10% return (the historical S&P 500 average), your money doubles every 7.2 years! Over a 36-year career, $10,000 doubles 5 times into $320,000 without adding another penny.',
          takeaway: '72 ÷ Annual Return % = Years to Double your wealth.',
        },
      ],
    },
    quiz: {
      question: 'Using the Rule of 72, if you invest $5,000 at an 8% annual return, approximately how long will it take to double to $10,000?',
      options: ['12 years', '9 years', '5 years', '18 years'],
      correctIndex: 1, // 72 / 8 = 9
      explanation: 'Correct! 72 divided by 8 equals 9 years. If you leave it for 18 years, it doubles again to $20,000, and in 27 years to $40,000!',
    },
    xpReward: 100,
  },
  {
    id: 'lesson_debt_avalanche_snowball',
    title: 'Debt Annihilation: Avalanche vs. Snowball',
    tagline: 'Escape high-interest traps and free your cashflow',
    category: 'DEBT',
    icon: '⚡',
    readTime: '4 min',
    content: {
      headline: 'Not all debt is equal: high-interest consumer debt is financial poison.',
      sections: [
        {
          heading: 'The Debt Avalanche (Mathematically Optimal)',
          body: 'Order all your debts from highest interest rate to lowest. Pay minimum payments on everything except the debt with the highest APR (like a 24% credit card). Attack it with every spare dollar until eliminated, then roll that payment into the next highest rate.',
          takeaway: 'Saves the most total money in interest and gets you out of debt the fastest in mathematical theory.',
          diagramType: 'snowball',
        },
        {
          heading: 'The Debt Snowball (Psychological Momentum)',
          body: 'Order debts by smallest balance first, ignoring the interest rate. Knock out the $400 medical bill first, then the $1,200 store card. Every closed account gives a psychological endorphin hit and builds unstoppable momentum.',
          takeaway: 'Behavioral psychology often beats pure math. The best debt payoff method is the one you actually stick with!',
        },
      ],
    },
    quiz: {
      question: 'You have: Debt A ($8,000 at 5% APR) and Debt B ($2,500 at 24% APR). Which does the Debt Avalanche method prioritize first?',
      options: [
        'Debt A because it is the largest balance',
        'Debt B because 24% is the highest interest rate',
        'Both equally 50/50',
        'Neither, invest in stocks first',
      ],
      correctIndex: 1,
      explanation: 'Spot on! The Avalanche method prioritizes the highest interest rate first (Debt B at 24%) because it is destroying your wealth the fastest.',
    },
    xpReward: 120,
  },
  {
    id: 'lesson_emergency_fund',
    title: 'The Sleep-at-Night Emergency Buffer',
    tagline: 'Your bulletproof shield against unexpected life chaos',
    category: 'BASICS',
    icon: '🛡️',
    readTime: '3 min',
    content: {
      headline: 'An emergency fund is not an investment; it is an insurance policy against panic.',
      sections: [
        {
          heading: 'Why 3 to 6 Months of Living Expenses?',
          body: 'If you lose your job, have a sudden surgery, or your transmission blows up, a fully funded emergency fund in a High-Yield Savings Account (HYSA) prevents you from liquidating stocks at a market bottom or swiping 24% credit cards in desperation.',
          takeaway: 'Keep this money liquid, safe, and FDIC-insured. Do NOT invest emergency money into volatile stocks or crypto.',
          diagramType: 'emergency',
        },
      ],
    },
    quiz: {
      question: 'Where is the best place to keep your 3-6 month emergency fund?',
      options: [
        'In a High-Yield Savings Account (HYSA) or Money Market Fund',
        'In high-growth tech stocks to maximize returns',
        'Locked in physical real estate',
        'Under your mattress in cash',
      ],
      correctIndex: 0,
      explanation: 'Exactly! Emergency funds must be liquid and capital-protected. A High-Yield Savings Account pays safe interest while keeping funds accessible within 24 hours.',
    },
    xpReward: 100,
  },
  {
    id: 'lesson_index_vs_active',
    title: "Warren Buffett's Bet: Index Funds vs Wall St",
    tagline: 'Why boring low-cost index funds beat 90% of hedge funds',
    category: 'INVESTING',
    icon: '🏛️',
    readTime: '4 min',
    content: {
      headline: 'In 2007, Warren Buffett wagered $1,000,000 that an S&P 500 index fund would beat a basket of elite hedge funds over 10 years. He won by a landslide.',
      sections: [
        {
          heading: 'The Devastating Impact of Fees',
          body: 'Active hedge funds charge "2 and 20" (2% annual management fee plus 20% of profits). A low-cost index fund (like VOO or VTI) charges ~0.03%. Over 30 years, a 2% fee eats up over ONE THIRD of your total potential retirement portfolio!',
          takeaway: 'You get what you don’t pay for. In investing, costs directly subtract from compound growth.',
          diagramType: 'feeImpact',
        },
      ],
    },
    quiz: {
      question: 'Over a 30-year investing horizon, what happens if you pay a 2% annual management fee compared to a 0.03% index fund fee?',
      options: [
        'It has virtually no impact on your final balance',
        'It consumes over 30% to 40% of your total lifetime portfolio value',
        'The manager will always outperform to make up the difference',
        'It guarantees higher returns by federal law',
      ],
      correctIndex: 1,
      explanation: 'Correct! Compounding works in reverse with fees. A 2% annual fee compounds year after year, stripping away hundreds of thousands of dollars in final wealth.',
    },
    xpReward: 150,
  },
  {
    id: 'lesson_inflation_silent_thief',
    title: 'Inflation: The Silent Wealth Destroyer',
    tagline: 'Why keeping all your cash in a checking account guarantees loss',
    category: 'INVESTING',
    icon: '💸',
    readTime: '3 min',
    content: {
      headline: 'Cash is not risk-free: inflation guarantees that $100 today buys less tomorrow.',
      sections: [
        {
          heading: 'Purchasing Power Erosion',
          body: 'At a typical 3.5% annual inflation rate, prices double roughly every 20 years. That means $100,000 sitting in a 0.01% checking account will lose half its real purchasing power by the time you retire.',
          takeaway: 'Investing is not just about getting rich—it is required just to stay afloat and defend your purchasing power.',
          diagramType: 'inflation',
        },
      ],
    },
    quiz: {
      question: 'If annual inflation is 4% and your checking account pays 0.05% interest, what is your real purchasing power return each year?',
      options: ['+4.05%', '-3.95% (losing purchasing power)', '+0.05%', '0% break even'],
      correctIndex: 1,
      explanation: 'Bingo! Real return = Interest minus Inflation (0.05% - 4% = -3.95%). You are quietly losing nearly 4% of your buying power every year.',
    },
    xpReward: 100,
  },
  {
    id: 'lesson_fire_number',
    title: 'The FIRE Movement & The 4% Rule',
    tagline: 'Calculate your exact Financial Independence number',
    category: 'RETIREMENT',
    icon: '🔥',
    readTime: '4 min',
    content: {
      headline: 'Financial Independence is when your invested assets generate enough passive income to cover your living expenses forever.',
      sections: [
        {
          heading: 'The Trinity Study & The 25x Rule',
          body: 'Based on 100 years of market data, the 4% Safe Withdrawal Rule shows that if you withdraw 4% of your diversified portfolio each year (adjusted for inflation), your money has a 95%+ probability of surviving 30+ years without running out.',
          takeaway: 'Your FIRE Freedom Number = Your Annual Expenses × 25. If you spend $40,000/year, your freedom number is $1,000,000.',
        },
      ],
    },
    quiz: {
      question: 'If your family needs $50,000 per year to live comfortably, what is your target FIRE portfolio based on the 4% rule (25x expenses)?',
      options: ['$500,000', '$1,250,000', '$2,500,000', '$750,000'],
      correctIndex: 1, // 50,000 * 25 = 1,250,000
      explanation: 'You got it! $50,000 × 25 = $1,250,000. 4% of $1.25M is $50,000/year in passive withdrawals.',
    },
    xpReward: 180,
  },
];
