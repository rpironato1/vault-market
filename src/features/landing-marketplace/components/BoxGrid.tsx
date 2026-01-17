"use client";

import { motion } from 'framer-motion';
import { Package, Info, TrendUp } from '@phosphor-icons/react';
import { useMarketplaceStore } from '../infrastructure/store';
import { MarketBox, BoxTier } from '../domain/entities';
import { Tier } from '@core/domain/entities';
import { cn } from '@/lib/utils';
import { useStore } from '@infra/state/store';
import { showSuccess, showError } from '@/utils/toast';

const BoxCard = ({ box, onPurchase }: { box: MarketBox; onPurchase: (box: MarketBox) => void }) => {
  const isPrestige = box.tier === 'Legendary'; // Atualizado de Prestige para Legendary conforme contrato
  
  // Valores calculados para exibição (mocked based on tiers)
  // Em uma API real, isso viria do backend, mas o contrato ProductSchema não tem min/max value explícito,
  // então calculamos na UI para display ou deveríamos estender o contrato.
  // Vamos manter simples:
  const minValue = box.priceUsdt * 1.1;
  const maxValue = box.priceUsdt * 5;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col bg-[#121212] border rounded-2xl overflow-hidden transition-all duration-300 h-full",
        isPrestige ? "border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.05)]" : "border-white/5 hover:border-white/10"
      )}
    >
      {box.isHot && (
        <div className="absolute top-3 left-3 z-10 bg-[#FF007F] text-white text-[9px] font-black uppercase px-2 py-1 rounded-sm tracking-widest shadow-lg">
          Hot Offer
        </div>
      )}

      <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10" />
        <img 
          src={box.imageUrl} 
          alt={box.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-col p-5 flex-1 relative z-20 -mt-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col">
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1", isPrestige ? "text-[#FFD700]" : "text-zinc-500")}>
              {box.tier} Tier
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{box.name}</h3>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2">
            <Package size={20} className={isPrestige ? "text-[#FFD700]" : "text-white"} />
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-medium mb-6 line-clamp-2 leading-relaxed">
          {box.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="grid grid-cols-2 gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-zinc-600 uppercase">Min. Value</span>
              <span className="text-xs font-mono font-bold text-zinc-300">${minValue.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-zinc-600 uppercase">Max. Potential</span>
              <span className="text-xs font-mono font-bold text-[#00FF9C]">${maxValue.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-zinc-500 uppercase line-through opacity-50">
                 ${(box.priceUsdt * 1.2).toFixed(2)}
               </span>
               <span className="text-xl font-mono font-black text-white">
                 ${box.priceUsdt.toFixed(2)}
               </span>
            </div>
            <button 
              onClick={() => onPurchase(box)}
              className={cn(
                "h-10 px-5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95",
                isPrestige 
                  ? "bg-[#FFD700] text-black hover:bg-[#ffe033]" 
                  : "bg-white text-black hover:bg-zinc-200"
              )}
            >
              Comprar <TrendUp weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const BoxGrid = () => {
  const { availableBoxes, purchaseBox } = useMarketplaceStore();
  const { balance, setBalance, addVaultItem } = useStore();

  const handlePurchase = async (box: MarketBox) => {
    if (balance < box.priceUsdt) {
      showError("Saldo USDT insuficiente. Recarregue sua carteira Polygon.");
      return;
    }

    try {
      const reward = await purchaseBox(box.id);
      
      const { MockBackend } = await import('@infra/api/mock-backend');
      const balances = await MockBackend.getBalances();
      setBalance(balances.usdt);
      
      const tierMapping: Record<BoxTier, Tier> = {
        'Common': 'Common',
        'Rare': 'Rare',
        'Epic': 'Epic',
        'Legendary': 'Legendary'
      };

      addVaultItem({
        id: reward.id,
        name: reward.name,
        rarity: tierMapping[reward.tier],
        value: reward.value,
        timestamp: Date.now()
      });
      
      showSuccess("Item adicionado ao seu Vault com sucesso!");
    } catch (e) {
      console.error(e);
      showError("Erro ao processar transação.");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto py-16 px-6 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/5 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">Catálogo Oficial</h2>
          <p className="text-zinc-500 text-sm font-medium">Itens verificados com garantia de valor de revenda interna.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase bg-white/5 px-4 py-2 rounded-full">
          <Info size={16} />
          <span>Moedas não sacáveis • Uso exclusivo In-Game</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {availableBoxes.map(box => (
          <BoxCard key={box.id} box={box} onPurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
};