import { create } from 'zustand';
import { GiftBoxTier, GiftReward, GIFT_TIERS, SUPPORTED_BRANDS } from '../domain/entities';
import { useStore } from '@infra/state/store';

interface GiftCardState {
  isOpening: boolean;
  lastReward: GiftReward | null;
  
  openGiftBox: (tierId: string) => Promise<void>;
  resetReward: () => void;
}

export const useGiftCardStore = create<GiftCardState>((set) => ({
  isOpening: false,
  lastReward: null,

  openGiftBox: async (tierId: string) => {
    const tier = GIFT_TIERS.find(t => t.id === tierId);
    if (!tier) return;

    const globalStore = useStore.getState();
    
    if (globalStore.balance < tier.price) {
      throw new Error("Saldo insuficiente");
    }

    set({ isOpening: true });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    globalStore.updateBalance(-tier.price);

    const luckFactor = Math.random() * 0.5;
    const totalMultiplier = tier.guaranteedMinMultiplier + luckFactor;
    const totalRewardValue = tier.price * totalMultiplier;

    const giftCardRatio = 0.4 + (Math.random() * 0.3); 
    const giftCardValue = Math.floor(tier.price * giftCardRatio);
    const coinValue = totalRewardValue - giftCardValue;

    const randomBrand = SUPPORTED_BRANDS[Math.floor(Math.random() * SUPPORTED_BRANDS.length)];

    const reward: GiftReward = {
      brand: randomBrand,
      giftCardValue: parseFloat(giftCardValue.toFixed(2)),
      coinValue: parseFloat(coinValue.toFixed(2)),
      totalValue: parseFloat(totalRewardValue.toFixed(2))
    };

    useStore.setState(state => ({
      engagementTokens: state.engagementTokens + (coinValue * 10)
    }));

    globalStore.addReward({
      id: `gc-${Math.random().toString(36).substr(2, 9)}`,
      name: `Gift Card ${reward.brand}`,
      rarity: 'Rare',
      value: reward.giftCardValue,
      timestamp: Date.now()
    });

    set({ isOpening: false, lastReward: reward });
  },

  resetReward: () => set({ lastReward: null })
}));