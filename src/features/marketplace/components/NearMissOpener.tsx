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
          colors: ['#00FF9C', '#FFD700', '#ffffff']
        });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [reward]);

  if (!reward) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/fb backdrop-blur-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'SPINNING' ? (
          <div className="w-full max-w-4xl px-10 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-1 bg-[#00FF9C] z-20 shadow-[0_0_20px_#00FF9C]" />
             
             <motion.div 
               initial={{ x: 0 }}
               animate={{ x: "-80%" }}
               transition={{ duration: 3.5, ease: [0.15, 0, 0.15, 1] }}
               className="flex gap-4 items-center"
             >
               {Array.from({ length: 40 }).map((_, i) => (
                 <div key={i} className="min-w-[180px] h-[220px] rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center justify-center gap-4 opacity-40">
                    <div className={`h-20 w-20 rounded-full flex items-center justify-center ${i % 7 === 0 ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-white/5 text-white/20'}`}>
                       {i % 7 === 0 ? <Trophy size={40} weight="fill" /> : <ShieldCheck size={40} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {i % 7 === 0 ? 'Jackpot Unit' : 'Common Asset'}
                    </span>
                 </div>
               ))}
               {/* O item ganho é inserido no final do carrossel para o efeito de parada */}
               <div className="min-w-[180px] h-[220px] rounded-2xl bg-[#121212] border-2 border-[#00FF9C] flex flex-col items-center justify-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-[#00FF9C]/10 text-[#00FF9C] flex items-center justify-center">
                     <ShieldCheck size={40} weight="fill" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00FF9C]">Verificado</span>
               </div>
               {/* Near Miss: O Jackpot logo em seguida */}
               <div className="min-w-[180px] h-[220px] rounded-2xl bg-[#121212] border border-[#FFD700]/20 flex flex-col items-center justify-center gap-4 opacity-40">
                  <div className="h-20 w-20 rounded-full bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center">
                     <Trophy size={40} weight="fill" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Quase Lá</span>
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
               <div className="absolute inset-0 bg-[#00FF9C]/20 blur-[100px] rounded-full" />
               <div className="h-64 w-64 rounded-[40px] border-2 border-[#00FF9C]/50 bg-[#121212] flex items-center justify-center relative shadow-[0_0_50px_rgba(0,255,156,0.2)]">
                  <ShieldCheck weight="fill" className="text-[#00FF9C] h-32 w-32" />
               </div>
            </div>
            
            <span className="text-[10px] font-black text-[#00FF9C] uppercase tracking-[0.4em] mb-4">Unidade Adquirida</span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{reward.name}</h2>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-8">
              <button 
                onClick={onClose}
                className="col-span-2 h-16 rounded-2xl bg-[#00FF9C] text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00e68d] transition-all active:scale-95 shadow-[0_0_30px_rgba(0,255,156,0.3)]"
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