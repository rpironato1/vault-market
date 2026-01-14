export type BoxTier = 'Starter' | 'Advanced' | 'Elite' | 'Prestige';

export interface MarketBox {
  id: string;
  name: string;
  description: string;
  price: number;
  minValue: number;
  maxValue: number;
  tier: BoxTier;
  coverImage: string;
  isHot?: boolean;
}

export interface UnboxedItem {
  id: string;
  name: string;
  type: 'GAME_CURRENCY' | 'NFT_FRAGMENT' | 'GIFT_CARD';
  value: number;
  tier: BoxTier;
  image?: string;
}