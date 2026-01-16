"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { Reward } from '@core/domain/types';

interface OpeningAnimationProps {
  reward: Reward | null;
  onClose: () => void;
}

const OpeningAnimation = ({ reward, onClose }: OpeningAnimationProps) => {
  const [phase, setPhase] = useState<'IDLE' | 'OPENING' | 'REVEALED'>('OPENING');

  useEffect(() => {
    if (reward) {
      const timer = setTimeout(() => setPhase('REVEALED'), 2500);
      return () => clearTimeout(timer);
    }
  }, [reward]);

  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {phase === 'OPENING' ? (
          <motion.div 
            key="opening"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 180, 360],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-48 w-48 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
              <Sparkles className="text-white h-20 w-20" />
            </motion.div>
            <p className="mt-8 text-xl font-bold tracking-widest text-emerald-400 animate-pulse uppercase">
              Desbloqueando Item...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="revealed"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center max-w-sm text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px]" />
              <div className="h-64 w-64 rounded-2xl border-2 border-emerald-500/50 bg-black/40 flex items-center justify-center relative overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&auto=format&fit=crop&q=60" className="absolute inset-0 object-cover opacity-50" alt="" />
                 <CheckCircle2 className="text-emerald-400 h-24 w-24 relative z-10" />
              </div>
            </div>
            
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em] mb-2">Sucesso na Coleção</span>
            <h2 className="text-3xl font-bold mb-2">{reward.name}</h2>
            <p className="text-muted-foreground text-sm mb-6">Este item foi adicionado ao seu Vault e agora você possui tokens para desbloquear novas experiências.</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={onClose}
                className="flex-1 rounded-xl bg-white text-black font-bold py-4 transition-transform hover:scale-[1.02] active:scale-98"
              >
                IR PARA VAULT
              </button>
              <button 
                onClick={onClose}
                className="rounded-xl bg-white/10 px-6 hover:bg-white/20 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpeningAnimation;