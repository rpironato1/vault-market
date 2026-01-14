"use client";

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Target, Clock, Lightning, Trophy, ShareNetwork } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';
import { cn } from '@/lib/utils';
import { WheelPointer } from './WheelPointer';
import { WheelSectors } from './WheelSectors';

const SECTORS = [
  { label: '50 TK', color: '#00FF9C', value: 50, chance: 0.3 },
  { label: '100 TK', color: '#121212', value: 100, chance: 0.2 },
  { label: 'EMPTY', color: '#1a1a1a', value: 0, chance: 0.2 },
  { label: '500 TK', color: '#FFD700', value: 500, chance: 0.1 },
  { label: '25 TK', color: '#00FF9C', value: 25, chance: 0.15 },
  { label: 'JACKPOT', color: '#FF007F', value: 2500, chance: 0.05 },
];

const DailyPulse = () => {
  const { updateBalance, engagementTokens } = useStore();
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setLastWin(null);
    setWinningIndex(null); // Reset do estado de vitória

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
    // Cálculo preciso para parar no centro da fatia
    const stopAt = (SECTORS.length - selectedIndex) * sectorAngle - (sectorAngle / 2);
    const newRotation = rotation + (360 * 8) + stopAt;
    
    setRotation(newRotation);

    await controls.start({
      rotate: newRotation,
      transition: { duration: 6, ease: [0.15, 0, 0.15, 1] }
    });

    const reward = SECTORS[selectedIndex];
    setWinningIndex(selectedIndex); // Ativa a pulsação do setor

    if (reward.value > 0) {
      const isJackpot = reward.label === 'JACKPOT';
      
      confetti({ 
        particleCount: isJackpot ? 500 : 200, 
        spread: isJackpot ? 120 : 90, 
        origin: { y: 0.7 }, 
        colors: isJackpot ? ['#FFD700', '#FF007F', '#00FF9C', '#FFFFFF'] : ['#00FF9C', '#FFD700', '#FF007F'] 
      });

      showSuccess(isJackpot ? `Protocolo ALPHA: JACKPOT ATIVADO!` : `ESTABILIZADO: +${reward.label}`);
      setLastWin(reward.label);
    } else {
      showError("SINCRO-FALHA: Setor Vazio.");
    }
    setIsSpinning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar de Status Tático */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 h-32 w-32 bg-[#00FF9C]/5 blur-[60px]" />
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Lightning weight="fill" className="text-[#00FF9C]" size={20} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Reactor Core v.02</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Orbital Pulse</h2>
          </header>

          <div className="space-y-4 mb-10">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Último Ganho</p>
                <p className="text-2xl font-mono font-black text-[#FFD700]">{lastWin || 'NONE'}</p>
              </div>
              <Trophy weight="duotone" size={32} className="text-[#FFD700]" />
            </div>
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning}
            className={cn(
              "w-full h-24 rounded-[30px] font-black uppercase tracking-[0.3em] text-sm transition-all flex flex-col items-center justify-center gap-1",
              isSpinning 
                ? "bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed" 
                : "bg-white text-black hover:bg-[#00FF9C] hover:shadow-[0_0_50px_rgba(0,255,156,0.4)] active:scale-95"
            )}
          >
            <span>{isSpinning ? 'Synchronizing...' : 'Engage Pulse'}</span>
            {!isSpinning && <span className="text-[8px] font-mono opacity-60">Consumo: 1 Daily Credit</span>}
          </button>
        </div>

        <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 p-8">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Network Load</span>
              <span className="text-[#00FF9C] font-mono text-xs">98.4% Stable</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: isSpinning ? '100%' : '60%' }}
                className="h-full bg-gradient-to-r from-[#00FF9C] to-white" 
              />
           </div>
        </div>
      </div>

      {/* A Super Roleta */}
      <div className="lg:col-span-8 bg-[#050505] rounded-[60px] border border-white/5 p-16 flex items-center justify-center relative shadow-[inset_0_0_100px_rgba(0,0,0,1)] min-h-[700px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.05),transparent)]" />
        
        <div className="relative w-[550px] h-[550px]">
          <div className="absolute inset-[-60px] rounded-full border-[20px] border-[#121212] shadow-[0_0_100px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.05)]">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={isSpinning ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.3 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
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
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
            
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-2xl">
              <defs>
                <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#050505" />
                </radialGradient>
              </defs>
              
              <circle cx="50" cy="50" r="50" fill="url(#wheelGrad)" />
              <WheelSectors sectors={SECTORS} winningIndex={winningIndex} />
              
              {Array.from({ length: SECTORS.length }).map((_, i) => (
                <circle 
                  key={i} 
                  cx="50" cy="2" r="1.5" 
                  fill="#FFD700" 
                  style={{ transformOrigin: '50% 50%', transform: `rotate(${i * (360/SECTORS.length)}deg)` }}
                  className="shadow-xl"
                />
              ))}
            </svg>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-40 h-40 rounded-full bg-[#121212] border-[8px] border-[#0A0A0A] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
               <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />
               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00FF9C]/20 to-transparent flex items-center justify-center border border-[#00FF9C]/30">
                  <Target size={48} weight="duotone" className="text-[#00FF9C] animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPulse;