"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, ShieldCheck, ArrowRight, Trophy } from '@phosphor-icons/react';
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
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#00FF9C', '#FFD700', '#FFFFFF']
        });
      }, 3500); // Aumentado para criar antecipação
      return () => clearTimeout(timer);
    }
  }, [reward]);

  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'OPENING' ? (
          <motion.div 
            key="reel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div className="relative w-full h-40 flex items-center justify-center overflow-hidden border-y border-white/5">
              <div className="absolute h-full w-1 bg-emerald-500 z-10 shadow-[0_0_20px_rgba(0,255,156,0.8)]" />
              <motion.div 
                initial={{ x: 1000 }}
                animate={{ x: -1000 }}
                transition={{ duration: 3.5, ease: [0.12, 0, 0.39, 0] }}
                className="flex gap-4 items-center whitespace-nowrap"
              >
                {/* NEAR MISS: Jackpot passando antes */}
                {[...Array(20)].map((_, i) => (
                   <div key={i} className={`h-32 w-32 rounded-xl flex items-center justify-center border ${i === 15 ? 'border-secondary bg-secondary/10' : 'border-white/10 bg-white/5'}`}>
                      {i === 15 ? <Trophy className="text-secondary h-16 w-16" /> : <ShieldCheck className="text-white/20 h-16 w-16" />}
                   </div>
                ))}
              </motion.div>
            </div>
            <p className="mt-12 font-mono text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 animate-pulse">
              CALIBRANDO RECOMPENSA DE ALTA FIDELIDADE...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="revealed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative flex flex-col items-center max-w-md w-full px-6 text-center"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[150px] rounded-full" />
            
            <div className={`relative mb-8 h-72 w-72 rounded-3xl border-4 ${reward.rarity === 'Legendary' ? 'border-secondary glow-gold' : 'border-primary glow-emerald'} bg-black flex items-center justify-center group overflow-hidden shadow-2xl`}>
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
               <ShieldCheck weight="duotone" className={`${reward.rarity === 'Legendary' ? 'text-secondary' : 'text-primary'} h-40 w-40 relative z-10`} />
               {reward.rarity === 'Legendary' && (
                 <div className="absolute top-4 right-4 bg-secondary text-black text-[10px] font-black px-2 py-1 rounded-lg">MAX VALUE</div>
               )}
            </div>

            <span className={`text-[12px] font-black uppercase tracking-[0.4em] mb-2 ${reward.rarity === 'Legendary' ? 'text-secondary' : 'text-primary'}`}>
              Sincronia Concluída
            </span>
            <h2 className="text-5xl font-black tracking-tighter mb-4 text-white uppercase italic">{reward.name}</h2>
            <div className="font-mono text-3xl font-black text-emerald-400 mb-8">${reward.value.toFixed(2)}</div>
            
            <button 
              onClick={onClose}
              className="w-full h-16 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
            >
              ADICIONAR AO VAULT <ArrowRight weight="bold" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveOpener;