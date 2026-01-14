"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Trophy, History, AlertTriangle } from 'lucide-react';
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
  const [payout, setPayout] = useState<number | null>(null);

  // -- Render/Logic Refs --
  // Usamos refs para valores que mudam a cada frame para evitar re-renders do React no loop crítico
  const reqRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  
  // -- Camera/Graph State --
  // Controla o "zoom" do gráfico conforme o avião sobe
  const [scaleX, setScaleX] = useState(10); // Segundos visíveis no eixo X
  const [scaleY, setScaleY] = useState(2);  // Multiplicador visível no eixo Y

  // Limpar loop ao desmontar
  useEffect(() => {
    return () => cancelAnimation();
  }, []);

  const cancelAnimation = () => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
  };

  // -- Game Logic --

  const startGame = () => {
    if (balance < bet) {
      showError("Saldo insuficiente para iniciar sincronia.");
      return;
    }

    updateBalance(-bet);
    setStatus('STARTING');
    setPayout(null);
    setMultiplier(1.00);
    setScaleX(8); // Reset zoom
    setScaleY(2); // Reset zoom
    
    // Simulação de "Network Handshake"
    setTimeout(() => {
      setStatus('FLYING');
      startTimeRef.current = Date.now();
      // Algoritmo de Crash (Simulado) - Weighted Randomness
      // 3% de chance de crash instantâneo (1.0x)
      // Distribuição logarítmica para o resto
      const r = Math.random();
      let crash = 1.0;
      if (r > 0.03) {
         crash = Math.floor(100 * Math.E ** (Math.random() * Math.log(100))) / 100;
         // Capa valores absurdos para demo
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
    
    // Curva de Crescimento Exponencial: M(t) = e^(0.06 * t)
    // Ajuste o 0.06 para mudar a velocidade do jogo
    const currentMult = Math.pow(Math.E, 0.12 * elapsedSeconds);

    setMultiplier(currentMult);

    // Ajuste dinâmico da Câmera (Zoom Out)
    // Se o tempo passar do limite X ou mult passar do limite Y, aumentamos a escala
    if (elapsedSeconds > scaleX * 0.8) {
      setScaleX(prev => prev + (prev * 0.005)); // Aumenta X suavemente
    }
    if (currentMult > scaleY * 0.8) {
      setScaleY(prev => prev + (prev * 0.01)); // Aumenta Y suavemente
    }

    // Checagem de Crash
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

  // -- Render Calculations --

  // Transforma Tempo/Mult em coordenadas SVG (0-100%)
  const getPosition = (t: number, m: number) => {
    // X: Tempo relativo à escala X
    const x = (t / scaleX) * 100;
    // Y: Multiplicador relativo à escala Y (Invertido pois SVG Y=0 é topo)
    // Logarítmico visualmente fica melhor para crash, mas linear é mais fácil de entender a "subida"
    const normalizedY = (m - 1) / (scaleY - 1); 
    const y = 100 - (normalizedY * 100);
    return { x, y };
  };

  // Posição atual do "Drone"
  const elapsed = status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT' 
    ? (Math.log(multiplier) / 0.12) // Inverso da fórmula de crescimento para pegar o tempo exato
    : 0;
    
  const dronePos = getPosition(elapsed, multiplier);
  
  // Limites de renderização para não quebrar o SVG
  const safeDroneX = Math.min(Math.max(dronePos.x, 0), 100);
  const safeDroneY = Math.min(Math.max(dronePos.y, 0), 100);

  // Geração do Path do gráfico (Rastro)
  // Desenhamos uma curva Bezier simples do ponto (0, 100%) até o drone
  const pathData = `
    M 0 100 
    Q ${safeDroneX * 0.5} 100, ${safeDroneX} ${safeDroneY}
  `;
  
  // Área preenchida embaixo da linha
  const areaData = `
    ${pathData}
    L ${safeDroneX} 100
    L 0 100
    Z
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px]">
      
      {/* --- Painel de Controle (Esquerda) --- */}
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
            {/* Quick Bet Buttons */}
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

          {/* Histórico Recente */}
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

        {/* Botão de Ação Principal */}
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
              {/* Progress bar visual indicating urgency could go here */}
              <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
      </div>

      {/* --- Display Gráfico (Direita) --- */}
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col">
        {/* Background Grid - Técnico */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
            backgroundSize: '40px 40px',
            backgroundPosition: '-1px -1px'
          }} 
        />
        
        {/* Camada SVG Principal */}
        <div className="relative flex-1 w-full h-full z-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF9C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00FF9C" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            </defs>

            {/* Linha do Gráfico */}
            {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
              <>
                <path 
                  d={areaData} 
                  fill="url(#trailGradient)" 
                  className="transition-all duration-75 ease-linear"
                />
                <path 
                  d={pathData} 
                  fill="none" 
                  stroke={status === 'CRASHED' ? '#EF4444' : '#00FF9C'} 
                  strokeWidth="3"
                  filter="url(#glow)"
                  strokeLinecap="round"
                  className="transition-colors duration-200"
                />
              </>
            )}
          </svg>

          {/* O "Drone" / Avião */}
          {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
            <div 
              className="absolute w-8 h-8 -ml-4 -mt-4 transition-transform duration-75 ease-linear z-20"
              style={{ 
                left: `${safeDroneX}%`, 
                top: `${safeDroneY}%`,
                transform: `translate(-50%, -50%) rotate(${status === 'CRASHED' ? 90 : -45}deg)`
              }}
            >
               {/* Sprite Visual */}
               {status === 'CRASHED' ? (
                 <div className="relative">
                    <AlertTriangle className="text-red-500 w-8 h-8 animate-ping absolute opacity-50" />
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                 </div>
               ) : (
                 <div className="relative">
                    <Rocket className="text-[#00FF9C] w-8 h-8 drop-shadow-[0_0_15px_rgba(0,255,156,0.8)]" fill="#000" />
                    {/* Partículas de motor */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-[#00FF9C] to-transparent opacity-50 blur-sm" />
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Overlay Central de Status */}
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
              <motion.div className="text-center">
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
              </motion.div>
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