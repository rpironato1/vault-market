"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BoxCard from '@/features/marketplace/components/BoxCard';
import OpeningAnimation from '@/features/marketplace/components/OpeningAnimation';
import { MysteryBox, Reward } from '@/_core/domain/types';
import { useUserStore } from '../_infrastructure/state/useUserStore';
import { showSuccess, showError } from '@/utils/toast';

const MOCK_BOXES: MysteryBox[] = [
  {
    id: '1',
    name: 'Tech Genesis Box',
    description: 'Hardware e Gift Cards de alta performance.',
    price: 49.90,
    tier: 'Rare',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&auto=format&fit=crop&q=60',
    potentialRewards: []
  },
  {
    id: '2',
    name: 'Crypto Whale Vault',
    description: 'Ativos digitais e recompensas em tokens premium.',
    price: 199.99,
    tier: 'Legendary',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop&q=60',
    potentialRewards: []
  },
  {
    id: '3',
    name: 'Starter Essentials',
    description: 'O começo da sua jornada de colecionador.',
    price: 9.90,
    tier: 'Common',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=60',
    potentialRewards: []
  },
  {
    id: '4',
    name: 'Neon Cyber Unit',
    description: 'Exclusividade estética e utilidade em rede.',
    price: 85.00,
    tier: 'Epic',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60',
    potentialRewards: []
  }
];

const Index = () => {
  const { spendBalance, addReward } = useUserStore();
  const [isOpening, setIsOpening] = useState(false);
  const [activeReward, setActiveReward] = useState<Reward | null>(null);

  const handlePurchase = (id: string) => {
    const box = MOCK_BOXES.find(b => b.id === id);
    if (!box) return;

    if (spendBalance(box.price)) {
      setIsOpening(true);
      // Simulação de delay para criar antecipação (Greedy UX)
      setTimeout(() => {
        const reward: Reward = {
          id: `r-${Date.now()}`,
          name: `${box.tier} Collectible #${Math.floor(Math.random() * 1000)}`,
          rarity: box.tier,
          value: box.price * (Math.random() > 0.8 ? 5 : 0.8),
          type: 'ITEM'
        };
        setActiveReward(reward);
      }, 500);
    } else {
      showError("Saldo insuficiente para adquirir esta unidade.");
    }
  };

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground">Unidades de colecionáveis verificadas e seguras.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_BOXES.map((box) => (
          <BoxCard key={box.id} box={box} onPurchase={handlePurchase} />
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-8 border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Colete & Evolua</h2>
            <p className="text-muted-foreground text-sm">Ao adquirir unidades no Marketplace, você gera tokens de engajamento que podem ser utilizados na nossa Central de Experiências.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/tokens'}
            className="rounded-xl bg-emerald-500 px-8 py-4 font-bold text-black hover:bg-emerald-400 transition-colors"
          >
            IR PARA CENTRAL DE TOKENS
          </button>
        </div>
      </div>

      <OpeningAnimation 
        reward={activeReward} 
        onClose={() => {
          if (activeReward) addReward(activeReward);
          setIsOpening(false);
          setActiveReward(null);
          showSuccess("Item adicionado ao seu Vault com sucesso!");
        }} 
      />
    </AppLayout>
  );
};

export default Index;