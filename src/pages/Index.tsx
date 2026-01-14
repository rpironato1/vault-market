"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMarketplaceController } from '@/features/landing-marketplace/hooks/useMarketplaceController';
import { MarketHero } from '@/features/landing-marketplace/components/MarketHero';
import { ListingCard } from '@/features/landing-marketplace/components/ListingCard';
import { PurchaseReveal } from '@/features/landing-marketplace/components/PurchaseReveal';
import { Tag } from 'lucide-react';

const MarketplaceLanding = () => {
  const { 
    availableBoxes, 
    purchaseBox, 
    isProcessing, 
    activeReward, 
    closeRewardModal 
  } = useMarketplaceController();

  return (
    <AppLayout>
      <div className="flex flex-col max-w-[1600px] mx-auto">
        <MarketHero />

        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="p-2 bg-zinc-900 rounded-lg">
            <Tag size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Catálogo Disponível
          </h2>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {availableBoxes.map((box) => (
            <ListingCard 
              key={box.id} 
              box={box} 
              onPurchase={purchaseBox}
              disabled={isProcessing}
            />
          ))}
        </div>

        <PurchaseReveal 
          reward={activeReward} 
          onClose={closeRewardModal} 
        />
        
        {/* Footer Simples de Disclaimer */}
        <div className="mt-20 border-t border-white/5 pt-8 text-center">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            VaultNet Marketplace &copy; 2024. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-zinc-700 mt-2 max-w-2xl mx-auto">
            Os itens adquiridos neste marketplace possuem valor garantido superior ao preço de compra. 
            Moedas de jogo (Game Tokens) são ativos de utilidade interna e não possuem valor de saque em moeda fiduciária.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketplaceLanding;