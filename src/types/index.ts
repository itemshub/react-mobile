export interface SkinItem {
  id: string;
  name: string;
  skin: string;
  quality: 'Factory New' | 'Minimal Wear' | 'Field-Tested' | 'Well-Worn' | 'Battle-Scarred';
  rarity: 'Consumer Grade' | 'Industrial Grade' | 'Restricted' | 'Classified' | 'Covert' | 'Contraband';
  collection: string;
  price: number;
  price24h: number;
  change24h: number;
  image: string;
  category: 'AK' | 'M4' | 'AWP' | 'USP' | 'Pistol' | 'Rifle' | 'SMG' | 'Shotgun' | 'Sniper';
  marketId: string;
  description?: string;
  stats?: {
    float: number;
    inspectLink: string;
    patternIndex: number;
  };
}

export interface Case {
  id: string;
  name: string;
  price: number;
  price24h: number;
  change24h: number;
  image: string;
  description: string;
  releaseDate: string;
  rarity: string;
  items: SkinItem[];
  contractAddress?: string;
  dropRate?: string;
}

export interface ArbitrageOpportunity {
  id: string;
  skin: SkinItem;
  markets: {
    buy: {
      platform: 'Buff' | 'C5' | 'Steam' | 'Skinport';
      price: number;
      fee: number;
    };
    sell: {
      platform: 'Buff' | 'C5' | 'Steam' | 'Skinport';
      price: number;
      fee: number;
    };
  };
  potentialProfit: number;
  profitPercentage: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  volume: number;
  lastUpdated: string;
}

export interface VaultStake {
  id: string;
  caseId: string;
  caseName: string;
  amount: number;
  stakeDate: string;
  unlockDate: string;
  currentValue: number;
  totalRewards: number;
  dailyReward: number;
  status: 'active' | 'locked' | 'unlocked';
  rewardRate: number;
}

export interface Market {
  id: string;
  name: string;
  currency: string;
  fee: number;
  paymentMethods: string[];
}

export interface User {
  id: string;
  username: string;
  uid: string;
  level: number;
  points: number;
  steamBound: boolean;
  steamId?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  totalVaultRewards: number;
  totalArbitrageProfit: number;
  monthlyProfit: number[];
}