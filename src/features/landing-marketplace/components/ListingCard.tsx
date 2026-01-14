import React from 'react';
import { RetailBox } from '../domain/types';
import { ArrowRight, Lock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  box: RetailBox;
  onPurchase: (id: string) => void;
  disabled?: boolean;
}

export const ListingCard = ({ box, onPurchase, disabled }: Props) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden bg-zinc-900">
        <img 
          src={box.coverImage} 
          alt={box.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {box.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-black/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider rounded-md border border-white/10">
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute bottom-4 right-4">
           <div className="bg-emerald-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
             Min. ${box.minValue.toFixed(2)}
           </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white tracking-tight">{box.title}</h3>
          <Info size={16} className="text-zinc-600 hover:text-white cursor-help transition-colors" />
        </div>
        
        <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6 flex-1">
          {box.description}
        </p>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Preço Unitário</span>
            <span className="text-2xl font-mono font-bold text-white">${box.price.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => onPurchase(box.id)}
            disabled={disabled}
            className={cn(
              "h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all",
              disabled 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                : "bg-white text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
            )}
          >
            {disabled ? <Lock size={16} /> : <ArrowRight size={16} />}
            <span>{disabled ? 'Processando' : 'Comprar'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};