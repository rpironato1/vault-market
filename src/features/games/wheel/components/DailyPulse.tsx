"use client";

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Lightning, Trophy, Target } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';
import { cn } from '@/lib/utils';
import { WheelPointer } from './WheelPointer';
import { WheelSectors } from './WheelSectors';

const SECTORS = [
  { label: '150 TK', color: '#00FF9C', value: 150, chance: 0.2 },
  { label: '50 TK', color: '#121212', value: 50, chance: 0.25 },
  { label: '10 TK', color: '#1a1a1a', value: 10, chance: 0.25 },
  { label: '500 TK', color: '#FFD700', value: 500, chance: 0.15 },
  { label: '25 TK', color: '#00FF9C', value: 25, chance: 0.1 },
  { label: 'JACKPOT', color: '#FF007F', value: 2500, chance: 0.05 },
];

const DailyPulse = () => {
  const { updateBalance } = useStore();
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setLastWin(null);
    setWinningIndex(null);

    // Sorteio por pesos
    const totalChance = SECTORS.reduce((acc, s) => acc + s.chance, 0);
    let random = Math.random() * totalChance;
    let selectedIndex = 0;
    
    for (let i = 0; i < SECTORS.length; i++) {
      if (random < SECTORS[i].chance) { 
        selectedIndex = i; 
        break; 
      }
      random -= SECTORS[i].chance;
    }

    const sectorAngle = 360 / SECTORS.length;
    
    /**
     * CALIBRAGEM DE PRECISÃO:
     * O centro da fatia 'i' está em (i * sectorAngle + sectorAngle / 2).
     * Para trazer esse centro para o topo (0 deg), precisamos girar a roda
     * no sentido horário por (360 - centroAngle).
     */
    const targetCenterAngle = (selectedIndex * sectorAngle) + (sectorAngle / 2);
    const stopAt = 360 - targetCenterAngle;
    
    // Garante rotação contínua e fluida (mínimo 8 voltas)
    const newRotation = (Math.ceil(rotation / 360) * 360) + (360 * 8) + stopAt;
    
    setRotation(newRotation);

    await controls.start({
      rotate: newRotation,
      transition: { 
        duration: 7, 
        ease: [0.15, 0, 0.15, 1] // Curva de desaceleração de luxo
      }
    });

    const reward = SECTORS[selectedIndex];
    setWinningIndex(selectedIndex);

    if (reward.value > 0) {
      const isJackpot = reward.label === 'JACKPOT';
      confetti({ 
        particleCount: isJackpot ? 400 : 150, 
        spread: 100, 
        origin: { y: 0.6 }, 
        colors: isJackpot ? ['#FFD700', '#FF007F', '#ffffff'] : ['#00FF9C', '#ffffff'] 
      });
      showSuccess(`ESTABILIZADO: +${reward.label}`);
      setLastWin(reward.label);
    }
    
    setIsSpinning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 p-8 relative overflow-hidden shadow-2xl">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Lightning weight="fill" className="text-[#00FF9C]" size={20} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Vault Sync Protocol</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Orbital Pulse</h2>
          </header>

          <div className="space-y-4 mb-10">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status da Rede</p>
                <p className="text-2xl font-mono font-black text-white">{isSpinning ? 'SYNCING...' : 'READY'}</p>
              </div>
              <div className={cn("h-3 w-3 rounded-full animate-pulse", isSpinning ? "bg-amber-500" : "bg-[#00FF9C]")} />
            </div>
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning}
            className={cn(
              "w-full h-24 rounded-[30px] font-black uppercase tracking-[0.3em] text-sm transition-all flex flex-col items-center justify-center gap-1",
              isSpinning 
                ? "bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed" 
                : "bg-white text-black hover:bg-[#00FF9C] hover:shadow-[0_0_50px_rgba(0,255,156,0.3)] active:scale-95"
            )}
          >
            <span>{isSpinning ? 'In Sychronization...' : 'Engage Pulse'}</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-8 bg-[#050505] rounded-[60px] border border-white/5 p-16 flex items-center justify-center relative min-h-[700px]">
        <div className="relative w-[550px] h-[550px]">
          <div className="absolute inset-[-60px] rounded-full border-[20px] border-[#121212] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-20"
                style={{ 
                  top: '50%', left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-295px)`
                }}
              />
            ))}
          </div>

          <WheelPointer isSpinning={isSpinning} />

          <motion.div 
            animate={controls}
            className="w-full h-full relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-2xl">
              <circle cx="50" cy="50" r="50" fill="#050505" />
              <WheelSectors sectors={SECTORS} winningIndex={winningIndex} />
              
              {Array.from({ length: SECTORS.length }).map((_, i) => (
                <circle 
                  key={i} 
                  cx="50" cy="2" r="1.2" 
                  fill="#FFD700" 
                  style={{ transformOrigin: '50% 50%', transform: `rotate(${i * (360/SECTORS.length)}deg)` }}
                />
              ))}
            </svg>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-32 h-32 rounded-full bg-[#121212] border-[6px] border-[#0A0A0A] flex items-center justify-center shadow-2xl">
               <Target size={40} weight="duotone" className="text-[#00FF9C]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPulse;