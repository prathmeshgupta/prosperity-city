export interface InventoryItem {
  id: string;
  name: string;
  category: 'CASH' | 'SECURITY' | 'DEED' | 'POLICY' | 'PET' | 'UPGRADE' | 'SCROLL';
  icon: string;
  quantity: number;
  description: string;
  financialFact: string;
  isEquipped?: boolean;
}

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item_cash_clip',
    name: 'Liquid Cash Money Clip',
    category: 'CASH',
    icon: '💵',
    quantity: 1,
    description: 'Your immediate checking funds for daily transactions and bills.',
    financialFact: 'Keeping 1-2 months of living expenses in checking prevents overdraft fees.',
  },
  {
    id: 'item_hysa_passbook',
    name: 'High-Yield Vault Passbook',
    category: 'CASH',
    icon: '🏦',
    quantity: 1,
    description: 'FDIC-insured emergency fund yielding 4.5% APY interest.',
    financialFact: 'Unlike checking accounts paying 0.01%, an HYSA compounds monthly to defend against inflation.',
  },
  {
    id: 'item_compound_hound',
    name: 'Compound Hound Pet Companion',
    category: 'PET',
    icon: '🐕',
    quantity: 1,
    isEquipped: true,
    description: 'A loyal Golden Retriever who follows you through Prosperity City and alerts you near hidden coin drops!',
    financialFact: 'Like a faithful dog, compound interest never sleeps and works for you 24/7/365.',
  },
  {
    id: 'item_health_card',
    name: 'Major Medical Insurance Card',
    category: 'POLICY',
    icon: '🩺',
    quantity: 1,
    description: 'Transfers catastrophic medical risk to an insurer with a $1,500 deductible.',
    financialFact: 'Medical emergencies without insurance cause over 60% of personal bankruptcies.',
  },
  {
    id: 'item_rule72_scroll',
    name: 'Scroll of the Rule of 72',
    category: 'SCROLL',
    icon: '📜',
    quantity: 1,
    description: 'Mental shortcut discovered by Renaissance mathematicians.',
    financialFact: '72 ÷ Expected Return Rate = Exact years required for your wealth to double.',
  },
];
