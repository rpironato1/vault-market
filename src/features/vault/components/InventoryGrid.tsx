"use client";

import { motion } from 'framer-motion';
import { Reward } from '@core/domain/types';
import { ShieldCheck, Tag, ExternalLink } from 'lucide-react';

interface InventoryGridProps {
  items: Reward[];
}

const InventoryItem = ({ item }: { item: Reward }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="group relative rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-all"
  >
    <div className="aspect-square rounded-lg bg-black/40 mb-4 flex items-center justify-center overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&auto=format&fit=crop&q=60" 
        alt={item.name} 
        className="opacity-50 group-hover:opacity-80 transition-opacity"
      />
      <div className="absolute top-6 right-6">
         <ShieldCheck className="text-emerald-500 h-4 w-4" />
      </div>
    </div>
    
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{item.rarity}</span>
      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Tag size={12} />
          <span className="text-[10px] font-mono">${item.value.toFixed(2)}</span>
        </div>
        <button className="text-white/40 hover:text-white transition-colors">
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

const InventoryGrid = ({ items }: InventoryGridProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
        <ShieldCheck className="text-white/10 h-12 w-12 mb-4" />
        <p className="text-muted-foreground font-medium">Seu Vault está vazio. Adquira unidades no Marketplace.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item, idx) => (
        <InventoryItem key={`${item.id}-${idx}`} item={item} />
      ))}
    </div>
  );
};

export default InventoryGrid;