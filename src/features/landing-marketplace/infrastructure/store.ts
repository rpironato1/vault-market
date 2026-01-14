import { create } from 'zustand';
import { MarketBox, UnboxedItem, BoxTier } from '../domain/entities';

// CURADORIA DE 28 IMAGENS ÚNICAS, FUNCIONAIS E TESTADAS
const UNIQUE_CURATED_IMAGES = [
  // --- STARTER TIER (Gadgets, Consoles, Neon Básico) ---
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', // 0: Cyber Cache
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', // 1: Neon Vault
  'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=800', // 2: Quantum Node
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', // 3: Void Fragment
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', // 4: Apex Core
  'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800', // 5: Flux Matrix
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', // 6: Neural Pod
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800', // 7: Cosmic Link

  // --- ADVANCED TIER (Hardware, Circuitos, Infraestrutura) ---
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800', // 8: Hyper Signal
  'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800', // 9: Data Drive
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800', // 10: Solar Shard
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', // 11: Lunar Gate
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', // 12: Mecha Key
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800', // 13: Nano Lock
  'https://images.unsplash.com/photo-1563770095-2587008675ba?auto=format&fit=crop&q=80&w=800', // 14: Cyber Cache (loop)
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800', // 15: Neon Vault (loop)

  // --- ELITE TIER (Segurança, Criptografia, Abstrato Dark) ---
  'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80&w=800', // 16
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', // 17
  'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=800', // 18
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800', // 19
  'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=800', // 20
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', // 21

  // --- PRESTIGE TIER (Ouro, High-End, Cosmic Crypto) ---
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', // 22
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800', // 23
  'https://images.unsplash.com/photo-1639815188546-c43c240ff4df?auto=format&fit=crop&q=80&w=800', // 24
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800', // 25
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bc04?auto=format&fit=crop&q=80&w=800', // 26
  'https://images.unsplash.com/photo-1642104704074-907c0698b98d?auto=format&fit=crop&q=80&w=800'  // 27
];

const TIER_CONFIG: Record<BoxTier, { price: number; min: number; max: number }> = {
  Starter: { price: 4.90, min: 5.00, max: 15.00 },
  Advanced: { price: 19.90, min: 21.00, max: 50.00 },
  Elite: { price: 49.90, min: 55.00, max: 200.00 },
  Prestige: { price: 99.90, min: 110.00, max: 1000.00 }
};

const PREFIXES = ['Cyber', 'Neon', 'Quantum', 'Void', 'Apex', 'Flux', 'Neural', 'Cosmic', 'Hyper', 'Data', 'Solar', 'Lunar', 'Mecha', 'Nano'];
const SUFFIXES = ['Cache', 'Vault', 'Node', 'Fragment', 'Core', 'Matrix', 'Pod', 'Link', 'Signal', 'Drive', 'Shard', 'Gate', 'Key', 'Lock'];

const generateBoxes = (): MarketBox[] => {
  return UNIQUE_CURATED_IMAGES.map((imageUrl, i) => {
    let tier: BoxTier = 'Starter';
    if (i >= 22) tier = 'Prestige';
    else if (i >= 16) tier = 'Elite';
    else if (i >= 8) tier = 'Advanced';
    else tier = 'Starter';

    const config = TIER_CONFIG[tier];
    const prefix = PREFIXES[i % PREFIXES.length];
    const suffix = SUFFIXES[i % SUFFIXES.length];
    
    return {
      id: `box-${i + 1}`,
      name: `${prefix} ${suffix} unit`,
      description: `Unidade de custódia ${tier} com ativos digitais de alta fidelidade e valor garantido.`,
      price: config.price,
      minValue: config.min,
      maxValue: config.max,
      tier: tier,
      coverImage: imageUrl,
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