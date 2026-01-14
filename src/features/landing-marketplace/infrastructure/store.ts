import { create } from 'zustand';
import { MarketBox, UnboxedItem, BoxTier } from '../domain/entities';

/**
 * CURADORIA VISUAL - VAULTNET ASSETS (28 UNIQUE IMAGES)
 * Selecionadas para coerência temática: Cyberpunk, Tech, Hardware e Crypto-Luxury.
 */
const UNIQUE_IMAGES = [
  // --- TIER: STARTER (8 ITENS - Estética: Gadgets, Neon, Interfaces Básicas) ---
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', // Retro PC
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', // Blue Circuit
  'https://images.unsplash.com/photo-1539627672810-1d87e1741f77?w=600&q=80', // Neon Sign
  'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80', // Tech Abstract
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', // Matrix Stream
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80', // Digital Waves
  'https://images.unsplash.com/photo-1607799275518-d6e690c7b050?w=600&q=80', // Neon Grid
  'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&q=80', // Hologram Light

  // --- TIER: ADVANCED (8 ITENS - Estética: Servidores, Robótica, Hardware Industrial) ---
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=80', // CPU Close-up
  'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80', // Robotic Hand
  'https://images.unsplash.com/photo-1519389665022-38605544218e?w=600&q=80', // GPU Components
  'https://images.unsplash.com/photo-1531297442659-435203b394ae?w=600&q=80', // Datacenter
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80', // Cybernetic Detail
  'https://images.unsplash.com/photo-1563770095-2587008675ba?w=600&q=80', // Internal Circuit
  'https://images.unsplash.com/photo-1523961131910-447998bb2117?w=600&q=80', // Light Trails
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', // Tech Lab

  // --- TIER: ELITE (6 ITENS - Estética: Criptografia, Geometria Complexa, Dark Tech) ---
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', // Dark Gradient
  'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=600&q=80', // Neural Network
  'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80', // Particles
  'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=600&q=80', // Data Vortex
  'https://images.unsplash.com/photo-1633167606259-22767280bdba?w=600&q=80', // Tech Monolith
  'https://images.unsplash.com/photo-1639322537275-3f00013d8e31?w=600&q=80', // Polygon Dark

  // --- TIER: PRESTIGE (6 ITENS - Estética: Ouro, Crypto-Luxury, High-End FinTech) ---
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80', // Ethereum Gold
  'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600&q=80', // Abstract Gold
  'https://images.unsplash.com/photo-1639815188546-c43c240ff4df?w=600&q=80', // Crypto Physical
  'https://images.unsplash.com/photo-1642104704074-907c0698b98d?w=600&q=80', // Golden Grid
  'https://images.unsplash.com/photo-1634017839545-2967657a7024?w=600&q=80', // Liquid Gold
  'https://images.unsplash.com/photo-1624390313131-42269e8a754a?w=600&q=80', // Luxury Interface
];

const TIER_CONFIG: Record<BoxTier, { price: number; min: number; max: number }> = {
  Starter: { price: 4.90, min: 5.00, max: 15.00 },
  Advanced: { price: 19.90, min: 21.00, max: 50.00 },
  Elite: { price: 49.90, min: 55.00, max: 200.00 },
  Prestige: { price: 99.90, min: 110.00, max: 1000.00 }
};

const PREFIXES = ['Quantum', 'Neural', 'Cyber', 'Void', 'Apex', 'Flux', 'Aether', 'Hyper', 'Data', 'Prime', 'Solar', 'Lunar', 'Mecha', 'Nano'];
const SUFFIXES = ['Module', 'Node', 'Vault', 'Fragment', 'Core', 'Matrix', 'Link', 'Signal', 'Drive', 'Shard', 'Gate', 'Key', 'Lock', 'Cell'];

const generateBoxes = (): MarketBox[] => {
  return UNIQUE_IMAGES.map((imageUrl, i) => {
    // Mapeamento de Tiers baseado na posição da imagem (Alinhado com a curadoria)
    let tier: BoxTier = 'Starter';
    if (i >= 22) tier = 'Prestige';
    else if (i >= 16) tier = 'Elite';
    else if (i >= 8) tier = 'Advanced';
    else tier = 'Starter';

    const config = TIER_CONFIG[tier];
    const name = `${PREFIXES[i % PREFIXES.length]} ${SUFFIXES[i % SUFFIXES.length]} ${i < 9 ? '0' + (i + 1) : i + 1}`;
    
    return {
      id: `box-${i + 1}`,
      name: name,
      description: `Unidade classificada ${tier}. Distribuição garantida de ativos de rede com valor de resgate verificado.`,
      price: config.price,
      minValue: config.min,
      maxValue: config.max,
      tier: tier,
      coverImage: imageUrl,
      isHot: i === 0 || i === 10 || i === 18 || i === 22 // Itens estratégicos em destaque
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
    
    // Simulação de processamento seguro (Block-wait)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const box = get().availableBoxes.find(b => b.id === boxId);
    if (!box) throw new Error("Box not found");

    // REGRA DE NEGÓCIO: Valor do prêmio sempre superior ao custo (Market-driven guarantee)
    const bonusFactor = 1 + (Math.random() * 0.45); 
    const value = Math.max(box.minValue, box.price * bonusFactor);

    const reward: UnboxedItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${box.tier} Asset Bundle`,
      type: 'GAME_CURRENCY',
      value: Number(value.toFixed(2)),
      tier: box.tier
    };

    set({ isOpening: false, lastReward: reward });
    return reward;
  },

  resetReward: () => set({ lastReward: null })
}));