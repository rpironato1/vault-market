"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, History, AlertTriangle, Skull, Crosshair } from 'lucide-react';
import { useStore } from '@infra/state/store';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

// Tipos e Constantes
type GameStatus = 'IDLE' | 'STARTING' | 'FLYING' | 'CRASHED' | 'CASHOUT';

interface GameHistory {
  multiplier: number;
  timestamp: number;
}

const HISTORY_LIMIT = 5;

// Design Tokens: usar classes Tailwind ao invés de cores hex hardcoded
const TENSION_PHASES = {
  STABLE: { threshold: 0, colorClass: 'text-accent-emerald', color: 'rgb(0, 255, 156)', shadow: 'rgba(0,255,156,0.3)' },
  HEATING: { threshold: 2.0, colorClass: 'text-prestige-gold', color: 'rgb(255, 215, 0)', shadow: 'rgba(255,215,0,0.4)' },
  CRITICAL: { threshold: 5.0, colorClass: 'text-danger-neon', color: 'rgb(255, 0, 85)', shadow: 'rgba(255,0,85,0.6)' },
};

const QuantumCrash = () => {
  const { engagementTokens, setTokens } = useStore();
  
  // -- Game State --
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [multiplier, setMultiplier] = useState(1.00);
  const [bet, setBet] = useState(10);
  const [history, setHistory] = useState<GameHistory[]>([]);
  
  // -- UX State --
  const [tension, setTension] = useState<'STABLE' | 'HEATING' | 'CRITICAL'>('STABLE');
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [cashoutHovered, setCashoutHovered] = useState(false);

  // -- Refs --
  const reqRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  
  const [viewScale, setViewScale] = useState({ x: 10, y: 2 });

  useEffect(() => {
    return () => cancelAnimation();
  }, []);

  const cancelAnimation = () => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
  };

  const startGame = () => {
    if (engagementTokens < bet) {
      showError("VaultCoins insuficientes. Adquira ativos no Marketplace.");
      return;
    }

    setTokens(engagementTokens - bet);

    setStatus('STARTING');
    setMultiplier(1.00);
    setViewScale({ x: 8, y: 2 });
    setTension('STABLE');
    setShakeIntensity(0);
    
    setTimeout(() => {
      setStatus('FLYING');
      startTimeRef.current = Date.now();
      
      const r = Math.random();
      let crash = 1.0;
      if (r > 0.03) {
         crash = Math.floor(100 * Math.E ** (Math.random() * Math.log(100))) / 100;
         if (crash > 50) crash = 50; 
         if (crash < 1.1) crash = 1.1; 
      }
      crashPointRef.current = crash;
      
      loop();
    }, 800);
  };

  const loop = () => {
    const now = Date.now();
    const elapsedSeconds = (now - startTimeRef.current) / 1000;
    
    const currentMult = Math.pow(Math.E, 0.12 * elapsedSeconds);

    setMultiplier(currentMult);

    if (currentMult > TENSION_PHASES.CRITICAL.threshold) {
      setTension('CRITICAL');
      setShakeIntensity(2 + (currentMult * 0.1));
    } else if (currentMult > TENSION_PHASES.HEATING.threshold) {
      setTension('HEATING');
      setShakeIntensity(0.5);
    } else {
      setTension('STABLE');
      setShakeIntensity(0);
    }

    setViewScale(prev => ({
      x: Math.max(prev.x, elapsedSeconds * 1.2),
      y: Math.max(prev.y, currentMult * 1.1)
    }));

    if (currentMult >= crashPointRef.current) {
      handleCrash(crashPointRef.current);
    } else {
      reqRef.current = requestAnimationFrame(loop);
    }
  };

  const handleCrash = (finalValue: number) => {
    cancelAnimation();
    setStatus('CRASHED');
    setMultiplier(finalValue);
    addToHistory(finalValue);
    setShakeIntensity(20);
    setTimeout(() => setShakeIntensity(0), 500);
  };

  const handleCashout = () => {
    if (status !== 'FLYING') return;
    cancelAnimation();
    
    const winAmount = bet * multiplier;
    // Em produção, isso chamaria API para creditar Reward
    // Por enquanto, apenas feedback visual
    setStatus('CASHOUT');
    addToHistory(multiplier);
    showSuccess(`Sincronia encerrada: +${winAmount.toFixed(0)} VC (Simulado)`);
  };

  const addToHistory = (val: number) => {
    setHistory(prev => [{ multiplier: val, timestamp: Date.now() }, ...prev].slice(0, HISTORY_LIMIT));
  };

  // Render logic...
  const currentTime = status === 'STARTING' || status === 'IDLE' 
    ? 0 
    : (Math.log(multiplier) / 0.12);

  const xPercent = (currentTime / viewScale.x) * 100;
  const yPercent = ((multiplier - 1) / (viewScale.y - 1)) * 100;
  const svgY = 100 - yPercent;

  const safeX = Math.min(Math.max(xPercent, 0), 100);
  const safeY = Math.min(Math.max(svgY, 0), 100);

  const pathData = `M 0 100 Q ${safeX * 0.5} 100, ${safeX} ${safeY}`;
  const areaData = `${pathData} L ${safeX} 100 L 0 100 Z`;
  const rotation = status === 'CRASHED' ? 90 : Math.max(-45, -10 - (yPercent * 0.5));
  const currentColor = TENSION_PHASES[tension].color;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px]">
      
      {/* Control Panel */}
      <div className="bg-surface-card rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative z-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
          style={{ background: `radial-gradient(circle at top right, ${currentColor}, transparent 70%)` }}
        />

        <div className="space-y-8 relative z-10">
          <header>
            <div className="flex items-center gap-2 mb-2">
               <Zap className={cn("h-4 w-4 transition-colors", status === 'FLYING' ? "animate-pulse" : "text-zinc-600")} style={{ color: status === 'FLYING' ? currentColor : undefined }} />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status do Reator</span>
            </div>
            <div className="flex items-baseline gap-2">
               <h2 className="text-4xl font-black text-white italic tracking-tighter">QUANTUM</h2>
               <span className="text-sm font-bold transition-colors duration-500" style={{ color: currentColor }}>v2.4</span>
            </div>
          </header>

          <div className="space-y-4">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Alocação (VaultCoins)</label>
            <div className="relative">
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={status === 'FLYING' || status === 'STARTING'}
                className="w-full bg-surface-card border border-white/10 rounded-2xl h-16 px-6 font-mono text-2xl font-black text-white outline-none focus:border-accent-emerald transition-all disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              {[10, 50, 100, 'MAX'].map((val, i) => (
                <button 
                  key={i}
                  onClick={() => typeof val === 'number' && status === 'IDLE' ? setBet(val) : null}
                  disabled={status !== 'IDLE' && status !== 'CRASHED' && status !== 'CASHOUT'}
                  className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-zinc-400 transition-colors uppercase disabled:opacity-30"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="pt-6 border-t border-white/5">
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block flex items-center gap-2">
                 <History size={12} /> Últimos Sinais
               </span>
               <div className="flex gap-2 flex-wrap">
                 {history.map((h, i) => (
                   <div key={i} className={cn(
                     "px-2 py-1 rounded-md text-[10px] font-mono font-bold border",
                     h.multiplier >= 2.0 ? "bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                   )}>
                     {h.multiplier.toFixed(2)}x
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-4 relative z-10">
          {status === 'IDLE' || status === 'CRASHED' || status === 'CASHOUT' ? (
            <button
              onClick={startGame}
              className="w-full h-20 bg-accent-emerald text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-accent-emerald-hover shadow-glow-emerald transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Rocket size={20} fill="currentColor" />
              {status === 'CRASHED' ? 'RE-SINCRONIZAR' : 'INICIAR SINCRONIA'}
            </button>
          ) : status === 'STARTING' ? (
             <button disabled className="w-full h-20 bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest rounded-2xl cursor-wait flex items-center justify-center gap-2">
               <span className="animate-pulse">Calibrando...</span>
             </button>
          ) : (
            <div className="relative">
              <AnimatePresence>
                {cashoutHovered && multiplier < 1.5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute -top-12 left-0 right-0 text-center"
                  >
                    <span className="bg-prestige-gold text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      Sinal fraco. Manter link?
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={handleCashout} 
                onMouseEnter={() => setCashoutHovered(true)}
                onMouseLeave={() => setCashoutHovered(false)}
                className="w-full h-20 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-zinc-200"
                style={{
                  boxShadow: tension === 'CRITICAL' ? `0 0 30px ${currentColor}` : 'none',
                  animation: tension === 'CRITICAL' ? 'pulse 0.5s infinite' : 'none'
                }}
              >
                <span className="relative z-10 text-xs tracking-[0.3em] mb-1 text-zinc-500">DESCONECTAR</span>
                <span className="relative z-10 text-2xl font-mono font-bold">{(bet * multiplier).toFixed(0)} VC</span>
                
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-zinc-200">
                  <div 
                    className="h-full transition-all duration-100 ease-linear"
                    style={{ 
                      width: '100%', 
                      backgroundColor: currentColor 
                    }} 
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Display */}
      <div
        className="lg:col-span-2 bg-surface-black rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col transition-transform duration-75"
        style={{ transform: `translate(${Math.random() * shakeIntensity - shakeIntensity/2}px, ${Math.random() * shakeIntensity - shakeIntensity/2}px)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
            backgroundSize: '40px 40px',
            backgroundPosition: '-1px -1px'
          }} 
        />
        
        <div className="relative flex-1 w-full h-full z-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={currentColor} stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
              <>
                <path 
                  d={areaData} 
                  fill="url(#trailGradient)" 
                  className="transition-colors duration-300"
                />
                <path 
                  d={pathData} 
                  fill="none" 
                  stroke={status === 'CRASHED' ? '#EF4444' : currentColor} 
                  strokeWidth="1.5"
                  filter="url(#glow)"
                  strokeLinecap="round"
                  className="transition-colors duration-200"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>

          {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
            <div 
              className="absolute w-10 h-10 -ml-5 -mt-5 z-20 will-change-transform"
              style={{ 
                left: `${safeX}%`, 
                top: `${safeY}%`,
                transform: `translate(-30%, -30%) rotate(${rotation}deg)` 
              }}
            >
               {status === 'CRASHED' ? (
                 <div className="relative">
                    <Skull className="text-red-500 w-12 h-12 animate-ping absolute opacity-50" />
                    <AlertTriangle className="text-red-500 w-12 h-12 drop-shadow-[0_0_20px_rgba(239,68,68,1)]" />
                 </div>
               ) : (
                 <div className="relative">
                    <Rocket 
                      className="w-10 h-10 drop-shadow-[0_0_15px_currentColor]" 
                      style={{ color: currentColor }} 
                      fill="#050505" 
                    />
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-12 opacity-80 blur-sm transition-colors duration-300"
                      style={{ background: `linear-gradient(to bottom, ${currentColor}, transparent)` }} 
                    />
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {status === 'STARTING' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="text-accent-emerald text-sm font-black tracking-[0.5em] uppercase animate-pulse"
              >
                Iniciando Motores...
              </motion.div>
            )}

            {(status === 'FLYING' || status === 'CASHOUT') && (
              <div className="text-center relative">
                 <div 
                   className="text-8xl font-mono font-black text-white tracking-tighter drop-shadow-2xl transition-colors duration-300"
                   style={{ 
                     textShadow: `0 0 ${shakeIntensity * 2}px ${currentColor}`,
                     transform: `scale(${1 + shakeIntensity * 0.005})`
                   }}
                 >
                   {multiplier.toFixed(2)}<span className="text-4xl" style={{ color: currentColor }}>x</span>
                 </div>
                 
                 {status === 'CASHOUT' && (
                   <motion.div
                     initial={{ y: 20, opacity: 0, scale: 0.8 }}
                     animate={{ y: 0, opacity: 1, scale: 1 }}
                     className="mt-4 bg-accent-emerald text-black px-6 py-2 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-glow-emerald"
                   >
                     <Zap size={16} fill="black" /> Saque Confirmado
                   </motion.div>
                 )}
              </div>
            )}

            {status === 'CRASHED' && (
               <motion.div 
                 initial={{ scale: 2, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-center bg-black/80 p-8 rounded-3xl backdrop-blur-sm border border-red-500/30"
               >
                 <div className="text-red-500 mb-2 flex justify-center">
                    <Crosshair size={48} className="animate-spin-slow" />
                 </div>
                 <div className="text-6xl font-black text-red-500 tracking-tighter italic drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                   SINAL PERDIDO
                 </div>
                 <div className="text-xl font-mono font-bold text-zinc-400 mt-2">
                   Crash em <span className="text-white">{multiplier.toFixed(2)}x</span>
                 </div>
                 <div className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
                   Aguardando reinicialização manual...
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
          style={{
            opacity: tension === 'CRITICAL' ? 0.3 : 0,
            background: 'radial-gradient(circle, transparent 50%, rgb(255, 0, 85) 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default QuantumCrash;