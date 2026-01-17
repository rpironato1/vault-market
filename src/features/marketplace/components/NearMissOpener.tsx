"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Trophy } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { Reward } from '@core/domain/entities';

interface Props {
  reward: Reward | null;
  onClose: () => void;
}

const NearMissOpener = ({ reward, onClose }: Props) => {
  const [phase, setPhase] = useState<'IDLE' | 'SPINNING' | 'REVEALED'>('SPINNING');

  useEffect(() => {
    if (reward) {
      const timer = setTimeout(() => {
        setPhase('REVEALED');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['rgb(0, 255, 156)', 'rgb(255, 215, 0)', '#ffffff']
        });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [reward]);

  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(5, 5, 5)]/fb backdrop-blur-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'SPINNING' ? (
          <div className="w-full max-w-4xl px-10 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-1 bg-[rgb(0, 255, 156)] z-20 shadow-[0_0_20px_rgb(0, 255, 156)]" />
             
             <motion.div 
               initial={{ x: 0 }}
               animate={{ x: "-80%" }}
               transition={{ duration: 3.5, ease: [0.15, 0, 0.15, 1] }}
               className="flex gap-4 items-center"
             >
               {Array.from({ length: 40 }).map((_, i) => (
                 <div key={i} className="min-w-[180px] h-[220px] rounded-2xl bg-[rgb(18, 18, 18)] border border-white/5 flex flex-col items-center justify-center gap-4 opacity-40">
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center ${i % 7 === 0 ? 'bg-[rgb(255, 215, 0)]/10 text-[rgb(255, 215, 0)]' : 'bg-white/5 text-white/20'}`}>
                       {i % 7 === 0 ? <Trophy size={40} weight="fill" /> : <ShieldCheck size={40} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {i % 7 === 0 ? 'Jackpot Unit' : 'Common Asset'}
                    </span>
                 </div>
               ))}
               {/* O item ganho é inserido no final do carrossel para o efeito de parada */}
               <div className="min-w-[180px] h-[220px] rounded-2xl bg-[rgb(18, 18, 18)] border-2 border-[rgb(0, 255, 156)] flex flex-col items-center justify-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-[rgb(0, 255, 156)]/10 text-[rgb(0, 255, 156)] flex items-center justify-center">
                     <ShieldCheck size={40} weight="fill" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[rgb(0, 255, 156)]">Verificado</span>
               </div>
               {/* Near Miss: O Jackpot logo em seguida */}
               <div className="min-w-[180px] h-[220px] rounded-2xl bg-[rgb(18, 18, 18)] border border-[rgb(255, 215, 0)]/20 flex flex-col items-center justify-center gap-4 opacity-40">
                  <div className="h-20 w-20 rounded-full bg-[rgb(255, 215, 0)]/10 text-[rgb(255, 215, 0)] flex items-center justify-center">
                     <Trophy size={40} weight="fill" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[rgb(255, 215, 0)]">Quase Lá</span>
               </div>
             </motion.div>
             <p className="text-center mt-20 font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] animate-pulse">Sincronizando Probabilidades...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center max-w-sm text-center px-6"
          >
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-[rgb(0, 255, 156)]/20 blur-[100px] rounded-full" />
               <div className="h-64 w-64 rounded-[40px] border-2 border-[rgb(0, 255, 156)]/50 bg-[rgb(18, 18, 18)] flex items-center justify-center relative shadow-[0_0_50px_rgba(0,255,156,0.2)]">
                  <ShieldCheck weight="fill" className="text-[rgb(0, 255, 156)] h-32 w-32" />
               </div>
            </div>
            
            <span className="text-[10px] font-black text-[rgb(0, 255, 156)] uppercase tracking-[0.4em] mb-4">Unidade Adquirida</span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{reward.name}</h2>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-8">
              <button 
                onClick={onClose}
                className="col-span-2 h-16 rounded-2xl bg-[rgb(0, 255, 156)] text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[rgb(0, 230, 141)] transition-all active:scale-95 shadow-[0_0_30px_rgba(0,255,156,0.3)]"
              >
                Coletar e Sincronizar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NearMissOpener;