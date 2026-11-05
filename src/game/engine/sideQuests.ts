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
  category: 'INVESTING' | 'BUDGETING' | 'TAX' | 'REAL_ESTATE' | 'SCAM_PREVENTION';
  dilemma: string;
  choices: SideQuestChoice[];
  rewardCash: number;
  rewardXP: number;
  takeaway: string;
  isCompleted?: boolean;
}

export const CITIZEN_SIDE_QUESTS: CitizenSideQuest[] = [
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
  {
    id: 'quest_chad_meme',
    npcId: 'npc_chad',
    npcName: 'Trader Chad',
    npcAvatar: '🚀',
    npcRole: 'Crypto & Options Day Trader',
    title: 'Chad’s All-In Meme Coin Dilemma',
    category: 'INVESTING',
    dilemma: 'Yo bro! I’m about to dump my next 3 months of apartment rent into "QuantumDoge-3000" because an influencer on Twitter said it’s guaranteed 100x by Tuesday! Talk me out of it or tell me to send it!',
    choices: [
      {
        text: 'Full send, bro! High risk, high reward, you only live once!',
        isCorrect: false,
        explanation: 'Gambling essential rent money on volatile meme coins is the fastest path to eviction and high-interest debt traps.',
      },
      {
        text: 'Never risk rent money on speculative coins! Put 90% into broad low-cost index funds (VOO), and keep speculative bets strictly under 5% of your portfolio.',
        isCorrect: true,
        explanation: 'Smart play! The Core & Satellite portfolio architecture protects your life essentials while still allowing a tiny discretionary sandbox.',
      },
    ],
    rewardCash: 250,
    rewardXP: 75,
    takeaway: 'Never invest money you need in the next 3 to 5 years. Use the 90/10 Core-and-Satellite strategy to prevent catastrophic ruin.',
  },
  {
    id: 'quest_shield_hsa',
    npcId: 'npc_doctor',
    npcName: 'Dr. Shield',
    npcAvatar: '🩺',
    npcRole: 'Emergency Medicine & Health Advocate',
    title: 'The Triple-Tax-Advantaged HSA Mystery',
    category: 'TAX',
    dilemma: 'Many young workers treat health insurance as an afterthought. But an HSA paired with a High Deductible Health Plan is called "The Holy Grail of Tax Shelters". Can you explain why it is Triple-Tax-Advantaged?',
    choices: [
      {
        text: 'Because you get discounts on 3 different medical visits every calendar year.',
        isCorrect: false,
        explanation: 'Not quite! The triple advantage refers to internal revenue tax exemptions, not clinic co-pay discounts.',
      },
      {
        text: '1) Contributions are tax-deductible, 2) Investments grow tax-free, and 3) Qualified medical withdrawals are 100% tax-free forever!',
        isCorrect: true,
        explanation: 'Doctor verified! No other account in the US tax code combines pre-tax deposits, tax-free capital growth, AND tax-free withdrawals.',
      },
    ],
    rewardCash: 350,
    rewardXP: 100,
    takeaway: 'An HSA is the only account offering triple tax benefits: tax-deductible contributions, tax-free growth, and tax-free medical withdrawals.',
  },
  {
    id: 'quest_sterling_mortgage',
    npcId: 'npc_banker',
    npcName: 'Banker Sterling',
    npcAvatar: '🤵',
    npcRole: 'Senior Vice President of Vault Operations',
    title: 'The Amortization Accelerator',
    category: 'REAL_ESTATE',
    dilemma: 'Most homeowners don’t understand how front-loaded mortgage interest is. In the first 7 years, 70% of each payment goes straight to interest! What happens if you make just ONE extra principal payment per year?',
    choices: [
      {
        text: 'Nothing happens, the bank pockets the cash as an early prepayment fee.',
        isCorrect: false,
        explanation: 'Fixed residential mortgages in modern banking cannot penalize extra principal payments. Every extra dollar directly kills the principal!',
      },
      {
        text: 'It directly subtracts from the principal balance, shaving 5 to 7 years off the mortgage and saving tens of thousands in compounding interest!',
        isCorrect: true,
        explanation: 'Sterling nods in approval! Making 13 monthly payments a year instead of 12 turns a 30-year mortgage into roughly a 23-year loan.',
      },
    ],
    rewardCash: 400,
    rewardXP: 110,
    takeaway: 'Prepaying mortgage principal bypasses interest compounding, accelerating home equity and shaving years off debt servitude.',
  },
  {
    id: 'quest_sam_ponzi',
    npcId: 'npc_sam',
    npcName: 'Shady Sam',
    npcAvatar: '🕶️',
    npcRole: 'Street Pitchman & "Crypto Guru"',
    title: 'Spotting Shady Sam’s Red Flags',
    category: 'SCAM_PREVENTION',
    dilemma: 'Psst! Hey kid, give me $500 right now and I guarantee you 15% daily returns with zero risk! Plus, if you recruit 3 friends, you get 10% of their deposits for life! What do you say?',
    choices: [
      {
        text: 'Sounds amazing! 15% daily is 5,400% a year, here is my cash!',
        isCorrect: false,
        explanation: 'You just handed your life savings to a classic Ponzi scam. Your money disappears overnight.',
      },
      {
        text: 'No deal! "Guaranteed high returns", "zero risk", and "recruit friends for bonuses" are the 3 universal hallmark red flags of an illegal Ponzi scheme!',
        isCorrect: true,
        explanation: 'Sam scurries into the shadows! There is no such thing as guaranteed high returns with zero risk. In finance: higher yield ALWAYS means higher risk.',
      },
    ],
    rewardCash: 500,
    rewardXP: 125,
    takeaway: 'Rule of thumb: "Guaranteed high returns" + "zero risk" + "referral recruitment" = 100% scam. Legitimate investments disclose risk transparently.',
  },
  {
    id: 'quest_rachel_caprate',
    npcId: 'npc_realtor',
    npcName: 'Realtor Rachel',
    npcAvatar: '📜',
    npcRole: 'Commercial & Multi-Family Real Estate Broker',
    title: 'The Capitalization Rate Formula',
    category: 'REAL_ESTATE',
    dilemma: 'When looking at turnkey duplexes on Residential Row, sophisticated investors look at the Cap Rate rather than just the gross rent. What is the mathematical formula for Cap Rate?',
    choices: [
      {
        text: 'Monthly Mortgage Payment divided by the Total Down Payment.',
        isCorrect: false,
        explanation: 'That measures cash-on-cash debt servicing, not the underlying property capitalization rate.',
      },
      {
        text: 'Net Operating Income (Gross Rents minus Operating Expenses) divided by Current Purchase Price.',
        isCorrect: true,
        explanation: 'Exact formula: Cap Rate = NOI ÷ Property Price. It evaluates the asset’s natural unleveraged cashflow return.',
      },
    ],
    rewardCash: 450,
    rewardXP: 120,
    takeaway: 'Cap Rate (NOI ÷ Price) lets you compare real estate returns against index funds and bonds on an apples-to-apples basis.',
  },
];
