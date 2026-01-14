import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Wallet } from '@phosphor-icons/react';
import { useMarketplaceStore } from '../infrastructure/store';
import confetti from 'canvas-confetti';

export const RewardModal = () => {
  const { lastReward, isOpening, resetReward } = useMarketplaceStore();

  React.useEffect(() => {
    if (lastReward) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00FF9C', '#ffffff']
      });
    }
  }, [lastReward]);

  if (isOpening) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#00FF9C] rounded-full animate-spin mb-8" />
        <p className="text-[#00FF9C] text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Processando Transação Blockchain...
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {lastReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={resetReward}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#121212] w-full max-w-md rounded-[32px] border border-white/10 p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 z-20">
              <button onClick={resetReward} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00FF9C]/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#00FF9C]/10 border border-[#00FF9C]/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,255,156,0.2)]">
                <CheckCircle weight="fill" size={48} className="text-[#00FF9C]" />
              </div>

              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-4">
                Transação Confirmada
              </span>

              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                {lastReward.name}
              </h2>

              <p className="text-zinc-400 text-sm font-medium mb-8 max-w-[280px]">
                Item adicionado ao seu inventário. Saldo disponível para uso imediato.
              </p>

              <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase">Valor de Mercado</span>
                    <span className="text-2xl font-mono font-black text-[#00FF9C]">
                      ${lastReward.value.toFixed(2)}
                    </span>
                 </div>
              </div>

              <button 
                onClick={resetReward}
                className="w-full h-14 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <Wallet weight="bold" size={20} /> Ir para o Vault
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};