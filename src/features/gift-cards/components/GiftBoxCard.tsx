import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Tag } from 'lucide-react';
import { Coins } from '@phosphor-icons/react';
import { GiftBoxTier } from '../domain/entities';
import { cn } from '@/lib/utils';

interface Props {
  tier: GiftBoxTier;
  onSelect: (tier: GiftBoxTier) => void;
  disabled: boolean;
}

export const GiftBoxCard = ({ tier, onSelect, disabled }: Props) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(tier)}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-between p-6 rounded-2xl border transition-all duration-300 group text-left w-full h-full",
        "bg-[#121212] border-white/5 hover:border-emerald-500/50 hover:bg-[#121212]/80"
      )}
    >
      <div className="w-full flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/5 text-emerald-500 group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
          <Gift size={24} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-black/40 px-2 py-1 rounded-md">
           <Tag size={10} />
           <span>18 Marcas</span>
        </div>
      </div>

      <div className="w-full mb-6">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
          {tier.name}
        </h3>
        <p className="text-xs text-zinc-500 font-medium">
          Retorno estimado: <span className="text-zinc-300">{(tier.guaranteedMinMultiplier * 100).toFixed(0)}%+</span>
        </p>
      </div>

      <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">Entrada</span>
          <span className="text-xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors">
            ${tier.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
             <Coins size={16} weight="fill" />
           </div>
        </div>
      </div>
    </motion.button>
  );
};