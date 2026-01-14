"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HighConversionCard from '@/features/marketplace/components/HighConversionCard';
import ImmersiveOpener from '@/features/marketplace/components/ImmersiveOpener';
import StatsBanner from '@/features/marketplace/components/StatsBanner';
import GlobalTicker from '@/features/marketplace/components/GlobalTicker';
import { MysteryBox, Reward } from '@/_core/domain/entities';
import { useStore } from '../_infrastructure/state/store';
import { showError } from '@/utils/toast';
import { RocketLaunch, Fire } from '@phosphor-icons/react';

const BOX_REGISTRY: MysteryBox[] = [
  {
    id: 'box-mega',
    name: 'MILLIONAIRE VAULT',
    price: 1.00,
    tier: 'Legendary',
    description: 'A oportunidade máxima. Desbloqueie ativos de elite por uma fração do valor.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80'
  },
  {
    id: 'box-1',
    name: 'Cyber Sentinel Unit',
    price: 89.90,
    tier: 'Epic',
    description: 'Hardware criptográfico de alta fidelidade e acessos restritos de rede.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'
  },
  {
    id: 'box-4',
    name: 'Neural Node Box',
    price: 45.00,
    tier: 'Rare',
    description: 'Aprimoramentos de rede e pacotes de dados processados.',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&q=80'
  },
  {
    id: 'box-3',
    name: 'Core Starter Pack',
    price: 14.50,
    tier: 'Common',
    description: 'Unidades de entrada para novos exploradores do ecossistema.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80'
  }
];

const Marketplace = () => {
  const { balance, updateBalance, addReward } = useStore();
  const [activeReward, setActiveReward] = useState<Reward | null>(null);

  const handleAcquire = (box: MysteryBox) => {
    if (balance >= box.price) {
      updateBalance(-box.price);
      const newReward: Reward = {
        id: `rw-${Math.random().toString(36).substr(2, 9)}`,
        name: `${box.name} Artifact`,
        rarity: box.tier,
        value: box.price * (Math.random() > 0.8 ? 2.5 : 0.6),
        timestamp: Date.now()
      };
      setActiveReward(newReward);
    } else {
      showError("Saldo insuficiente. Realize um aporte para continuar.");
    }
  };

  return (
    <AppLayout>
      <GlobalTicker />
      <div className="flex flex-col gap-12">
        <header className="relative py-24 px-12 rounded-[2rem] bg-card border border-white/5 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 h-96 w-96 bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 bg-secondary/5 blur-[120px] rounded-full" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Fire className="text-emerald-500 animate-pulse" size={16} weight="fill" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Oportunidade Ativa</span>
              </div>
            </div>
            
            <h1 className="text-8xl font-black tracking-tighter mb-8 uppercase leading-[0.85] italic text-white">
              Abra a Caixa do <br />
              <span className="text-emerald-500 text-glow-emerald">Milhão por $1</span>
            </h1>
            
            <p className="text-2xl text-zinc-400 font-medium leading-relaxed max-w-2xl mb-12">
              Não é apenas uma compra. É a sua entrada no protocolo de elite. Sincronize agora e domine o mercado de unidades raras.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button 
                onClick={() => handleAcquire(BOX_REGISTRY[0])}
                className="h-20 px-12 bg-emerald-500 text-black font-black text-xl rounded-2xl hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_40px_rgba(0,255,156,0.3)]"
              >
                COMEÇAR AGORA <RocketLaunch weight="bold" size={24} />
              </button>
              <StatsBanner />
            </div>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white flex items-center gap-4 italic">
              <span className="h-4 w-1 bg-emerald-500" />
              Mercado de Unidades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BOX_REGISTRY.map((box) => (
              <HighConversionCard key={box.id} box={box} onSelect={handleAcquire} />
            ))}
          </div>
        </section>

        <ImmersiveOpener 
          reward={activeReward} 
          onClose={() => {
            if (activeReward) addReward(activeReward);
            setActiveReward(null);
          }} 
        />
      </div>
    </AppLayout>
  );
};

export default Marketplace;