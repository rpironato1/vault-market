"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, ShieldCheck, ArrowRight } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { Reward } from '../../../_core/domain/entities';

interface Props {
  reward: Reward | null;
  onClose: () => void;
}

const ImmersiveOpener = ({ reward, onClose }: Props) => {
  const [phase, setPhase] = useState<'IDLE' | 'OPENING' | 'REVEALED'>('OPENING');

  useEffect(() => {
    if (reward) {
      const timer = setTimeout(() => {
        setPhase('REVEALED');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#ffffff']
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [reward]);

  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        {phase === 'OPENING' ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="h-40 w-40 rounded-full border-2 border-dashed border-emerald-500/30"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkle weight="fill" className="text-emerald-500 h-16 w-16" />
              </motion.div>
            </div>
            <p className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.4em] text-emerald-400 animate-pulse">
              Sincronizando Vault...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center max-w-md w-full px-6 text-center"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
            
            <div className="relative mb-8 h-64 w-64 rounded-3xl border-2 border-emerald-500/50 bg-white/[0.02] flex items-center justify-center group overflow-hidden shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80" 
                 className="absolute inset-0 object-cover opacity-40 mix-blend-overlay"
                 alt=""
               />
               <ShieldCheck weight="duotone" className="text-emerald-400 h-32 w-32 relative z-10" />
            </div>

            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-2">Unidade Verificada</span>
            <h2 className="text-4xl font-bold tracking-tighter mb-4">{reward.name}</h2>
            
            <div className="flex gap-4 w-full mt-8">
              <button 
                onClick={onClose}
                className="flex-1 h-14 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
              >
                MEU VAULT <ArrowRight weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveOpener;