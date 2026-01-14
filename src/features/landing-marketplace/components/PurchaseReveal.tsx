import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RetailReward } from '../domain/types';
import { CheckCircle2, Wallet, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  reward: RetailReward | null;
  onClose: () => void;
}

export const PurchaseReveal = ({ reward, onClose }: Props) => {
  React.useEffect(() => {
    if (reward) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#ffffff']
      });
    }
  }, [reward]);

  return (
    <AnimatePresence>
      {reward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#121212] border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
              <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 ring-1 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>

              <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">
                Compra Confirmada
              </span>
              
              <h2 className="text-3xl font-black text-white mb-2">{reward.name}</h2>
              <p className="text-zinc-400 font-medium text-sm mb-8">
                Valor de Mercado: <span className="text-emerald-400 font-mono">${reward.value.toFixed(2)}</span>
              </p>

              {!reward.isWithdrawable && (
                <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 mb-8">
                  <p className="text-[11px] text-zinc-500 text-left font-medium leading-relaxed">
                    <strong className="text-zinc-300 block mb-1 uppercase text-[10px] tracking-wider">Restrição de Ativo</strong>
                    Este item é uma moeda interna do ecossistema e não pode ser sacada. Utilize-a para acessar áreas restritas do jogo.
                  </p>
                </div>
              )}

              <button 
                onClick={onClose}
                className="w-full h-14 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <Wallet size={18} />
                Guardar no Vault
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};