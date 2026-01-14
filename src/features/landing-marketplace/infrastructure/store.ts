import { create } from 'zustand';
import { MarketBox, UnboxedItem } from '../domain/entities';

const BOXES: MarketBox[] = [
  {
    id: 'box-starter',
    name: 'Starter Kit',
    description: 'Entrada segura no ecossistema. Retorno garantido em Game Coins.',
    price: 4.90,
    minValue: 5.00,
    maxValue: 12.00,
    tier: 'Starter',
    coverImage: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=400&q=80',
    isHot: true
  },
  {
    id: 'box-advanced',
    name: 'Operator Crate',
    description: 'Para usuários que buscam volume de operação.',
    price: 19.90,
    minValue: 21.00,
    maxValue: 45.00,
    tier: 'Advanced',
    coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80'
  },
  {
    id: 'box-elite',
    name: 'Elite Vault',
    description: 'Acesso a fragmentos raros e alto volume de liquidez interna.',
    price: 49.90,
    minValue: 55.00,
    maxValue: 150.00,
    tier: 'Elite',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
  },
  {
    id: 'box-prestige',
    name: 'Prestige Global',
    description: 'A caixa definitiva. Somente ativos de alta fidelidade.',
    price: 99.90,
    minValue: 110.00,
    maxValue: 500.00,
    tier: 'Prestige',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80'
  }
];

interface MarketplaceState {
  availableBoxes: MarketBox[];
  isOpening: boolean;
  lastReward: UnboxedItem | null;
  purchaseBox: (boxId: string) => Promise<UnboxedItem>;
  resetReward: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  availableBoxes: BOXES,
  isOpening: false,
  lastReward: null,

  purchaseBox: async (boxId: string) => {
    set({ isOpening: true });
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const box = get().availableBoxes.find(b => b.id === boxId);
    if (!box) throw new Error("Box not found");

    const bonusFactor = 1 + (Math.random() * 0.5); 
    const value = Math.max(box.minValue, box.price * bonusFactor);

    const reward: UnboxedItem = {
      id: Math.random().toString(36),
      name: `${box.tier} Game Asset Bundle`,
      type: 'GAME_CURRENCY',
      value: Number(value.toFixed(2)),
      tier: box.tier
    };

    set({ isOpening: false, lastReward: reward });
    return reward;
  },

  resetReward: () => set({ lastReward: null })
}));