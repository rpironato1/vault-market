"use client";

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Target, Clock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';

const REWARDS = [
  { label: '50 TK', color: '#00FF9C', value: 50 },
  { label: '100 TK', color: '#121212', value: 100 },
  { label: 'EMPTY', color: '#1a1a1a', value: 0 },
  { label: '500 TK', color: '#FFD700', value: 500 },
  { label: '20 TK', color: '#00FF9C', value: 20 },
  { label: '1000 TK', color: '#FF007F', value: 1000 },
];

const DailyPulse = () => {
  const { updateBalance } = useStore();
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const rotation = 1800 + Math.random() * 360;
    
    await controls.start({
      rotate: rotation,
      transition: { duration: 5, ease: [0.15, 0, 0.15, 1] }
    });

    const finalRotation = rotation % 360;
    const sectionIndex = Math.floor((360 - (finalRotation % 360)) / (360 / REWARDS.length));
    const reward = REWARDS[sectionIndex % REWARDS.length];

    if (reward.value > 0) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FF9C', '#FFD700', '#FF007F']
      });
      showSuccess(`Sincronia Estável! +${reward.label} adicionados ao Vault.`);
      // Aqui poderíamos adicionar tokens ao invés de balance, mas manteremos o fluxo
    } else {
      showError("Ciclo de Sincronia interrompido. Nenhuma unidade coletada.");
    }

    setIsSpinning(false);
  };

  return (
    <div className="flex flex-col items-center gap-16 py-10">
      <div className="relative h-[450px] w-[450px]">
        {/* Pointer */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30">
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1 h-12 bg-[#00FF9C] shadow-[0_0_15px_#00FF9C] rounded-full"
          />
        </div>

        {/* Outer Ring */}
        <div className="absolute inset-[-20px] rounded-full border border-white/5 border-dashed animate-[spin_20s_linear_infinite]" />

        <motion.div 
          animate={controls}
          className="h-full w-full rounded-full border-[10px] border-[#121212] relative overflow-hidden shadow-[0_0_100px_rgba(0,255,156,0.05)] bg-[#050505]"
        >
          {REWARDS.map((reward, i) => (
            <div 
              key={i}
              className="absolute top-0 left-0 w-full h-full"
              style={{ 
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                transform: `rotate(${i * (360 / REWARDS.length)}deg)`,
                backgroundColor: reward.color === '#121212' || reward.color === '#1a1a1a' ? reward.color : `${reward.color}20`,
                borderLeft: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div 
                className="absolute top-16 left-1/2 -translate-x-1/2 text-xs font-black text-white uppercase tracking-widest"
                style={{ transform: 'rotate(45deg)' }}
              >
                {reward.label}
              </div>
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-2xl z-20">
             <div className="h-16 w-16 rounded-full bg-[#00FF9C]/10 flex items-center justify-center">
                <Target size={32} className="text-[#00FF9C]" />
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={spin}
          disabled={isSpinning}
          className="bg-[#00FF9C] text-black font-black px-16 py-6 rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
        >
          Iniciar Pulso Orbital
        </button>
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
          <Clock size={14} className="text-[#00FF9C]" /> Próxima janela em 24:00:00
        </div>
      </div>
    </div>
  );
};

export default DailyPulse;