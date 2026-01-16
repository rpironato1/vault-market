export type Currency = 'TOKEN' | 'CRYPTO';

export interface MysteryBox {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  imageUrl: string;
  potentialRewards: Reward[];
}

export interface Reward {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  value: number;
  type?: 'ITEM' | 'TOKEN' | 'GIFT_CARD';
  timestamp?: number;
}

export interface UserVault {
  balance: number;
  tokens: number;
  inventoryCount: number;
}