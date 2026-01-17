"use client";

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { HighConversionCard, NearMissOpener } from '@/features/marketplace';
import { LiveTicker } from '@/features/marketing';
import { MysteryBox, Reward } from '@core/domain/entities';
import { useStore } from '@infra/state/store';
import { showError } from '@/utils/toast';
import { UserCirclePlus } from '@phosphor-icons/react';

const BOX_REGISTRY: MysteryBox[] = [
  {
    id: 'box-1',
    name: 'Cyber Sentinel Unit',
    price: 89.90,
    tier: 'Epic',
    description: 'Hardware criptográfico de alta fidelidade e acessos restritos de rede.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
  },
  {
    id: 'box-2',
    name: 'Apex Liquidity Vault',
    price: 249.00,
    tier: 'Legendary',
    description: 'A maior probabilidade de ativos de alta liquidez e tokens raros.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80'
  },
  {
    id: 'box-3',
    name: 'Core Starter Pack',
    price: 1.00,
    tier: 'Common',
    description: 'Abra a Caixa do Milhão por apenas $1. Oportunidade limitada.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80'
  },
  {
    id: 'box-4',
    name: 'Neural Node Box',
    price: 45.00,
    tier: 'Rare',
    description: 'Aprimoramentos de rede e pacotes de dados processados.',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80'
  }
];

const Marketplace = () => {
  const { balance, setBalance, addVaultItem } = useStore();
  const [activeReward, setActiveReward] = useState<Reward | null>(null);

  const handleAcquire = (box: MysteryBox) => {
    if (balance >= box.price) {
      setBalance(balance - box.price);
      const newReward: Reward = {
        id: `rw-${Math.random().toString(36).substr(2, 9)}`,
        name: `${box.name} Artifact`,
        rarity: box.tier,
        value: box.price * (Math.random() > 0.7 ? 1.5 : 0.8),
        timestamp: Date.now()
      };
      setActiveReward(newReward);
    } else {
      showError("Saldo USDT insuficiente. Recarregue sua carteira Polygon.");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-12 relative">
        <header className="relative py-24 px-12 rounded-[40px] bg-surface-card border border-white/5 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 flex flex-col items-end gap-1">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Payout</span>
             <span className="text-3xl font-mono font-black text-accent-emerald tracking-tighter">$1.482.020,42</span>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
               <div className="h-6 w-12 rounded-full bg-danger-neon/10 border border-danger-neon/20 flex items-center justify-center">
                  <span className="text-[9px] font-black text-danger-neon uppercase tracking-widest animate-pulse">Live</span>
               </div>
               <span className="text-xs font-bold text-zinc-400">1.240 usuários ativos agora</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter mb-8 uppercase text-white leading-[0.9]">
              Abra a Caixa do <br />
              <span className="text-prestige-gold italic">Milhão por $1.</span>
            </h1>
            <div className="flex items-center gap-6">
               <button className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3">
                  <UserCirclePlus weight="fill" size={24} />
                  Acesso Instantâneo
               </button>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ticket Médio de Volta</span>
                  <span className="text-accent-emerald font-black text-xl">+142%</span>
               </div>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 h-96 w-96 bg-accent-emerald/5 blur-[120px] rounded-full" />
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Marketplace de Oportunidades</h2>
               <div className="h-8 w-px bg-white/10" />
               <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Sincronia Global</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BOX_REGISTRY.map((box) => (
              <HighConversionCard key={box.id} box={box} onSelect={handleAcquire} />
            ))}
          </div>
        </section>

        <LiveTicker />

        <NearMissOpener 
          reward={activeReward} 
          onClose={() => {
            if (activeReward) addVaultItem(activeReward);
            setActiveReward(null);
          }} 
        />
      </div>
    </AppLayout>
  );
};

export default Marketplace;