import { create } from 'zustand';
import { MarketBox, UnboxedItem, BoxTier } from '../domain/entities';
import { MockBackend } from '@infra/api/mock-backend';

// CURADORIA E CONFIGURAÇÃO
const UNIQUE_CURATED_IMAGES = [
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
  'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&q=80',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=800&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
  'https://images.unsplash.com/photo-1563770095-2587008675ba?w=800&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80',
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80',
  'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80',
  'https://images.unsplash.com/photo-1639815188546-c43c240ff4df?w=800&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bc04?w=800&q=80',
  'https://images.unsplash.com/photo-1642104704074-907c0698b98d?w=800&q=80'
];

const TIER_CONFIG: Record<BoxTier, { price: number; min: number; max: number }> = {
  Common: { price: 4.90, min: 5.00, max: 15.00 },
  Rare: { price: 19.90, min: 21.00, max: 50.00 },
  Epic: { price: 49.90, min: 55.00, max: 200.00 },
  Legendary: { price: 99.90, min: 110.00, max: 1000.00 }
};

const PREFIXES = ['Cyber', 'Neon', 'Quantum', 'Void', 'Apex', 'Flux', 'Neural', 'Cosmic', 'Hyper', 'Data', 'Solar', 'Lunar', 'Mecha', 'Nano'];
const SUFFIXES = ['Cache', 'Vault', 'Node', 'Fragment', 'Core', 'Matrix', 'Pod', 'Link', 'Signal', 'Drive', 'Shard', 'Gate', 'Key', 'Lock'];

const generateBoxes = (): MarketBox[] => {
  return UNIQUE_CURATED_IMAGES.map((imageUrl, i) => {
    let tier: BoxTier = 'Common';
    if (i >= 22) tier = 'Legendary';
    else if (i >= 16) tier = 'Epic';
    else if (i >= 8) tier = 'Rare';
    else tier = 'Common';

    const config = TIER_CONFIG[tier];
    
    const prefix = PREFIXES[i % PREFIXES.length];
    const suffix = SUFFIXES[i % SUFFIXES.length];
    const name = `${prefix} ${suffix} unit`;
    
    return {
      id: `box-${i + 1}`,
      name: name,
      description: `Unidade de custódia ${tier} com ativos digitais de alta fidelidade e valor garantido.`,
      priceUsdt: config.price, // Alterado de price para priceUsdt conforme contrato
      bonusVaultCoins: 0, // Adicionado conforme contrato (mock)
      stock: 100, // Adicionado conforme contrato (mock)
      imageUrl: imageUrl, // Alterado de coverImage para imageUrl conforme contrato
      tier: tier,
      isHot: i === 0 || i === 11 || i === 22 || i === 27
    };
  });
};

const BOXES = generateBoxes();

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
    
    const box = get().availableBoxes.find(b => b.id === boxId);
    if (!box) throw new Error("Box not found");

    try {
      // Chama o backend para processar a compra
      const result = await MockBackend.purchaseBox(boxId, box.priceUsdt);
      
      const reward: UnboxedItem = {
        id: result.reward.id,
        name: result.reward.name,
        type: 'GAME_CURRENCY',
        value: result.reward.value,
        tier: result.reward.rarity as BoxTier
      };

      set({ isOpening: false, lastReward: reward });
      return reward;
    } catch (e) {
      set({ isOpening: false });
      throw e;
    }
  },

  resetReward: () => set({ lastReward: null })
}));