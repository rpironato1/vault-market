"use client";

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';

const REWARDS = [
  { label: '50 TK', color: '#10b981', value: 50 },
  { label: '100 TK', color: '#3b82f6', value: 100 },
  { label: 'PERDEU', color: '#334155', value: 0 },
  { label: '500 TK', color: '#8b5cf6', value: 500 },
  { label: '20 TK', color: '#10b981', value: 20 },
  { label: '1000 TK', color: '#f59e0b', value: 1000 },
];

const DailyPulse = () => {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpin, setLastSpin] = useState<number | null>(null);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const rotation = 1800 + Math.random() * 360;
    
    await controls.start({
      rotate: rotation,
      transition: { duration: 4, ease: [0.25, 1, 0.5, 1] }
    });

    const finalRotation = rotation % 360;
    const sectionIndex = Math.floor((360 - (finalRotation % 360)) / (360 / REWARDS.length));
    const reward = REWARDS[sectionIndex % REWARDS.length];

    if (reward.value > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6']
      });
      showSuccess(`Incrível! Você coletou ${reward.label}.`);
    } else {
      showError("Nenhuma unidade coletada neste ciclo.");
    }

    setIsSpinning(false);
    setLastSpin(Date.now());
  };

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <div className="relative h-80 w-80">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 text-white">
          <div className="w-6 h-8 bg-white rounded-b-full shadow-lg" />
        </div>

        <motion.div 
          animate={controls}
          className="h-full w-full rounded-full border-8 border-white/5 relative overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)]"
        >
          {REWARDS.map((reward, i) => (
            <div 
              key={i}
              className="absolute top-0 left-0 w-full h-full"
              style={{ 
                backgroundColor: reward.color,
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)',
                transform: `rotate(${i * (360 / REWARDS.length)}deg)`,
                opacity: 0.8
              }}
            >
              <div 
                className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white uppercase"
                style={{ transform: 'rotate(45deg)' }}
              >
                {reward.label}
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-black border-4 border-white/10 flex items-center justify-center shadow-2xl z-20">
             <Trophy size={24} className="text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={spin}
          disabled={isSpinning}
          className="bg-emerald-500 text-black font-bold px-12 py-4 rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50"
        >
          INICIAR PULSO DIÁRIO
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">
          <Clock size={14} /> Próximo ciclo em 24:00:00
        </div>
      </div>
    </div>
  );
};

export default DailyPulse;