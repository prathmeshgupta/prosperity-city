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
    x: 46 * 40 + 20,
    y: 24 * 40 + 20,
    value: 50,
    title: 'Found a Lost Bill!',
    message: '+$50 found in the plaza fountain! Park it in your High-Yield Savings Account.',
    isCollected: false,
    pulseTimer: 0,
  },
  {
    id: 'coin_2',
    type: 'COIN',
    x: 12 * 40 + 20,
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
    x: 62 * 40 + 20,
    y: 11 * 40 + 20,
    value: 100,
    title: 'Dividend Coupon',
    message: '+$100 quarterly cash dividend collected outside the Wall Street Stock Exchange!',
    isCollected: false,
    pulseTimer: 2,
  },
  {
    id: 'coin_4',
    type: 'COIN',
    x: 70 * 40 + 20,
    y: 11 * 40 + 20,
    value: 125,
    title: 'Treasury Coupon Payment',
    message: '+$125 semi-annual Treasury coupon collected outside the Bond Floor!',
    isCollected: false,
    pulseTimer: 1.5,
  },
  {
    id: 'scroll_1',
    type: 'SCROLL',
    x: 40 * 40 + 20,
    y: 22 * 40 + 20,
    value: 50,
    title: 'Scroll of Compounding (Rule of 72)',
    message: '💡 72 ÷ Return % = Years to double your money. At 9%, your money doubles every 8 years! (+50 XP)',
    isCollected: false,
    pulseTimer: 0.5,
  },
  {
    id: 'scroll_2',
    type: 'SCROLL',
    x: 34 * 40 + 20,
    y: 11 * 40 + 20,
    value: 50,
    title: 'Scroll of Equity Comp (ESPP & RSUs)',
    message: '💡 A 15% ESPP discount gives an instant +17.6% return on day 1. Sell immediately to avoid concentration risk! (+50 XP)',
    isCollected: false,
    pulseTimer: 1.2,
  },
  {
    id: 'scroll_3',
    type: 'SCROLL',
    x: 38 * 40 + 20,
    y: 25 * 40 + 20,
    value: 75,
    title: 'Scroll of Tax-Loss Harvesting',
    message: '💡 Harvested capital losses offset taxable gains $1 for $1, plus up to $3,000/yr of ordinary salary! (+75 XP)',
    isCollected: false,
    pulseTimer: 1.8,
  },
  {
    id: 'chest_1',
    type: 'CHEST',
    x: 84 * 40 + 20,
    y: 26 * 40 + 20,
    value: 250,
    title: 'Sunken Treasure Chest on Boardwalk Pier',
    message: '🏆 Stumbled upon $250 cold storage wallet on the Ocean Pier! (+100 XP)',
    isCollected: false,
    pulseTimer: 2.2,
  },
];
