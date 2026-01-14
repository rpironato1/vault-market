"use client";

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Target, Lightning, Trophy } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';
import { cn } from '@/lib/utils';
import { WheelPointer } from './WheelPointer';
import { WheelSectors } from './WheelSectors';

const SECTORS = [
  { label: '25 TK', color: '#00FF9C', value: 25, chance: 0.35 },
  { label: '50 TK', color: '#121212', value: 50, chance: 0.25 },
  { label: '100 TK', color: '#1a1a1a', value: 100, chance: 0.20 },
  { label: '250 TK', color: '#FFD700', value: 250, chance: 0.10 },
  { label: '500 TK', color: '#00FF9C', value: 500, chance: 0.07 },
  { label: 'JACKPOT', color: '#FF007F', value: 1000, chance: 0.03 },
];

const DailyPulse = () => {
  const { engagementTokens } = useStore();
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

    // Seleção por peso
    const totalChance = SECTORS.reduce((acc, s) => acc + s.chance, 0);
    let random = Math.random() * totalChance;
    let selectedIndex = 0;
    for (let i = 0; i < SECTORS.length; i++) {
      if (random < SECTORS[i].chance) { selectedIndex = i; break; }
      random -= SECTORS[i].chance;
    }

    const sectorAngle = 360 / SECTORS.length;
    
    /**
     * PRECISAO MATEMÁTICA:
     * Para que o ponteiro (no topo, 0°) caia no centro de um setor 'i',
     * a roleta deve rodar até que o ângulo ((i + 0.5) * sectorAngle) esteja no topo.
     * Como a rotação é horária, o cálculo é: 360 - centro_do_setor.
     */
    const stopAt = 360 - ((selectedIndex + 0.5) * sectorAngle);
    
    // Garantimos pelo menos 8 voltas completas + o deslocamento preciso
    const newRotation = rotation + (360 * 8) + (stopAt - (rotation % 360));
    
    setRotation(newRotation);

    await controls.start({
      rotate: newRotation,
      transition: { duration: 7, ease: [0.15, 0, 0.15, 1] }
    });

    setWinningIndex(selectedIndex);
    const reward = SECTORS[selectedIndex];

    const isJackpot = reward.label === 'JACKPOT';
    confetti({ 
      particleCount: isJackpot ? 400 : 150, 
      spread: 80, 
      origin: { y: 0.6 },
      colors: isJackpot ? ['#FFD700', '#FF007F'] : ['#00FF9C', '#FFFFFF']
    });

    showSuccess(isJackpot ? `SISTEMA SOBRECARREGADO: JACKPOT!` : `SINCRONIZADO: +${reward.label}`);
    setLastWin(reward.label);
    setIsSpinning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 p-8 relative overflow-hidden shadow-2xl">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Lightning weight="fill" className="text-[#00FF9C]" size={20} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Precision Engine v3</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Orbital Pulse</h2>
          </header>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center mb-10">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Última Coleta</p>
              <p className="text-2xl font-mono font-black text-[#FFD700]">{lastWin || '---'}</p>
            </div>
            <Trophy weight="duotone" size={32} className="text-[#FFD700]" />
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning}
            className={cn(
              "w-full h-24 rounded-[30px] font-black uppercase tracking-[0.3em] text-sm transition-all flex flex-col items-center justify-center gap-1",
              isSpinning ? "bg-zinc-900 text-zinc-600 cursor-not-allowed" : "bg-white text-black hover:bg-[#00FF9C] active:scale-95"
            )}
          >
            <span>{isSpinning ? 'Sincronizando...' : 'Ativar Reator'}</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-8 bg-[#050505] rounded-[60px] border border-white/5 p-16 flex items-center justify-center relative min-h-[700px]">
        <div className="relative w-[550px] h-[550px]">
          <div className="absolute inset-[-60px] rounded-full border-[20px] border-[#121212] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/20"
                style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-295px)` }}
              />
            ))}
          </div>

          <WheelPointer isSpinning={isSpinning} />

          <motion.div animate={controls} className="w-full h-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-2xl">
              <circle cx="50" cy="50" r="50" fill="#0A0A0A" />
              <WheelSectors sectors={SECTORS} winningIndex={winningIndex} />
              {Array.from({ length: SECTORS.length }).map((_, i) => (
                <circle key={i} cx="50" cy="1.5" r="1" fill="#FFD700" style={{ transformOrigin: '50% 50%', transform: `rotate(${i * (360/SECTORS.length)}deg)` }} />
              ))}
            </svg>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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