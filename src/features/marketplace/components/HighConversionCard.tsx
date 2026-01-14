"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cube, TreedingUp, Info } from '@phosphor-icons/react';
import { MysteryBox } from '../../../_core/domain/entities';
import { cn } from '@/lib/utils';

interface Props {
  box: MysteryBox;
  onSelect: (box: MysteryBox) => void;
}

const HighConversionCard = ({ box, onSelect }: Props) => {
  const tierStyles = {
    Common: "border-white/5 hover:border-white/20",
    Rare: "border-blue-500/20 hover:border-blue-500/40",
    Epic: "border-purple-500/20 hover:border-purple-500/40",
    Legendary: "border-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={() => onSelect(box)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl border bg-white/[0.02] p-4 transition-all duration-500",
        tierStyles[box.tier]
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      
      <div className="relative aspect-square mb-6 overflow-hidden rounded-xl">
        <motion.img 
          src={box.imageUrl} 
          alt={box.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-md">
             <div className={cn("h-1.5 w-1.5 rounded-full", 
               box.tier === 'Legendary' ? 'bg-emerald-400 animate-pulse' : 'bg-white/40')} />
             <span className="text-[10px] font-bold uppercase tracking-widest">{box.tier}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <h3 className="text-lg font-bold tracking-tight mb-1">{box.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">{box.description}</p>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Custo de Aquisição</span>
            <span className="font-mono text-lg font-bold text-emerald-400">${box.price.toFixed(2)}</span>
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            OBTER
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HighConversionCard;