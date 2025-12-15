import { SkinItem, Case, ArbitrageOpportunity, VaultStake, User, Market } from '../types';

// Mock CS2 Skins Data
export const mockSkins: SkinItem[] = [
  {
    id: '1',
    name: 'AK-47',
    skin: 'Fire Serpent',
    quality: 'Factory New',
    rarity: 'Covert',
    collection: 'The Phoenix Collection',
    price: 2850.50,
    price24h: 2780.00,
    change24h: 2.5,
    image: '/images/ak-fire-serpent.jpg',
    category: 'AK',
    marketId: 'ak47_fire_serpent_fnv',
    description: '外部磨损的几何图案可以通过旋转活动图查看。',
    stats: {
      float: 0.02,
      inspectLink: 'inspect-link-1',
      patternIndex: 541
    }
  },
  {
    id: '2',
    name: 'AWP',
    skin: 'Dragon Lore',
    quality: 'Factory New',
    rarity: 'Covert',
    collection: 'The Cobblestone Collection',
    price: 4500.00,
    price24h: 4450.00,
    change24h: 1.1,
    image: '/images/awp-dragon-lore.jpg',
    category: 'AWP',
    marketId: 'awp_dragon_lore_fnv',
    description: '一只神秘的龙守护着它的宝藏。'
  },
  {
    id: '3',
    name: 'M4A4',
    skin: 'Howl',
    quality: 'Factory New',
    rarity: 'Covert',
    collection: 'The Chroma Collection',
    price: 3200.00,
    price24h: 3150.00,
    change24h: 1.6,
    image: '/images/m4a4-howl.jpg',
    category: 'M4',
    marketId: 'm4a4_howl_fnv',
    description: '外表狂野，未被驯服。'
  },
  {
    id: '4',
    name: 'AK-47',
    skin: 'Asiimov',
    quality: 'Minimal Wear',
    rarity: 'Covert',
    collection: 'The Spectrum Collection',
    price: 1200.00,
    price24h: 1180.00,
    change24h: 1.7,
    image: '/images/ak-asiimov.jpg',
    category: 'AK',
    marketId: 'ak47_asiimov_mw'
  },
  {
    id: '5',
    name: 'USP-S',
    skin: 'Neo-Noir',
    quality: 'Factory New',
    rarity: 'Restricted',
    collection: 'The Prime Collection',
    price: 680.00,
    price24h: 690.00,
    change24h: -1.4,
    image: '/images/ak-fire-serpent.jpg',
    category: 'USP',
    marketId: 'usp_s_neo_noir_fnv'
  }
];

// Mock Cases Data
export const mockCases: Case[] = [
  {
    id: 'case1',
    name: 'Chroma Case',
    price: 12.50,
    price24h: 12.20,
    change24h: 2.5,
    image: '/images/chroma-case.png',
    description: 'Chromatic features new finishes from multiple manufacturers.',
    releaseDate: '2014-08-08',
    rarity: 'Rare',
    items: mockSkins,
    contractAddress: '0x123...abc',
    dropRate: '0.26%'
  },
  {
    id: 'case2',
    name: 'Phoenix Collection',
    price: 8.90,
    price24h: 8.70,
    change24h: 2.3,
    image: '/images/phoenix-case.png',
    description: 'A collection of skins themed around the mythical phoenix.',
    releaseDate: '2013-07-01',
    rarity: 'Medium',
    items: mockSkins,
    dropRate: '0.52%'
  },
  {
    id: 'case3',
    name: 'Gamma Collection',
    price: 35.80,
    price24h: 36.20,
    change24h: -1.1,
    image: '/images/gamma-case.png',
    description: 'Premium skins with beautiful gamma ray finishes.',
    releaseDate: '2016-08-02',
    rarity: 'High',
    items: mockSkins,
    dropRate: '0.15%'
  },
  {
    id: 'case4',
    name: 'Spectrum Case',
    price: 28.50,
    price24h: 28.10,
    change24h: 1.4,
    image: '/images/spectrum-case.png',
    description: 'Featuring skins with spectrum-like properties.',
    releaseDate: '2017-05-09',
    rarity: 'Premium',
    items: mockSkins,
    dropRate: '0.12%'
  },
  {
    id: 'case5',
    name: 'Crimson Collection',
    price: 45.90,
    price24h: 44.50,
    change24h: 3.1,
    image: '/images/crimson-case.png',
    description: 'High-end collection featuring the most sought-after skins.',
    releaseDate: '2015-12-08',
    rarity: 'Ultra Rare',
    items: mockSkins,
    dropRate: '0.08%'
  }
];

