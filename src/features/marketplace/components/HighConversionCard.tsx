"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cube, Info } from '@phosphor-icons/react';
import { MysteryBox } from '../../../_core/domain/entities';
import { cn } from '@/lib/utils';

interface Props {
  box: MysteryBox;
  onSelect: (box: MysteryBox) => void;
}

const HighConversionCard = ({ box, onSelect }: Props) => {
  const tierStyles = {
    Common: "border-white/10 hover:border-white/30",
    Rare: "border-blue-500/30 hover:border-blue-500/60",
    Epic: "border-purple-500/30 hover:border-purple-500/60",
    Legendary: "border-emerald-500/30 hover:border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={() => onSelect(box)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl border bg-[#121214] p-5 transition-all duration-500",
        tierStyles[box.tier]
      )}
    >
      <div className="relative aspect-square mb-6 overflow-hidden rounded-xl bg-zinc-900">
        <motion.img 
          src={box.imageUrl} 
          alt={box.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-2 rounded-full bg-black/80 px-3 py-1.5 backdrop-blur-md border border-white/10">
             <div className={cn("h-2 w-2 rounded-full", 
               box.tier === 'Legendary' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400')} />
             <span className="text-[11px] font-bold text-white uppercase tracking-wider">{box.tier}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-xl font-bold tracking-tight mb-2 text-white">{box.name}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 h-10 leading-relaxed">{box.description}</p>
        
        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Investimento</span>
            <span className="font-mono text-xl font-bold text-emerald-400">${box.price.toFixed(2)}</span>
          </div>
          <button className="flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            OBTER
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HighConversionCard;