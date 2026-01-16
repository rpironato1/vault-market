"use client";

import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Lightning, Trophy } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { WheelPointer } from './WheelPointer';
import { WheelSectors } from './WheelSectors';
import { MockBackend } from '@infra/api/mock-backend';
import { useStore } from '@infra/state/store';

// A UI precisa saber os setores para desenhar, mas a lógica de escolha saiu.
const SECTORS = [
  { label: '50 VC', color: '#00FF9C', value: 50 },
  { label: '10 VC', color: '#121212', value: 10 }, 
  { label: '250 VC', color: '#FFD700', value: 250 },
  { label: '5 VC', color: '#1a1a1a', value: 5 },   
  { label: '100 VC', color: '#00FF9C', value: 100 },
  { label: 'JACKPOT', color: '#FF007F', value: 2500 },
  { label: '25 VC', color: '#121212', value: 25 },
  { label: '500 VC', color: '#FFD700', value: 500 },
];

const DailyPulse = () => {
  const { setTokens } = useStore();
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

    try {
      // 1. Solicita resultado ao Servidor
      const result = await MockBackend.spinWheel();
      
      // 2. Calcula rotação visual baseada no resultado do servidor
      const sectorAngle = 360 / SECTORS.length;
      // Ajuste fino para cair no meio do setor
      const sectorCenter = (result.winningIndex * sectorAngle) + (sectorAngle / 2);
      // Adiciona um pouco de "jitter" visual inofensivo
      const jitter = (Math.random() - 0.5) * (sectorAngle * 0.5); 
      
      const spins = 5; 
      // Importante: A rotação deve inverter para alinhar o ponteiro (que está no topo/bottom)
      // Se o ponteiro está no topo (0 graus), precisamos rotacionar o tabuleiro para trazer o setor até lá.
      const targetRotation = rotation + (360 * spins) + (360 - sectorCenter) + jitter;
      
      setRotation(targetRotation);

      // 3. Execução da Animação
      await controls.start({
        rotate: targetRotation,
        transition: { 
          duration: 6, // Rápido para UX fluida
          ease: [0.15, 0, 0.10, 1] 
        }
      });

      // 4. Feedback e Sync
      setWinningIndex(result.winningIndex);
      setTokens(result.newBalance); // Sync saldo real

      const isJackpot = result.isJackpot;
        
      confetti({ 
        particleCount: isJackpot ? 400 : 100, 
        spread: isJackpot ? 100 : 70, 
        origin: { y: 0.7 }, 
        colors: isJackpot ? ['#FFD700', '#FF007F', '#FFFFFF'] : ['#00FF9C', '#FFFFFF'] 
      });

      showSuccess(isJackpot ? `JACKPOT CONFIRMADO: ${result.rewardLabel}` : `Sincronia: +${result.rewardLabel}`);
      setLastWin(result.rewardLabel);
      
    } catch (e) {
      showError("Erro de comunicação com o servidor.");
    } finally {
      setIsSpinning(false);
    }
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
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Reactor Core v.03</span>
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Orbital Pulse</h2>
          </header>

          <div className="space-y-4 mb-10">
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Resultado da Sincronia</p>
                <p className={cn("text-2xl font-mono font-black", lastWin?.includes('JACKPOT') ? "text-[#FF007F]" : "text-[#FFD700]")}>
                  {lastWin || 'Aguardando...'}
                </p>
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
            <span>{isSpinning ? 'CALCULATING...' : 'ENGAGE PULSE'}</span>
            {!isSpinning && <span className="text-[8px] font-mono opacity-60">Sincronia Diária Gratuita</span>}
          </button>
        </div>
      </div>

      {/* A Super Roleta */}
      <div className="lg:col-span-8 bg-[#050505] rounded-[60px] border border-white/5 p-16 flex items-center justify-center relative shadow-[inset_0_0_100px_rgba(0,0,0,1)] min-h-[700px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.05),transparent)]" />
        
        <div className="relative w-[550px] h-[550px]">
          {/* Chassis Externo com LEDs */}
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

          {/* O Corpo da Roleta */}
          <motion.div 
            animate={controls}
            className="w-full h-full relative"
            style={{ rotate: rotation }} 
          >
            {/* Sombras de Profundidade */}
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
              
              {/* Pinos de Ouro (Pins) */}
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
        </div>
      </div>
    </div>
  );
};

export default DailyPulse;