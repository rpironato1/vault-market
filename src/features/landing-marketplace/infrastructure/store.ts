import { create } from 'zustand';
import { MarketBox, UnboxedItem, BoxTier } from '../domain/entities';

// Lista curada de 28 imagens únicas (Cyberpunk, Tech, 3D Abstract)
const UNIQUE_IMAGES = [
  // Starter Tier (Tech Básica, Gadgets, Neon Leve) - 8 Imagens
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
  'https://images.unsplash.com/photo-1592478411213-61535fdd861d?w=500&q=80',
  'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=500&q=80',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&q=80',
  'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=500&q=80',
  'https://images.unsplash.com/photo-1607799275518-d6e690c7b050?w=500&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',

  // Advanced Tier (Hardware, Servidores, Circuitos) - 8 Imagens
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
  'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80',
  'https://images.unsplash.com/photo-1535378437327-1e8c83279326?w=500&q=80',
  'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=500&q=80',
  'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=500&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&q=80',
  'https://images.unsplash.com/photo-1563770095-2587008675ba?w=500&q=80',

  // Elite Tier (Abstrato Dark, Criptografia, Segurança) - 6 Imagens
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
  'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=500&q=80',
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&q=80',
  'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80',

  // Prestige Tier (Ouro, Crypto High-End, Luxo Futurista) - 6 Imagens
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80',
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=500&q=80',
  'https://images.unsplash.com/photo-1639815188546-c43c240ff4df?w=500&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80',
  'https://images.unsplash.com/photo-1504384308090-c54be3852f92?w=500&q=80',
  'https://images.unsplash.com/photo-1642104704074-907c0698b98d?w=500&q=80'
];

// Configurações de preço por Tier
const TIER_CONFIG: Record<BoxTier, { price: number; min: number; max: number }> = {
  Starter: { price: 4.90, min: 5.00, max: 15.00 },
  Advanced: { price: 19.90, min: 21.00, max: 50.00 },
  Elite: { price: 49.90, min: 55.00, max: 200.00 },
  Prestige: { price: 99.90, min: 110.00, max: 1000.00 }
};

const PREFIXES = ['Cyber', 'Neon', 'Quantum', 'Void', 'Apex', 'Flux', 'Neural', 'Cosmic', 'Hyper', 'Data', 'Solar', 'Lunar', 'Mecha', 'Nano'];
const SUFFIXES = ['Cache', 'Vault', 'Node', 'Fragment', 'Core', 'Matrix', 'Pod', 'Link', 'Signal', 'Drive', 'Shard', 'Gate', 'Key', 'Lock'];

const generateBoxes = (): MarketBox[] => {
  return UNIQUE_IMAGES.map((imageUrl, i) => {
    // Distribuição Determinística de Tiers baseada no índice da imagem
    let tier: BoxTier = 'Starter';
    if (i >= 22) tier = 'Prestige';       // Últimas 6
    else if (i >= 16) tier = 'Elite';     // 6 anteriores
    else if (i >= 8) tier = 'Advanced';   // 8 anteriores
    else tier = 'Starter';                // Primeiras 8

    const config = TIER_CONFIG[tier];
    
    // Nomes pseudo-aleatórios mas consistentes pelo índice
    const prefix = PREFIXES[i % PREFIXES.length];
    const suffix = SUFFIXES[i % SUFFIXES.length];
    const name = `${prefix} ${suffix} ${i < 9 ? '0' + (i + 1) : i + 1}`;
    
    return {
      id: `box-${i + 1}`,
      name: name,
      description: `Unidade classificada ${tier}. Contém ativos digitais verificados e recursos exclusivos de rede.`,
      price: config.price,
      minValue: config.min,
      maxValue: config.max,
      tier: tier,
      coverImage: imageUrl,
      isHot: i === 0 || i === 11 || i === 22 || i === 27 // Destaques estratégicos
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