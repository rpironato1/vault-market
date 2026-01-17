"use client";

import { motion } from 'framer-motion';
import { Package, TrendingUp, Info } from 'lucide-react';
import { MysteryBox } from '@core/domain/types';
import { cn } from '@/lib/utils';

interface BoxCardProps {
  box: MysteryBox;
  onPurchase: (id: string) => void;
}

const BoxCard = ({ box, onPurchase }: BoxCardProps) => {
  const tierColors = {
    Common: "border-slate-700 hover:border-slate-500 text-slate-400",
    Rare: "border-blue-900/50 hover:border-blue-500 text-blue-400",
    Epic: "border-purple-900/50 hover:border-purple-500 text-purple-400",
    Legendary: "border-amber-900/50 hover:border-amber-500 text-amber-400",
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
        tierColors[box.tier]
      )}
    >
      <div className="aspect-square overflow-hidden bg-gradient-to-b from-transparent to-black/20">
        <img 
          src={box.imageUrl} 
          alt={box.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-mono tracking-tighter backdrop-blur-md">
            <TrendingUp size={10} className="text-emerald-400" />
            HIGH VALUE
          </span>
        </div>
      </div>

      <div className="flex flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{box.tier} ASSET</span>
          <Info size={14} className="cursor-help opacity-40 hover:opacity-100" />
        </div>
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{box.name}</h3>
        
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-muted-foreground uppercase">Valor de Aquisição</span>
            <span className="font-mono text-lg font-bold text-emerald-400">${box.price.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => onPurchase(box.id)}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-emerald-400 active:scale-95"
          >
            <Package size={16} />
            ADQUIRIR
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BoxCard;