"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HighConversionCard from '@/features/marketplace/components/HighConversionCard';
import ImmersiveOpener from '@/features/marketplace/components/ImmersiveOpener';
import { MysteryBox, Reward } from '@/_core/domain/entities';
import { useStore } from '../_infrastructure/state/store';
import { showError } from '@/utils/toast';

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
    price: 14.50,
    tier: 'Common',
    description: 'Unidades de entrada para novos exploradores do ecossistema.',
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
  const { balance, updateBalance, addReward } = useStore();
  const [activeReward, setActiveReward] = useState<Reward | null>(null);

  const handleAcquire = (box: MysteryBox) => {
    if (balance >= box.price) {
      updateBalance(-box.price);
      
      const newReward: Reward = {
        id: `rw-${Math.random().toString(36).substr(2, 9)}`,
        name: `${box.name} Artifact`,
        rarity: box.tier,
        value: box.price * (Math.random() > 0.7 ? 1.5 : 0.8),
        timestamp: Date.now()
      };
      
      setActiveReward(newReward);
    } else {
      showError("Saldo insuficiente para sincronizar esta unidade.");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-12">
        <header className="relative py-16 px-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-[#121214] to-[#121214] border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 bg-emerald-500/10 blur-[100px]" />
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-6xl font-black tracking-tighter mb-6 uppercase text-white leading-none">
              Expanda sua <span className="text-emerald-500 italic">Rede.</span>
            </h1>
            <p className="text-xl text-zinc-300 font-medium leading-relaxed">
              Adquira unidades verificadas, sincronize seu vault e ganhe tokens de engajamento para validar novas experiências dentro do protocolo.
            </p>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
              Unidades Disponíveis
            </h2>
            <div className="flex gap-3">
              {['Common', 'Rare', 'Epic', 'Legendary'].map(t => (
                <span key={t} className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 uppercase text-zinc-500">
                  {t}
                </span>
              ))}
            </div>
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