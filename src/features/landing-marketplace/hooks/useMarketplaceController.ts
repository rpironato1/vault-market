"use client";

import { useState } from 'react';
import { useStore } from '@/_infrastructure/state/store';
import { RetailBox, RetailReward } from '../domain/types';
import { showSuccess, showError } from '@/utils/toast';

const CATALOG: RetailBox[] = [
  {
    id: 'box-starter',
    title: 'Starter Access',
    description: 'Entrada garantida no ecossistema com retorno imediato em tokens de utilidade.',
    price: 10.00,
    minValue: 10.50,
    maxValue: 50.00,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
    tags: ['Popular', 'Risco Zero'],
    category: 'Starter'
  },
  {
    id: 'box-tech',
    title: 'Tech Vault',
    description: 'Hardware, Gift Cards e Ativos Digitais de alta liquidez.',
    price: 49.90,
    minValue: 55.00,
    maxValue: 500.00,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    tags: ['Hardware', 'Gift Cards'],
    category: 'Premium'
  },
  {
    id: 'box-legendary',
    title: 'Apex Collection',
    description: 'A coleção definitiva. Apenas itens Tier-S e multiplicadores de conta.',
    price: 199.00,
    minValue: 210.00,
    maxValue: 2500.00,
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
    tags: ['High Value', 'VIP Access'],
    category: 'Limited'
  }
];

export const useMarketplaceController = () => {
  const { balance, updateBalance, addReward } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReward, setActiveReward] = useState<RetailReward | null>(null);

  const purchaseBox = async (boxId: string) => {
    const box = CATALOG.find(b => b.id === boxId);
    if (!box) return;

    if (balance < box.price) {
      showError("Saldo insuficiente. Realize um depósito para adquirir.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const valueMultiplier = 1.1 + Math.random() * 0.5;
      const prizeValue = box.price * valueMultiplier;
      
      const isCurrency = Math.random() > 0.3;
      
      const reward: RetailReward = {
        id: crypto.randomUUID(),
        name: isCurrency ? `${Math.floor(prizeValue * 10)} Game Tokens` : 'Mystery Item T-1',
        type: isCurrency ? 'GAME_CURRENCY' : 'GIFT_CARD',
        value: prizeValue,
        isWithdrawable: !isCurrency
      };

      updateBalance(-box.price);
      
      addReward({
        id: reward.id,
        name: reward.name,
        rarity: box.category === 'Limited' ? 'Legendary' : 'Common',
        value: reward.value,
        timestamp: Date.now()
      });

      setActiveReward(reward);
      setIsProcessing(false);
      
      showSuccess(`Compra realizada! Item adicionado ao Vault.`);
    }, 1000);
  };

  const closeRewardModal = () => setActiveReward(null);

  return {
    availableBoxes: CATALOG,
    purchaseBox,
    isProcessing,
    activeReward,
    closeRewardModal
  };
};