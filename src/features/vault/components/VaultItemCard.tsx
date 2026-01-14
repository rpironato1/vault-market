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
    Common: "text-zinc-400 border-white/10",
    Rare: "text-blue-400 border-blue-500/40",
    Epic: "text-purple-400 border-purple-500/40",
    Legendary: "text-emerald-400 border-emerald-500/40",
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative rounded-xl border bg-[#121214] p-5 hover:bg-[#161618] transition-all duration-300",
        rarityColors[item.rarity]
      )}
    >
      <div className="aspect-square rounded-lg bg-black mb-4 flex items-center justify-center relative overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-10" />
        <Cpu weight="duotone" className="h-16 w-16 opacity-30 group-hover:opacity-60 transition-opacity" />
        <div className="absolute top-3 right-3">
           <ShieldCheck weight="fill" className="h-5 w-5 text-emerald-500" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-current transition-colors">{item.rarity}</span>
          <span className="text-[10px] font-mono text-zinc-600 font-bold">#{item.id.slice(-4)}</span>
        </div>
        <h4 className="font-bold text-base truncate text-white">{item.name}</h4>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-zinc-500" />
            <span className="font-mono text-sm font-bold text-emerald-400">${item.value.toFixed(2)}</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
            <ShareNetwork size={18} weight="bold" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VaultItemCard;