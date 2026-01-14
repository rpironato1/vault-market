"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Tag, Cpu, ShareNetwork } from '@phosphor-icons/react';
import { Reward } from '../../../_core/domain/entities';
import { cn } from '@/lib/utils';

interface Props {
  item: Reward;
}

const VaultItemCard = ({ item }: Props) => {
  const rarityColors = {
    Common: "text-slate-400 border-white/5",
    Rare: "text-blue-400 border-blue-500/20",
    Epic: "text-purple-400 border-purple-500/20",
    Legendary: "text-emerald-400 border-emerald-500/20",
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative rounded-xl border bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all duration-300",
        rarityColors[item.rarity]
      )}
    >
      <div className="aspect-square rounded-lg bg-black/40 mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-5" />
        <Cpu weight="duotone" className="h-12 w-12 opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="absolute top-2 right-2">
           <ShieldCheck weight="fill" className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{item.rarity}</span>
          <span className="text-[9px] font-mono opacity-40">#{item.id.slice(-4)}</span>
        </div>
        <h4 className="font-bold text-sm truncate text-white">{item.name}</h4>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="opacity-40" />
            <span className="font-mono text-xs font-bold">${item.value.toFixed(2)}</span>
          </div>
          <button className="text-white/20 hover:text-emerald-400 transition-colors">
            <ShareNetwork size={14} weight="bold" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VaultItemCard;