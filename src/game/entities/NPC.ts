export interface NPCDialogueChoice {
  text: string;
  response: string;
  educationalLesson: string;
  cashBonus?: number;
  happinessBonus?: number;
  healthBonus?: number;
  xpBonus?: number;
}

export type DialogueChoice = NPCDialogueChoice;

export interface NPCDialogue {
  portrait: string;
  greeting: string;
  choices: NPCDialogueChoice[];
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  x: number; // in world px
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  dialogue: NPCDialogue;
  speechBubble?: string;
  speechTimer?: number;
  isWandering: boolean;
  wanderRadius: number;
  originX: number;
  originY: number;
  targetX?: number;
  targetY?: number;
}

export const INITIAL_NPCS: NPC[] = [
  // 1. Banker Sterling outside First Prosperity Bank
  {
    id: 'npc_sterling',
    name: 'Banker Sterling',
    title: 'Senior Vice President of Prosperity Bank',
    avatar: '🤵',
    color: '#10B981',
    x: 52 * 40 - 20,
    y: 11 * 40,
    direction: 'down',
    isWandering: true,
    wanderRadius: 70,
    originX: 52 * 40 - 20,
    originY: 11 * 40,
    speechBubble: 'Keep 3-6 months in safe cash!',
    dialogue: {
      portrait: '🤵',
      greeting: 'Welcome to First Prosperity Bank! The foundation of wealth is having an emergency fund that lets you sleep at night without worrying about bills.',
      choices: [
        {
          text: 'Why not put my emergency fund into stocks?',
          response: 'Because when life emergencies hit—like job losses or health issues—they often coincide with market crashes. If you are forced to sell your stocks at a 30% loss to pay rent, you permanently destroy your wealth.',
          educationalLesson: 'Emergency funds exist for safety and liquidity, not maximum returns.',
          xpBonus: 25,
        },
        {
          text: 'What is the fastest way to kill toxic credit card debt?',
          response: 'Use the Debt Avalanche! Pay the minimum on everything, then throw every extra dollar at the balance with the highest interest rate (like a 24% card). That interest is a fire consuming your future.',
          educationalLesson: 'Eliminating 24% interest debt gives you a guaranteed 24% return on your money.',
          xpBonus: 30,
        },
      ],
    },
  },

  // 2. Aunt Penny in Central Town Plaza
  {
    id: 'npc_penny',
    name: 'Aunt Penny',
    title: 'Frugal Sage of the Park',
    avatar: '👵',
    color: '#F59E0B',
    x: 44 * 40,
    y: 26 * 40,
    direction: 'right',
    isWandering: true,
    wanderRadius: 90,
    originX: 44 * 40,
    originY: 26 * 40,
    speechBubble: 'A penny saved is a dollar compounding!',
    dialogue: {
      portrait: '👵',
      greeting: 'Hello there, darling! Remember: true wealth is what you DO NOT see. It is the money you chose not to spend on shiny toys to impress strangers.',
      choices: [
        {
          text: 'Aunt Penny, how do you resist lifestyle creep?',
          response: 'Whenever you get a promotion or raise, save half of it immediately before you ever see it in your checking account! That way, you enjoy a lifestyle bump while doubling your savings rate.',
          educationalLesson: 'Automate your savings so willpower is never a factor.',
          happinessBonus: 5,
          xpBonus: 25,
        },
        {
          text: 'Here is $10 for your community garden!',
          response: 'Bless your kind heart! Generosity and giving back keep your relationship with money healthy and abundant.',
          cashBonus: -10,
          happinessBonus: 10,
          educationalLesson: 'Healthy wealth psychology balances disciplined saving with joyful generosity.',
          xpBonus: 40,
        },
      ],
    },
  },

  // 3. Trader Chad outside Wall Street Stock Exchange
  {
    id: 'npc_chad',
    name: 'Trader Chad',
    title: 'Exchange Veteran & Index Advocate',
    avatar: '📈',
    color: '#06B6D4',
    x: 62 * 40 - 20,
    y: 11 * 40,
    direction: 'left',
    isWandering: true,
    wanderRadius: 80,
    originX: 62 * 40 - 20,
    originY: 11 * 40,
    speechBubble: 'DCA and chill beats 90% of hedge funds!',
    dialogue: {
      portrait: '📈',
      greeting: 'Yo! Everyone tries to time market bottoms and tops. I used to day-trade on six screens. Now? I just Dollar-Cost Average into broad index funds every payday and sleep like a baby.',
      choices: [
        {
          text: 'What is Dollar-Cost Averaging (DCA)?',
          response: 'Investing a fixed dollar amount on a regular schedule regardless of price. When markets are high, you buy fewer shares; when markets crash, your dollars automatically buy more shares on discount!',
          educationalLesson: 'DCA removes emotion and turns market dips into discount buying sprees.',
          xpBonus: 30,
        },
        {
          text: 'What do you think of hot stock tips on social media?',
          response: 'By the time an influencer makes a video about a stock, they already bought it cheaper and are looking for retail suckers to buy their bags. Don’t gamble your future on social media noise!',
          educationalLesson: 'Social media hype is almost always late-stage exit liquidity.',
          xpBonus: 25,
        },
      ],
    },
  },

  // 4. Shady Sam in South Back Alley
  {
    id: 'npc_sam',
    name: 'Shady Sam',
    title: 'The Alley Hustler',
    avatar: '🕶️',
    color: '#64748B',
    x: 62 * 40,
    y: 63 * 40,
    direction: 'up',
    isWandering: false,
    wanderRadius: 0,
    originX: 62 * 40,
    originY: 63 * 40,
    speechBubble: 'Psst... guaranteed 50% returns, kid!',
    dialogue: {
      portrait: '🕶️',
      greeting: 'Hey kid... psst, over here. Tired of boring 8% index funds? I got an exclusive secret automated algorithmic bot that guarantees 50% profit every week with ZERO risk. Give me $500 right now and I will triple it by Tuesday!',
      choices: [
        {
          text: 'No way, Sam. Any "guaranteed" high return with zero risk is a scam!',
          response: 'Bah! You are too smart for your own good. Go back to your boring index funds!',
          educationalLesson: 'The First Law of Finance: Return is inextricably linked to risk. Guaranteed high yield is ALWAYS fraud.',
          happinessBonus: 8,
          xpBonus: 50,
        },
        {
          text: 'Hand over $100 just to see what happens...',
          response: 'Hehe, thanks sucker! Sam vanishes into the shadows with your cash. You never see the money or Sam again.',
          cashBonus: -100,
          happinessBonus: -10,
          educationalLesson: 'A painful lesson: once cash is sent to unverified anonymous actors, it is gone forever.',
          xpBonus: 10,
        },
      ],
    },
  },

  // 5. Dr. Shield outside Guardian Health & Insurance
  {
    id: 'npc_shield',
    name: 'Dr. Shield',
    title: 'Chief Medical Officer & HSA Advocate',
    avatar: '🩺',
    color: '#14B8A6',
    x: 62 * 40,
    y: 35 * 40,
    direction: 'left',
    isWandering: true,
    wanderRadius: 60,
    originX: 62 * 40,
    originY: 35 * 40,
    speechBubble: 'HSA is the ultimate triple-tax shield!',
    dialogue: {
      portrait: '🩺',
      greeting: 'Good day! Your physical health and your financial health are twins. A catastrophic medical bill without insurance is the #1 cause of individual bankruptcy in America.',
      choices: [
        {
          text: 'What makes a Health Savings Account (HSA) so special?',
          response: 'It has the legendary Triple Tax Advantage: Contributions are tax-deductible going in, investments grow 100% tax-free, and withdrawals for medical expenses are completely tax-free forever!',
          educationalLesson: 'An HSA is the only account in the US tax code that offers triple tax exemption.',
          xpBonus: 35,
        },
      ],
    },
  },

  // 6. Realtor Rachel outside Prosperity Realty
  {
    id: 'npc_rachel',
    name: 'Realtor Rachel',
    title: 'Managing Broker & Cashflow Strategist',
    avatar: '🏘️',
    color: '#6366F1',
    x: 72 * 40,
    y: 49 * 40,
    direction: 'up',
    isWandering: true,
    wanderRadius: 60,
    originX: 72 * 40,
    originY: 49 * 40,
    speechBubble: 'Cashflow over appreciation!',
    dialogue: {
      portrait: '🏘️',
      greeting: 'Welcome to Real Estate Row! Whether you buy your first starter home or house-hack a duplex, real estate allows you to control a large appreciating asset with bank leverage.',
      choices: [
        {
          text: 'What is "House Hacking"?',
          response: 'Buying a small multi-family property (like a duplex), living in one unit, and renting out the other. The tenant rent pays your entire mortgage so you live virtually rent-free!',
          educationalLesson: 'Eliminating your primary housing expense accelerates your savings rate to 60%+.',
          xpBonus: 35,
        },
      ],
    },
  },

  // 7. Executive Evelyn outside Apex Career Tower
  {
    id: 'npc_evelyn',
    name: 'Executive Evelyn',
    title: 'VP of Talent & Corporate Mentor',
    avatar: '💼',
    color: '#3B82F6',
    x: 36 * 40 - 20,
    y: 49 * 40,
    direction: 'right',
    isWandering: true,
    wanderRadius: 70,
    originX: 36 * 40 - 20,
    originY: 49 * 40,
    speechBubble: 'Your career is your largest capital asset!',
    dialogue: {
      portrait: '💼',
      greeting: 'Hello there! Don’t just pinch pennies on $4 coffees—focus on the offensive side of wealth. Boosting your salary from $50k to $100k gives you $50k of fresh compounding fuel every single year.',
      choices: [
        {
          text: 'How should I ask for a salary raise?',
          response: 'Never ask based on your personal bills! Prepare a one-page "Value Delivered" dossier demonstrating revenue generated, time saved, or projects led, and benchmark against market compensation data.',
          educationalLesson: 'Salaries are based on market value and demonstrated impact, not personal financial need.',
          xpBonus: 40,
        },
      ],
    },
  },

  // 8. Mechanic Mike outside Prestige Motors
  {
    id: 'npc_mike',
    name: 'Mechanic Mike',
    title: 'Master Automotive Technician',
    avatar: '🚗',
    color: '#EF4444',
    x: 20 * 40 + 20,
    y: 35 * 40,
    direction: 'left',
    isWandering: true,
    wanderRadius: 60,
    originX: 20 * 40 + 20,
    originY: 35 * 40,
    speechBubble: 'Car payments drain more wealth than lattes!',
    dialogue: {
      portrait: '🚗',
      greeting: 'Hey friend! Look around this lot. The average American spends $700+ a month on a 7-year auto loan for an SUV that drops 20% in value the moment it leaves the lot. Buy reliable, pay cash or keep payments tiny!',
      choices: [
        {
          text: 'Is leasing a car ever a good financial decision?',
          response: 'Almost never for consumers! You are paying for the steepest depreciation years of the vehicle and walk away with zero equity at the end of 36 months.',
          educationalLesson: 'Vehicles are depreciating tools, not wealth-generating assets.',
          xpBonus: 30,
        },
      ],
    },
  },
];
