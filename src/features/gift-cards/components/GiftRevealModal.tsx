import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy } from 'lucide-react';
import { Coins, CheckCircle } from '@phosphor-icons/react';
import { useGiftCardStore } from '../infrastructure/store';
import confetti from 'canvas-confetti';
import { showSuccess } from '@/utils/toast';

export const GiftRevealModal = () => {
  const { lastReward, isOpening, resetReward } = useGiftCardStore();

  useEffect(() => {
    if (lastReward) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FF9C', '#FFD700', '#FFFFFF']
      });
    }
  }, [lastReward]);

  const copyCode = () => {
    navigator.clipboard.writeText("XXXX-XXXX-XXXX-XXXX");
    showSuccess("Código copiado!");
  };

  if (isOpening) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Gift className="text-emerald-500 animate-pulse" size={32} />
          </div>
        </div>
        <p className="mt-8 text-emerald-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Gerando Gift Card Seguro...
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
            className="relative bg-[#121212] w-full max-w-lg rounded-[32px] border border-white/10 p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 z-20">
              <button onClick={resetReward} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6">
                Sucesso Total
              </span>

              <div className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 border border-white/10 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Gift size={100} />
                </div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <span className="font-black text-xl text-white">{lastReward.brand}</span>
                   <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded">GIFT CARD</span>
                </div>
                <div className="text-left relative z-10">
                   <span className="text-xs text-zinc-400 font-medium uppercase">Valor do Card</span>
                   <div className="text-4xl font-mono font-black text-white tracking-tighter">
                     ${lastReward.giftCardValue.toFixed(2)}
                   </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 bg-black/30 rounded-lg p-3 border border-white/5 cursor-pointer hover:border-white/20 transition-colors" onClick={copyCode}>
                   <code className="text-sm font-mono text-emerald-400 flex-1 text-center tracking-widest">
                     ****-****-****-AB42
                   </code>
                   <Copy size={14} className="text-zinc-500" />
                </div>
              </div>

              <div className="w-full flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                       <Coins size={20} weight="fill" />
                    </div>
                    <div className="flex flex-col items-start">
                       <span className="text-[10px] font-black uppercase text-emerald-500">Bônus de Moedas</span>
                       <span className="text-xs text-zinc-400">Adicionado à carteira</span>
                    </div>
                 </div>
                 <span className="text-xl font-mono font-black text-emerald-400">
                    +${lastReward.coinValue.toFixed(2)}
                 </span>
              </div>

              <div className="flex items-center gap-2 mb-8">
                 <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Valor Total Obtido:</span>
                 <span className="text-white text-xl font-black">${lastReward.totalValue.toFixed(2)}</span>
              </div>

              <button 
                onClick={resetReward}
                className="w-full h-14 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle weight="bold" size={20} /> Resgatar Tudo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};