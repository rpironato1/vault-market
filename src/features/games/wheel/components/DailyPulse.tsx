"use client";

import React, { useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Target, Clock, Lightning, Trophy, Crown } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';
import { cn } from '@/lib/utils';

interface Sector {
  label: string;
  color: string;
  value: number;
  chance: number;
}

const SECTORS: Sector[] = [
  { label: '50 TK', color: '#00FF9C', value: 50, chance: 0.3 },
  { label: '100 TK', color: '#121212', value: 100, chance: 0.2 },
  { label: '0 TK', color: '#1a1a1a', value: 0, chance: 0.2 },
  { label: '500 TK', color: '#FFD700', value: 500, chance: 0.1 },
  { label: '20 TK', color: '#00FF9C', value: 20, chance: 0.15 },
  { label: '1000 TK', color: '#FF007F', value: 1000, chance: 0.05 },
];

const DailyPulse = () => {
  const { updateBalance, engagementTokens } = useStore();
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<string | null>(null);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setLastWin(null);

    // Lógica de sorteio baseada em pesos
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
    // Cálculo para cair no centro do setor sorteado
    // Adicionamos 5 voltas completas (1800 deg) para o efeito visual
    const extraDegrees = (SECTORS.length - selectedIndex) * sectorAngle - (sectorAngle / 2);
    const newRotation = rotation + 1800 + extraDegrees;
    
    setRotation(newRotation);

    await controls.start({
      rotate: newRotation,
      transition: { duration: 5, ease: [0.2, 0, 0, 1] }
    });

    const reward = SECTORS[selectedIndex];

    if (reward.value > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00FF9C', '#FFD700', '#ffffff']
      });
      showSuccess(`Sincronia Estável! +${reward.label} adicionados.`);
      setLastWin(reward.label);
    } else {
      showError("Ciclo de Sincronia interrompido.");
    }

    setIsSpinning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Painel de Controle */}
      <div className="bg-[#121212] rounded-[32px] border border-white/5 p-8 flex flex-col gap-8 shadow-2xl">
        <header>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[#00FF9C]" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Janela de Sincronia</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">Pulso Orbital</h2>
          <p className="text-xs text-zinc-500 font-medium mt-2 leading-relaxed">
            Sincronize seu Vault com o pulso orbital diário para coletar tokens de engajamento bônus.
          </p>
        </header>

        <div className="space-y-4">
          <div className="rounded-2xl bg-black/40 border border-white/5 p-5 flex justify-between items-center">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Última Coleta</span>
                <span className="text-sm font-mono font-bold text-white">{lastWin || '---'}</span>
             </div>
             <div className="h-10 w-10 rounded-xl bg-[#00FF9C]/5 flex items-center justify-center text-[#00FF9C]">
                <Lightning size={20} weight="fill" />
             </div>
          </div>
        </div>

        <button 
          onClick={spin}
          disabled={isSpinning}
          className={cn(
            "w-full h-20 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-95 flex items-center justify-center gap-3",
            isSpinning 
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
              : "bg-[#00FF9C] text-black hover:shadow-[0_0_30px_rgba(0,255,156,0.3)]"
          )}
        >
          {isSpinning ? 'SINCRONIZANDO...' : 'INICIAR PULSO'}
        </button>

        <div className="flex flex-col items-center gap-2">
           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Próximo Ciclo: 24h</span>
        </div>
      </div>

      {/* Roleta SVG */}
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 p-12 flex items-center justify-center relative overflow-hidden min-h-[550px]">
        {/* Pointer (Seta) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
          <motion.div 
            animate={isSpinning ? { y: [0, 5, 0] } : {}}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <div className="w-1.5 h-12 bg-[#00FF9C] shadow-[0_0_20px_#00FF9C] rounded-full" />
            <div className="w-4 h-4 bg-[#00FF9C] rotate-45 -mt-2 shadow-[0_0_20px_#00FF9C]" />
          </motion.div>
        </div>

        <div className="relative w-[450px] h-[450px]">
          {/* Anel Decorativo Externo */}
          <div className="absolute inset-[-30px] rounded-full border border-white/5 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-[-15px] rounded-full border border-[#00FF9C]/10" />

          <motion.div 
            animate={controls}
            className="w-full h-full relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {SECTORS.map((sector, i) => {
                const angle = 360 / SECTORS.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                
                // Cálculo das coordenadas do setor
                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                return (
                  <g key={i}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={sector.color}
                      fillOpacity={sector.color.startsWith('#1') ? 1 : 0.15}
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="0.5"
                    />
                    
                    {/* Texto Rotacionado */}
                    <g style={{ transform: `rotate(${startAngle + angle / 2}deg)`, transformOrigin: '50% 50%' }}>
                      <text
                        x="50"
                        y="15"
                        textAnchor="middle"
                        fill={sector.color === '#121212' || sector.color === '#1a1a1a' ? 'rgba(255,255,255,0.4)' : sector.color}
                        className="text-[4px] font-black uppercase tracking-widest"
                        style={{ transform: 'rotate(0deg)' }}
                      >
                        {sector.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Pinos Externos */}
            {Array.from({ length: SECTORS.length }).map((_, i) => (
              <div 
                key={i}
                className="absolute top-1/2 left-1/2 h-full w-2 flex flex-col items-center"
                style={{ transform: `translate(-50%, -50%) rotate(${i * (360 / SECTORS.length)}deg)` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-white/10 mt-1" />
              </div>
            ))}
          </motion.div>

          {/* Centro da Roleta */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-black border-4 border-[#121212] flex items-center justify-center shadow-2xl">
               <div className="w-16 h-16 rounded-full bg-[#00FF9C]/5 border border-[#00FF9C]/20 flex items-center justify-center">
                  <Target size={32} weight="duotone" className="text-[#00FF9C]" />
               </div>
            </div>
          </div>
        </div>

        {/* Efeito de Scanline e Brilho */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.03),transparent)]" />
      </div>
    </div>
  );
};

export default DailyPulse;