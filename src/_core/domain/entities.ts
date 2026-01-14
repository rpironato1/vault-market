export type Tier = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface MysteryBox {
  id: string;
  name: string;
  price: number;
  tier: Tier;
  imageUrl: string;
  description: string;
}

export interface Reward {
  id: string;
  name: string;
  rarity: Tier;
  value: number;
  timestamp: number;
}

export interface UserAccount {
  balance: number;
  engagementTokens: number;
  vaultItems: Reward[];
}