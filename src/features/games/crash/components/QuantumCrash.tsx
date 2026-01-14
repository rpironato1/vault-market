"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, History, AlertTriangle } from 'lucide-react';
import { useStore } from '@/_infrastructure/state/store';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

// Tipos e Constantes
type GameStatus = 'IDLE' | 'STARTING' | 'FLYING' | 'CRASHED' | 'CASHOUT';

interface GameHistory {
  multiplier: number;
  timestamp: number;
}

const HISTORY_LIMIT = 5;

const QuantumCrash = () => {
  const { balance, updateBalance } = useStore();
  
  // -- Game State --
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [multiplier, setMultiplier] = useState(1.00);
  const [bet, setBet] = useState(10);
  const [history, setHistory] = useState<GameHistory[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [payout, setPayout] = useState<number | null>(null);

  // -- Refs de Loop e Lógica --
  const reqRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  
  // -- Refs de Renderização (Mutable para evitar Re-renders desnecessários no DOM) --
  // Usamos estado apenas para o que precisa atualizar a UI do React (números), 
  // mas coordenadas de alta frequência calculamos no render para garantir sincronia.
  const [viewScale, setViewScale] = useState({ x: 10, y: 2 }); // Escala máxima atual (Tempo, Multiplicador)

  useEffect(() => {
    return () => cancelAnimation();
  }, []);

  const cancelAnimation = () => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
  };

  const startGame = () => {
    if (balance < bet) {
      showError("Saldo insuficiente para iniciar sincronia.");
      return;
    }

    updateBalance(-bet);
    setStatus('STARTING');
    setPayout(null);
    setMultiplier(1.00);
    setViewScale({ x: 8, y: 2 }); // Reset da câmera
    
    // Simulação de delay de rede
    setTimeout(() => {
      setStatus('FLYING');
      startTimeRef.current = Date.now();
      
      // Algoritmo de Crash
      const r = Math.random();
      let crash = 1.0;
      // 3% de chance de crash instantâneo
      if (r > 0.03) {
         // Distribuição exponencial
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
    // Delta Time real desde o início do voo
    const elapsedSeconds = (now - startTimeRef.current) / 1000;
    
    // Crescimento Exponencial Padrão: M(t) = e^(k * t)
    // k = 0.06 define a velocidade da curva. 
    // Usamos o tempo total (elapsedSeconds) para garantir que a posição
    // seja uma função pura do tempo, sem erros de acumulação de frames.
    const growthRate = 0.12; 
    const currentMult = Math.pow(Math.E, growthRate * elapsedSeconds);

    setMultiplier(currentMult);

    // Lógica da Câmera (Determinística)
    // Mantemos o avião sempre visível dentro de uma "janela" segura.
    // Se o avião passar de 80% da tela, expandimos a escala.
    setViewScale(prev => ({
      x: Math.max(prev.x, elapsedSeconds * 1.2), // Mantém no max em ~83% da largura
      y: Math.max(prev.y, currentMult * 1.1)     // Mantém no max em ~90% da altura
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
    showError(`Sinal perdido em ${finalValue.toFixed(2)}x`);
  };

  const handleCashout = () => {
    if (status !== 'FLYING') return;
    cancelAnimation();
    
    const winAmount = bet * multiplier;
    updateBalance(winAmount);
    setPayout(winAmount);
    setStatus('CASHOUT');
    addToHistory(multiplier);
    showSuccess(`Sincronia encerrada: +$${winAmount.toFixed(2)}`);
  };

  const addToHistory = (val: number) => {
    setHistory(prev => [{ multiplier: val, timestamp: Date.now() }, ...prev].slice(0, HISTORY_LIMIT));
  };

  // -- Cálculos de Renderização (Executados a cada Render) --
  
  // 1. Determinar o tempo decorrido baseado no estado atual
  // Se estiver voando, recalcula. Se parou (Crash/Cashout), usa o valor final travado.
  const currentTime = status === 'STARTING' || status === 'IDLE' 
    ? 0 
    : (Math.log(multiplier) / 0.12); // Inverso da exponencial para obter o tempo exato do multiplicador atual

  // 2. Mapeamento Linear Estrito (0 a 100%)
  // X = Porcentagem do tempo atual em relação à escala X da câmera
  const xPercent = (currentTime / viewScale.x) * 100;
  
  // Y = Porcentagem do multiplicador atual (acima de 1.0) em relação à escala Y da câmera
  // O "-1" é porque o gráfico começa em 1.0x, que deve ser a base (0%)
  const yPercent = ((multiplier - 1) / (viewScale.y - 1)) * 100;
  
  // Inverter Y para coordenadas SVG (onde 0 é topo e 100 é base)
  const svgY = 100 - yPercent;

  // Clamping de segurança para renderização
  const safeX = Math.min(Math.max(xPercent, 0), 100);
  const safeY = Math.min(Math.max(svgY, 0), 100);

  // 3. Construção do Gráfico
  // Usamos Quadratic Bezier para suavizar levemente a curva visual, 
  // mas o ponto final (safeX, safeY) é matematicamente exato.
  const pathData = `
    M 0 100 
    Q ${safeX * 0.5} 100, ${safeX} ${safeY}
  `;
  
  const areaData = `
    ${pathData}
    L ${safeX} 100
    L 0 100
    Z
  `;

  // Rotação baseada na inclinação da curva (Tangente)
  // Quanto maior o Y percentual, mais inclinado o avião (até max -45deg)
  const rotation = status === 'CRASHED' ? 90 : Math.max(-45, -10 - (yPercent * 0.5));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px]">
      
      {/* --- Painel de Controle --- */}
      <div className="bg-[#09090b] rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative z-20">
        <div className="space-y-8">
          <header>
            <div className="flex items-center gap-2 mb-2">
               <Zap className={cn("h-4 w-4", status === 'FLYING' ? "text-[#00FF9C] animate-pulse" : "text-zinc-600")} />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status do Reator</span>
            </div>
            <div className="flex items-baseline gap-2">
               <h2 className="text-4xl font-black text-white italic tracking-tighter">QUANTUM</h2>
               <span className="text-sm font-bold text-[#00FF9C]">v2.4</span>
            </div>
          </header>

          <div className="space-y-4">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Carga de Entrada (USDT)</label>
            <div className="relative">
              <input 
                type="number" 
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={status === 'FLYING' || status === 'STARTING'}
                className="w-full bg-[#121212] border border-white/10 rounded-2xl h-16 px-6 font-mono text-2xl font-black text-white outline-none focus:border-[#00FF9C] transition-all disabled:opacity-50"
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

          {history.length > 0 && (
            <div className="pt-6 border-t border-white/5">
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block flex items-center gap-2">
                 <History size={12} /> Últimos Sinais
               </span>
               <div className="flex gap-2 flex-wrap">
                 {history.map((h, i) => (
                   <div key={i} className={cn(
                     "px-2 py-1 rounded-md text-[10px] font-mono font-bold border",
                     h.multiplier >= 2.0 ? "bg-[#00FF9C]/10 border-[#00FF9C]/30 text-[#00FF9C]" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                   )}>
                     {h.multiplier.toFixed(2)}x
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {status === 'IDLE' || status === 'CRASHED' || status === 'CASHOUT' ? (
            <button 
              onClick={startGame} 
              className="w-full h-20 bg-[#00FF9C] text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-[#00e68d] hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Rocket size={20} fill="currentColor" /> Iniciar Sincronia
            </button>
          ) : status === 'STARTING' ? (
             <button disabled className="w-full h-20 bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest rounded-2xl cursor-wait flex items-center justify-center gap-2">
               <span className="animate-pulse">Calibrando...</span>
             </button>
          ) : (
            <button 
              onClick={handleCashout} 
              className="w-full h-20 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <span className="relative z-10 text-xs tracking-[0.3em] mb-1">Ejetar Carga</span>
              <span className="relative z-10 text-2xl font-mono font-bold">${(bet * multiplier).toFixed(2)}</span>
              <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
      </div>

      {/* --- Display Gráfico --- */}
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col">
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
                <stop offset="0%" stopColor="#00FF9C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00FF9C" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Linhas SVG sem transition-all para evitar desync */}
            {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
              <>
                <path 
                  d={areaData} 
                  fill="url(#trailGradient)" 
                />
                <path 
                  d={pathData} 
                  fill="none" 
                  stroke={status === 'CRASHED' ? '#EF4444' : '#00FF9C'} 
                  strokeWidth="0.8"
                  filter="url(#glow)"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>

          {/* O "Drone" / Avião */}
          {/* IMPORTANTE: Removemos transition-all para que a posição siga exatamente o JS */}
          {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
            <div 
              className="absolute w-8 h-8 -ml-4 -mt-4 z-20 will-change-transform"
              style={{ 
                left: `${safeX}%`, 
                top: `${safeY}%`,
                transform: `translate(-30%, -30%) rotate(${rotation}deg)` 
              }}
            >
               {status === 'CRASHED' ? (
                 <div className="relative">
                    <AlertTriangle className="text-red-500 w-8 h-8 animate-ping absolute opacity-50" />
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                 </div>
               ) : (
                 <div className="relative">
                    <Rocket className="text-[#00FF9C] w-8 h-8 drop-shadow-[0_0_15px_rgba(0,255,156,0.8)]" fill="#000" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-[#00FF9C] to-transparent opacity-50 blur-sm" />
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Counter Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {status === 'STARTING' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="text-[#00FF9C] text-sm font-black tracking-[0.5em] uppercase animate-pulse"
              >
                Iniciando Motores...
              </motion.div>
            )}

            {(status === 'FLYING' || status === 'CASHOUT') && (
              <div className="text-center">
                 <div className="text-7xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">
                   {multiplier.toFixed(2)}<span className="text-[#00FF9C] text-4xl">x</span>
                 </div>
                 {status === 'CASHOUT' && (
                   <motion.div 
                     initial={{ y: 10, opacity: 0 }} 
                     animate={{ y: 0, opacity: 1 }}
                     className="mt-2 bg-[#00FF9C]/20 border border-[#00FF9C] px-4 py-1 rounded-full text-[#00FF9C] text-xs font-black uppercase tracking-widest inline-block"
                   >
                     Saque Realizado
                   </motion.div>
                 )}
              </div>
            )}

            {status === 'CRASHED' && (
               <motion.div 
                 initial={{ scale: 2, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-center"
               >
                 <div className="text-8xl font-black text-red-500 tracking-tighter italic drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                   CRASHED
                 </div>
                 <div className="text-2xl font-mono font-bold text-white mt-2">
                   @ {multiplier.toFixed(2)}x
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default QuantumCrash;