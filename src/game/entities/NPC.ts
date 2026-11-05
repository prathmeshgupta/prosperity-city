export interface DialogueChoice {
  text: string;
  response: string;
  cashBonus?: number;
  happinessBonus?: number;
  healthBonus?: number;
  xpBonus?: number;
  educationalLesson: string;
}

export interface NPCDialogue {
  greeting: string;
  portrait: string;
  choices: DialogueChoice[];
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  x: number; // in world pixels
  y: number;
  targetX?: number;
  targetY?: number;
  direction: 'up' | 'down' | 'left' | 'right';
  dialogue: NPCDialogue;
  speechBubble?: string;
  speechTimer?: number;
  isWandering: boolean;
  wanderRadius: number;
  originX: number;
  originY: number;
}

export const INITIAL_NPCS: NPC[] = [
  {
    id: 'npc_sterling',
    name: 'Banker Sterling',
    title: 'Senior Vice President of Prosperity Bank',
    avatar: '🤵',
    color: '#10B981',
    x: 27 * 40,
    y: 11 * 40,
    direction: 'down',
    isWandering: true,
    wanderRadius: 100,
    originX: 27 * 40,
    originY: 11 * 40,
    speechBubble: 'Keep 3-6 months in safe cash!',
    dialogue: {
      portrait: '🤵',
      greeting: 'Welcome to First Prosperity Bank! I tell all my clients: the foundation of wealth is not picking hot stocks—it is having an Emergency Fund that lets you sleep peacefully.',
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
  {
    id: 'npc_penny',
    name: 'Aunt Penny',
    title: 'Frugal Sage of the Park',
    avatar: '👵',
    color: '#F59E0B',
    x: 23 * 40,
    y: 18 * 40,
    direction: 'right',
    isWandering: true,
    wanderRadius: 120,
    originX: 23 * 40,
    originY: 18 * 40,
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
  {
    id: 'npc_chad',
    name: 'Trader Chad',
    title: 'Exchange Veteran & Index Advocate',
    avatar: '📈',
    color: '#06B6D4',
    x: 37 * 40,
    y: 11 * 40,
    direction: 'left',
    isWandering: true,
    wanderRadius: 80,
    originX: 37 * 40,
    originY: 11 * 40,
    speechBubble: 'DCA and chill beats 90% of hedge funds!',
    dialogue: {
      portrait: '📈',
      greeting: 'Yo! Everyone tries to time the market bottoms and tops. I used to be a day-trader with three ulcer medications. Now? I just Dollar-Cost Average into broad index funds every payday and sleep like a baby.',
      choices: [
        {
          text: 'What is Dollar-Cost Averaging (DCA)?',
          response: 'Investing a fixed dollar amount on a regular schedule regardless of price. When markets are high, you buy fewer shares; when markets crash, your dollars automatically buy more shares on discount!',
          educationalLesson: 'DCA removes emotion and turns market dips into discount buying sprees.',
          xpBonus: 30,
        },
        {
          text: 'What do you think of hot stock tips on TikTok?',
          response: 'By the time an influencer makes a video about a stock, they already bought it cheaper and are looking for retail suckers to buy their bags. Don’t gamble your future on social media noise!',
          educationalLesson: 'Social media hype is almost always late-stage exit liquidity.',
          xpBonus: 25,
        },
      ],
    },
  },
  {
    id: 'npc_sam',
    name: 'Shady Sam',
    title: 'The Alley Hustler',
    avatar: '🕶️',
    color: '#64748B',
    x: 41 * 40,
    y: 29 * 40,
    direction: 'up',
    isWandering: false,
    wanderRadius: 0,
    originX: 41 * 40,
    originY: 29 * 40,
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
];
