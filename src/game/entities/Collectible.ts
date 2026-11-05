export interface Collectible {
  id: string;
  type: 'COIN' | 'SCROLL' | 'CHEST';
  x: number; // world px
  y: number;
  value: number;
  title: string;
  message: string;
  isCollected: boolean;
  pulseTimer: number;
}

export const INITIAL_COLLECTIBLES: Collectible[] = [
  {
    id: 'coin_1',
    type: 'COIN',
    x: 24 * 40 + 20,
    y: 16 * 40 + 20,
    value: 50,
    title: 'Found a Lost Bill!',
    message: '+$50 found in the plaza fountain! Park it in your High-Yield Savings Account.',
    isCollected: false,
    pulseTimer: 0,
  },
  {
    id: 'coin_2',
    type: 'COIN',
    x: 10 * 40 + 20,
    y: 11 * 40 + 20,
    value: 75,
    title: 'Textbook Rebate',
    message: '+$75 textbook buyback refund outside FinTwist University!',
    isCollected: false,
    pulseTimer: 1,
  },
  {
    id: 'coin_3',
    type: 'COIN',
    x: 36 * 40 + 20,
    y: 11 * 40 + 20,
    value: 100,
    title: 'Dividend Coupon',
    message: '+$100 quarterly cash dividend collected outside the Stock Exchange!',
    isCollected: false,
    pulseTimer: 2,
  },
  {
    id: 'scroll_1',
    type: 'SCROLL',
    x: 22 * 40 + 20,
    y: 19 * 40 + 20,
    value: 50,
    title: 'Scroll of Compounding (Rule of 72)',
    message: '💡 72 ÷ Return % = Years to double your money. At 9%, your money doubles every 8 years! (+50 XP)',
    isCollected: false,
    pulseTimer: 0.5,
  },
  {
    id: 'scroll_2',
    type: 'SCROLL',
    x: 30 * 40 + 20,
    y: 24 * 40 + 20,
    value: 50,
    title: 'Scroll of Real Estate CapEx',
    message: '💡 Always hold 10% of gross rents in reserve for broken water heaters and roof repairs! (+50 XP)',
    isCollected: false,
    pulseTimer: 1.5,
  },
  {
    id: 'chest_1',
    type: 'CHEST',
    x: 43 * 40 + 20,
    y: 16 * 40 + 20,
    value: 200,
    title: 'Crypto Airdrop Bounty Chest',
    message: '🎉 You discovered an unclaimed developer airdrop! +$200 added to your checking account.',
    isCollected: false,
    pulseTimer: 0,
  },
];