// Mock Arbitrage Opportunities
export const mockArbitrage: ArbitrageOpportunity[] = [
  {
    id: 'arb1',
    skin: mockSkins[0],
    markets: {
      buy: {
        platform: 'C5',
        price: 2750.00,
        fee: 0.02
      },
      sell: {
        platform: 'Buff',
        price: 2850.50,
        fee: 0.025
      }
    },
    potentialProfit: 85.50,
    profitPercentage: 3.1,
    riskLevel: 'Low',
    volume: 15,
    lastUpdated: '2025-10-25 23:45:00'
  },
  {
    id: 'arb2',
    skin: mockSkins[1],
    markets: {
      buy: {
        platform: 'Skinport',
        price: 4400.00,
        fee: 0.015
      },
      sell: {
        platform: 'Steam',
        price: 4500.00,
        fee: 0.15
      }
    },
    potentialProfit: 50.00,
    profitPercentage: 1.1,
    riskLevel: 'Medium',
    volume: 8,
    lastUpdated: '2025-10-25 23:30:00'
  },
  {
    id: 'arb3',
    skin: mockSkins[3],
    markets: {
      buy: {
        platform: 'Buff',
        price: 1160.00,
        fee: 0.025
      },
      sell: {
        platform: 'C5',
        price: 1200.00,
        fee: 0.02
      }
    },
    potentialProfit: 28.00,
    profitPercentage: 2.4,
    riskLevel: 'Low',
    volume: 22,
    lastUpdated: '2025-10-25 23:50:00'
  }
];

// Mock Vault Stakes
export const mockVaultStakes: VaultStake[] = [
  {
    id: 'stake1',
    caseId: 'case1',
    caseName: 'Chroma Case',
    amount: 10,
    stakeDate: '2025-10-20 10:00:00',
    unlockDate: '2025-11-20 10:00:00',
    currentValue: 130.00,
    totalRewards: 25.80,
    dailyReward: 1.29,
    status: 'active',
    rewardRate: 0.005
  },
  {
    id: 'stake2',
    caseId: 'case2',
    caseName: 'Phoenix Collection',
    amount: 5,
    stakeDate: '2025-10-15 14:30:00',
    unlockDate: '2025-11-15 14:30:00',
    currentValue: 46.50,
    totalRewards: 12.30,
    dailyReward: 0.82,
    status: 'active',
    rewardRate: 0.003
  },
  {
    id: 'stake3',
    caseId: 'case3',
    caseName: 'Gamma Collection',
    amount: 2,
    stakeDate: '2025-10-01 09:15:00',
    unlockDate: '2025-12-01 09:15:00',
    currentValue: 74.60,
    totalRewards: 18.45,
    dailyReward: 1.85,
    status: 'active',
    rewardRate: 0.008
  }
];

// Mock User Data
export const mockUser: User = {
  id: 'user1',
  username: 'CS2Trader',
  uid: '76561198012345678',
  level: 12,
  points: 2840,
  steamBound: true,
  steamId: '76561198012345678',
  email: 'user@example.com',
  avatar: '/images/avatar-default.png',
  totalVaultRewards: 568.40,
  totalArbitrageProfit: 1234.56,
  monthlyProfit: [850, 920, 1050, 1150, 980, 1234]
};

// Mock Markets Data
export const mockMarkets: Market[] = [
  {
    id: 'buff',
    name: 'Buff163',
    currency: 'CNY',
    fee: 0.025,
    paymentMethods: ['支付宝', '微信支付', '银行卡']
  },
  {
    id: 'c5',
    name: 'C5游戏',
    currency: 'CNY',
    fee: 0.02,
    paymentMethods: ['支付宝', '银行卡']
  },
  {
    id: 'steam',
    name: 'Steam Market',
    currency: 'USD',
    fee: 0.15,
    paymentMethods: ['Steam钱包']
  },
  {
    id: 'skinport',
    name: 'Skinport',
    currency: 'USD',
    fee: 0.015,
    paymentMethods: ['PayPal', '信用卡']
  }
];

// Mock Dashboard Data
export const mockDashboardStats = {
  totalVolume: 2456789.50,
  avgCaseChange: 2.3,
  arbitrageOpportunities: 24,
  globalProfitIndex: 156.7,
  trendData: [
    { date: '10-19', volume: 2.1, profit: 145.2 },
    { date: '10-20', volume: 2.4, profit: 148.6 },
    { date: '10-21', volume: 2.0, profit: 142.8 },
    { date: '10-22', volume: 2.6, profit: 151.3 },
    { date: '10-23', volume: 2.3, profit: 149.5 },
    { date: '10-24', volume: 2.5, profit: 153.7 },
    { date: '10-25', volume: 2.7, profit: 156.7 }
  ]
};

// Mock Announcements
export const mockAnnouncements = [
  {
    id: '1',
    title: '新功能上线！',
    content: '质押功能现已全面上线，最高年化收益率达20%',
    date: '2025-10-25',
    type: 'feature'
  },
  {
    id: '2',
    title: '市场维护通知',
    content: '10月26日凌晨2:00-4:00进行系统维护',
    date: '2025-10-24',
    type: 'maintenance'
  },
  {
    id: '3',
    title: '新箱子预告',
    content: '暴击2025箱子即将上线，敬请期待',
    date: '2025-10-23',
    type: 'preview'
  }
];