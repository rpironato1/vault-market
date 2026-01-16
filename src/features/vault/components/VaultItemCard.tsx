"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, HardDrive } from '@phosphor-icons/react';
import { Reward } from '@core/domain/types';
import { cn } from '@/lib/utils';

interface Props {
  item: Reward;
}

const VaultItemCard = ({ item }: Props) => {
  const rarityColors = {
    Common: "text-zinc-500 border-zinc-500/20",
    Rare: "text-blue-400 border-blue-400/20",
    Epic: "text-purple-400 border-purple-400/20",
    Legendary: "text-[#FFD700] border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative bg-[#121212] border rounded-2xl p-5 overflow-hidden transition-all hover:bg-[#181818]",
        rarityColors[item.rarity] || rarityColors.Common
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
          {item.rarity === 'Legendary' ? <Cpu weight="fill" size={20} /> : <HardDrive weight="bold" size={20} />}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">Hash ID</span>
          <span className="font-mono text-[9px] text-white">0x{item.id.substring(0, 8).toUpperCase()}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-black text-lg tracking-tighter uppercase leading-tight mb-1 truncate">
          {item.name}
        </h3>
        <div className="flex items-center gap-2">
          <div className={cn("h-1.5 w-1.5 rounded-full", item.rarity === 'Legendary' ? 'bg-[#FFD700] animate-pulse' : 'bg-current')} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{item.rarity}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-40 text-zinc-400">Valor de Base</span>
          <span className="text-emerald-500 font-mono font-black text-md">${item.value.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">
          <ShieldCheck size={12} />
          <span>CUSTODY</span>
        </div>
      </div>
      
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-b from-emerald-500 via-transparent to-transparent h-1 w-full animate-[scan_2s_linear_infinite]" />
    </motion.div>
  );
};

export default VaultItemCard;