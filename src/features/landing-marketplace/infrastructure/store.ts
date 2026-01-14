import { create } from 'zustand';
import { MarketBox, UnboxedItem, BoxTier } from '../domain/entities';

// Configurações base para geração
const TIERS: Record<BoxTier, { price: number; min: number; max: number; images: string[] }> = {
  Starter: {
    price: 4.90,
    min: 5.00,
    max: 15.00,
    images: [
      'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=400&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
      'https://images.unsplash.com/photo-1592478411213-61535fdd861d?w=400&q=80'
    ]
  },
  Advanced: {
    price: 19.90,
    min: 21.00,
    max: 50.00,
    images: [
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80',
      'https://images.unsplash.com/photo-1535378437327-1e8c83279326?w=400&q=80',
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=80'
    ]
  },
  Elite: {
    price: 49.90,
    min: 55.00,
    max: 200.00,
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      'https://images.unsplash.com/photo-1618193139062-2c5bf4f935b7?w=400&q=80',
      'https://images.unsplash.com/photo-1614726365723-49cfae9545d1?w=400&q=80'
    ]
  },
  Prestige: {
    price: 99.90,
    min: 110.00,
    max: 1000.00,
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
      'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&q=80',
      'https://images.unsplash.com/photo-1639815188546-c43c240ff4df?w=400&q=80'
    ]
  }
};

const PREFIXES = ['Cyber', 'Neon', 'Quantum', 'Void', 'Apex', 'Flux', 'Neural', 'Cosmic', 'Hyper', 'Data'];
const SUFFIXES = ['Cache', 'Vault', 'Node', 'Fragment', 'Core', 'Matrix', 'Pod', 'Link', 'Signal', 'Drive'];

const generateBoxes = (count: number): MarketBox[] => {
  return Array.from({ length: count }).map((_, i) => {
    // Distribuição de tiers
    let tier: BoxTier = 'Starter';
    if (i % 8 === 0) tier = 'Prestige';
    else if (i % 4 === 0) tier = 'Elite';
    else if (i % 2 === 0) tier = 'Advanced';

    const config = TIERS[tier];
    const name = `${PREFIXES[i % PREFIXES.length]} ${SUFFIXES[i % SUFFIXES.length]} ${i + 1}`;
    
    return {
      id: `box-${i}`,
      name: name,
      description: `Unidade de armazenamento ${tier} contendo ativos digitais verificados e recursos de rede.`,
      price: config.price,
      minValue: config.min,
      maxValue: config.max,
      tier: tier,
      coverImage: config.images[i % config.images.length],
      isHot: i === 0 || i === 7 || i === 14 // Alguns itens "Hot" espalhados
    };
  });
};

const BOXES = generateBoxes(28);

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