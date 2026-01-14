export interface RetailBox {
  id: string;
  title: string;
  description: string;
  price: number;
  minValue: number;
  maxValue: number;
  coverImage: string;
  tags: string[];
  category: 'Starter' | 'Premium' | 'Limited';
}

export interface RetailReward {
  id: string;
  name: string;
  type: 'NFT' | 'GIFT_CARD' | 'GAME_CURRENCY';
  value: number;
  isWithdrawable: boolean;
  imageUrl?: string;
}

export interface MarketplaceUseCase {
  availableBoxes: RetailBox[];
  purchaseBox: (boxId: string) => void;
  isProcessing: boolean;
}