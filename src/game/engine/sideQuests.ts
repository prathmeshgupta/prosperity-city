export interface SideQuestChoice {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CitizenSideQuest {
  id: string;
  npcId: string;
  npcName: string;
  npcAvatar: string;
  npcRole: string;
  title: string;
  category: 'INVESTING' | 'BUDGETING' | 'TAX' | 'REAL_ESTATE' | 'SCAM_PREVENTION' | 'CAREER' | 'INSURANCE';
  dilemma: string;
  choices: SideQuestChoice[];
  rewardCash: number;
  rewardXP: number;
  takeaway: string;
  isCompleted?: boolean;
}

export const CITIZEN_SIDE_QUESTS: CitizenSideQuest[] = [
  // 1. Aunt Penny: CD vs HYSA Liquidity
  {
    id: 'quest_penny_cd',
    npcId: 'npc_penny',
    npcName: 'Aunt Penny',
    npcAvatar: '👵',
    npcRole: 'Frugal Compounding Matriarch',
    title: 'The 12-Month CD vs. Liquid Emergency Fund',
    category: 'BUDGETING',
    dilemma: 'My dear, the bank is offering a 5.0% 12-Month Certificate of Deposit (CD), while my High-Yield Savings Account pays 4.5% APY. Should I lock my entire 6-month emergency fund into the CD for the extra 0.5% yield?',
    choices: [
      {
        text: 'Lock it all in the CD! 5.0% is higher than 4.5%, extra yield is always king.',
        isCorrect: false,
        explanation: 'If a surprise car breakdown or medical emergency happens in month 3, you will face harsh early withdrawal penalties that wipe out your interest!',
      },
      {
        text: 'Keep 3 to 6 months in the liquid 4.5% HYSA! Only lock excess savings into the CD. Liquidity is the true purpose of an emergency fund.',
        isCorrect: true,
        explanation: 'Spot on! Emergency reserves are an insurance policy, not an investment vehicle. Sacrificing liquidity for 0.5% extra yield is a trap.',
      },
    ],
    rewardCash: 300,
    rewardXP: 80,
    takeaway: 'Emergency funds exist for peace of mind and immediate liquidity, not maximizing yield. Never lock your core safety net behind penalty walls.',
  },

  // 2. Aunt Penny: Lifestyle Inflation & The 50% Rule
  {
    id: 'quest_penny_inflation',
    npcId: 'npc_penny',
    npcName: 'Aunt Penny',
    npcAvatar: '👵',
    npcRole: 'Frugal Compounding Matriarch',
    title: 'Taming the Lifestyle Creep Beast',
    category: 'BUDGETING',
    dilemma: 'My neighbor just got a $12,000 raise and immediately upgraded to a luxury car lease and expensive condo. Now they are living paycheck to paycheck again! How do smart savers handle raises?',
    choices: [
      {
        text: 'Apply the 50% Rule: Save and invest 50% of the raise, and enjoy the other 50% guilt-free.',
        isCorrect: true,
        explanation: 'Brilliant! The 50% rule lets you celebrate your hard work while permanently increasing your automated investment rate.',
      },
      {
        text: 'Spend it all immediately because inflation will erode the cash anyway.',
        isCorrect: false,
        explanation: 'Lifestyle inflation without asset accumulation guarantees you must work until old age with zero financial buffer.',
      },
    ],
    rewardCash: 350,
    rewardXP: 90,
    takeaway: 'Every raise is an opportunity to accelerate your FIRE date. Automating half of every increase preserves your freedom.',
  },

  // 3. Trader Chad: 90/10 Rule vs Meme Coins
  {
    id: 'quest_chad_meme',
    npcId: 'npc_chad',
    npcName: 'Trader Chad',
    npcAvatar: '📈',
    npcRole: 'Exchange Veteran & Index Advocate',
    title: 'The Viral 100x Meme Coin Dilemma',
    category: 'INVESTING',
    dilemma: 'Bro! A new viral coin called $ROCKETDOGE is trending on Twitter and up 400% today. A bunch of influencers say it is guaranteed to 100x this week. Should I put my $10,000 retirement portfolio into it?',
    choices: [
      {
        text: 'All in! If it 100x’s, you can retire tomorrow. You only live once!',
        isCorrect: false,
        explanation: 'When parabolic meme coins crash, they typically drop 95% to 99% in 48 hours. Concentrated speculative bets destroy portfolios.',
      },
      {
        text: 'Follow the 90/10 Core-Satellite Rule: 90% in broad index funds, and at most 10% in high-risk speculative plays that you are prepared to lose completely.',
        isCorrect: true,
        explanation: 'Smart discipline! The Core-Satellite strategy ensures your core wealth compounds reliably while satisfying any speculative itch safely.',
      },
    ],
    rewardCash: 400,
    rewardXP: 100,
    takeaway: 'Never bet essential retirement capital on speculative trends. The 90/10 rule shields your future while capping risk.',
  },

  // 4. Trader Chad: Bear Market Psychology
  {
    id: 'quest_chad_bear',
    npcId: 'npc_chad',
    npcName: 'Trader Chad',
    npcAvatar: '📈',
    npcRole: 'Exchange Veteran & Index Advocate',
    title: 'Surviving the 25% Market Drop',
    category: 'INVESTING',
    dilemma: 'The headlines are screaming recession, inflation is high, and the S&P 500 is down 22% this quarter. My coworker sold all their index funds into cash to "wait for the dust to settle". What should an intelligent investor do?',
    choices: [
      {
        text: 'Sell to cash like the coworker so you stop seeing red numbers on your screen.',
        isCorrect: false,
        explanation: 'Selling during a panic locks in permanent losses. History proves the stock market has recovered from 100% of bear markets.',
      },
      {
        text: 'Keep Dollar-Cost Averaging! Market downturns are generational sales where your dollars buy top companies at a 22% discount.',
        isCorrect: true,
        explanation: 'Masterful investor psychology! Warren Buffett famously said: "Be greedy when others are fearful." Bear markets make future millionaires.',
      },
    ],
    rewardCash: 500,
    rewardXP: 120,
    takeaway: 'Timing market bottoms is impossible. Automated Dollar-Cost Averaging through crashes builds legendary compounding power.',
  },

  // 5. Dr. Shield: HSA Triple-Tax Advantage
  {
    id: 'quest_shield_hsa',
    npcId: 'npc_shield',
    npcName: 'Dr. Shield',
    npcAvatar: '🩺',
    npcRole: 'Chief Medical Officer',
    title: 'The Secret Triple-Tax Super Account',
    category: 'TAX',
    dilemma: 'A patient is enrolled in a High-Deductible Health Plan (HDHP) and has the option to open a Health Savings Account (HSA). They think it is just a normal medical savings account that expires every year. What is the truth?',
    choices: [
      {
        text: 'They are confusing it with an FSA! An HSA never expires, rolls over indefinitely, and has a Triple Tax Advantage (tax-deductible in, tax-free growth, tax-free out for healthcare).',
        isCorrect: true,
        explanation: 'Exactly! An HSA is actually the most tax-advantaged investment vehicle in America. You can invest the balance in index funds for decades.',
      },
      {
        text: 'They are right—use it or lose it by December 31st or the government takes it.',
        isCorrect: false,
        explanation: 'Flexible Spending Accounts (FSAs) expire, but HSAs belong to you for life! HSAs can be invested and compound tax-free into retirement.',
      },
    ],
    rewardCash: 450,
    rewardXP: 110,
    takeaway: 'The HSA is the only account in the US tax code with a Triple Tax Shield. Investing your HSA balance builds an invincible retirement healthcare moat.',
  },

  // 6. Banker Sterling: Mortgage Amortization
  {
    id: 'quest_sterling_mortgage',
    npcId: 'npc_sterling',
    npcName: 'Banker Sterling',
    npcAvatar: '🤵',
    npcRole: 'Senior Vice President of Prosperity Bank',
    title: 'The 15-Year vs. 30-Year Fixed Mortgage Dilemma',
    category: 'REAL_ESTATE',
    dilemma: 'A homebuyer is shopping for a $300,000 mortgage. The 15-year loan has a monthly payment of $2,450, while the 30-year loan is only $1,750. What is the fundamental financial trade-off?',
    choices: [
      {
        text: 'The 30-year gives you greater monthly cashflow flexibility; the 15-year saves hundreds of thousands in total interest over time.',
        isCorrect: true,
        explanation: 'Spot on! The 15-year cuts total interest drastically, but the 30-year provides a safety cushion during unexpected cashflow shocks.',
      },
      {
        text: 'There is zero difference because the interest rate is identical.',
        isCorrect: false,
        explanation: 'Because amortization compounds over 30 years vs 15 years, a 30-year loan often costs more than double the total interest payments!',
      },
    ],
    rewardCash: 400,
    rewardXP: 95,
    takeaway: 'Understand amortization schedules. Taking a 30-year mortgage for cashflow safety while making voluntary extra principal payments offers the best of both worlds.',
  },

  // 7. Banker Sterling: Debt Avalanche vs Snowball
  {
    id: 'quest_sterling_avalanche',
    npcId: 'npc_sterling',
    npcName: 'Banker Sterling',
    npcAvatar: '🤵',
    npcRole: 'Senior Vice President of Prosperity Bank',
    title: 'Mathematical Avalanche vs. Psychological Snowball',
    category: 'BUDGETING',
    dilemma: 'A client has 3 debts: a $500 medical bill at 0%, a $3,000 credit card at 24%, and an $8,000 student loan at 6%. How should they prioritize paying them off?',
    choices: [
      {
        text: 'Debt Avalanche: Attack the 24% credit card first to save the most money mathematically.',
        isCorrect: true,
        explanation: 'Mathematically optimal! Paying off a 24% card is identical to earning a guaranteed 24% risk-free return on your money.',
      },
      {
        text: 'Pay equal amounts across all three regardless of interest rates.',
        isCorrect: false,
        explanation: 'Ignoring interest rates lets high-interest balances compound out of control.',
      },
    ],
    rewardCash: 350,
    rewardXP: 85,
    takeaway: 'The Debt Avalanche saves the most money in interest, while the Debt Snowball provides quick psychological wins. Choose the one you can stick to!',
  },

  // 8. Shady Sam: Spotting Ponzi Schemes
  {
    id: 'quest_sam_ponzi',
    npcId: 'npc_sam',
    npcName: 'Shady Sam',
    npcAvatar: '🕶️',
    npcRole: 'The Alley Hustler',
    title: 'The "Guaranteed 25% Monthly Yield" Red Flag',
    category: 'SCAM_PREVENTION',
    dilemma: 'An online platform promises "Guaranteed 25% monthly passive income through proprietary AI crypto arbitrage with zero risk of loss". What is the definitive red flag?',
    choices: [
      {
        text: 'It sounds completely legitimate because AI is capable of anything nowadays.',
        isCorrect: false,
        explanation: 'Scammers frequently use tech buzzwords like "AI" and "Quantum" to disguise classic Ponzi schemes where new money pays old investors.',
      },
      {
        text: 'Any claim of "Guaranteed" high returns with "Zero Risk" is the textbook definition of investment fraud.',
        isCorrect: true,
        explanation: 'Correct! Risk and return are inseparable. Even US government treasuries pay around 5% annually. 25% monthly is an impossible Ponzi.',
      },
    ],
    rewardCash: 450,
    rewardXP: 130,
    takeaway: 'Rule #1 of Wealth Preservation: If an investment claims guaranteed high returns with zero risk, run. It is always a scam.',
  },

  // 9. Realtor Rachel: The 1% Rule & Cap Rate
  {
    id: 'quest_rachel_caprate',
    npcId: 'npc_rachel',
    npcName: 'Realtor Rachel',
    npcAvatar: '🏘️',
    npcRole: 'Managing Broker & Cashflow Strategist',
    title: 'Screening Rental Properties with the 1% Rule',
    category: 'REAL_ESTATE',
    dilemma: 'I am evaluating a rental condo listed for $200,000. It rents for $1,200 per month. An amateur investor told me it’s an incredible cashflow machine. Does it pass the traditional 1% Rule screening test?',
    choices: [
      {
        text: 'No! The 1% rule suggests monthly rent should be at least 1% of purchase price ($2,000/mo for a $200k property) to ensure strong positive cashflow after taxes, insurance, and maintenance.',
        isCorrect: true,
        explanation: 'Spot on! At $1,200/mo (0.6%), after condo HOA fees, property taxes, and mortgage interest, the owner will likely experience negative monthly cashflow.',
      },
      {
        text: 'Yes! $1,200 is plenty of money and real estate always goes up no matter what.',
        isCorrect: false,
        explanation: 'Hope is not a financial strategy. Properties that don’t generate positive net operating income require the owner to feed them cash every month.',
      },
    ],
    rewardCash: 500,
    rewardXP: 120,
    takeaway: 'Real estate is a business of margins. Calculate Net Operating Income (NOI), cap rates, and cash-on-cash returns before signing contracts.',
  },

  // 10. Realtor Rachel: Down Payments & PMI
  {
    id: 'quest_rachel_downpayment',
    npcId: 'npc_rachel',
    npcName: 'Realtor Rachel',
    npcAvatar: '🏘️',
    npcRole: 'Managing Broker & Cashflow Strategist',
    title: 'Private Mortgage Insurance (PMI) Reality',
    category: 'REAL_ESTATE',
    dilemma: 'A first-time buyer wants to buy a home with only 3% down instead of 20% down. What is Private Mortgage Insurance (PMI) and who does it protect?',
    choices: [
      {
        text: 'PMI is an extra monthly fee paid by the buyer that protects the BANK if the borrower defaults on the loan.',
        isCorrect: true,
        explanation: 'Exactly! PMI protects the lender, not you. Putting 20% down eliminates PMI entirely, saving $150 to $300 every month.',
      },
      {
        text: 'PMI pays off your mortgage if you lose your job.',
        isCorrect: false,
        explanation: 'False! PMI provides zero protection to the homeowner; it solely reimburses the bank.',
      },
    ],
    rewardCash: 400,
    rewardXP: 90,
    takeaway: 'Reaching 20% equity removes PMI fees and lowers your monthly mortgage payment significantly.',
  },

  // 11. Mechanic Mike: Auto Deductibles & Insurance Math
  {
    id: 'quest_mike_auto_insurance',
    npcId: 'npc_mike',
    npcName: 'Mechanic Mike',
    npcAvatar: '🚗',
    npcRole: 'Master Automotive Technician',
    title: 'Optimizing Auto Insurance Deductibles',
    category: 'INSURANCE',
    dilemma: 'A driver with a healthy $10,000 emergency fund is choosing between a $250 insurance deductible ($180/mo premium) vs a $1,000 deductible ($110/mo premium). Which is the smarter choice?',
    choices: [
      {
        text: 'Take the $1,000 deductible! Since they have a $10,000 emergency fund, they can easily absorb a $1,000 hit and save $840 every single year in lower premiums.',
        isCorrect: true,
        explanation: 'Perfect risk management! Use high deductibles when you have cash reserves, pocketing the premium savings into index funds.',
      },
      {
        text: 'Take the $250 deductible because insurance should cover everything with zero out of pocket.',
        isCorrect: false,
        explanation: 'Low deductibles have exorbitant monthly premiums that cost far more over 5 years than the occasional claim.',
      },
    ],
    rewardCash: 350,
    rewardXP: 85,
    takeaway: 'Self-insure against small expenses with your emergency fund so you can buy high-deductible policies that save thousands over time.',
  },

  // 12. Executive Evelyn: Total Compensation Negotiation
  {
    id: 'quest_evelyn_comp',
    npcId: 'npc_evelyn',
    npcName: 'Executive Evelyn',
    npcAvatar: '💼',
    npcRole: 'VP of Talent & Corporate Mentor',
    title: 'The Art of Total Compensation Negotiation',
    category: 'CAREER',
    dilemma: 'You received a job offer for $85,000. When you asked for $95,000, the hiring manager said base salary bands are capped at $85,000. Is the negotiation over?',
    choices: [
      {
        text: 'Yes, give up and accept the $85,000 immediately.',
        isCorrect: false,
        explanation: 'Base salary is only one component of total compensation.',
      },
      {
        text: 'No! Negotiate other levers: a one-time signing bonus, annual equity grants, an extra week of paid time off, or an accelerated 6-month performance review.',
        isCorrect: true,
        explanation: 'Masterful career strategy! Companies often have flexibility in signing bonuses, RSUs, and benefits even when base salary bands are locked.',
      },
    ],
    rewardCash: 500,
    rewardXP: 125,
    takeaway: 'Always negotiate total compensation. Sign-on bonuses, stock grants, and remote flexibility can add tens of thousands to your net worth.',
  },
];
