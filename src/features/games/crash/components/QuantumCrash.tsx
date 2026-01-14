"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, History, AlertTriangle, Skull, CheckCircle2, TrendingUp } from 'lucide-react';
import { useStore } from '@/_infrastructure/state/store';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

// --- Assets & Configs ---
type GameStatus = 'IDLE' | 'STARTING' | 'FLYING' | 'CRASHED' | 'CASHOUT';

interface GameHistory {
  multiplier: number;
  timestamp: number;
}

const HISTORY_LIMIT = 5;

// Frases de "Negging" (Psicologia Reversa) para o botão de saque
const HOVER_TAUNTS = [
  "Mãos de alface?",
  "O foguete aguenta mais...",
  "Lucro baixo detectado.",
  "Vai ejetar agora?",
  "Hold for Glory."
];

// --- CSS Styles (In-File for Performance/Encapsulation) ---
const GLITCH_STYLES = `
  @keyframes shake-hard {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }
  
  @keyframes glitch-anim {
    0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
    20% { clip-path: inset(92% 0 1% 0); transform: translate(0px, 0px); }
    40% { clip-path: inset(43% 0 1% 0); transform: translate(2px, -2px); }
    60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 2px); }
    80% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, -2px); }
    100% { clip-path: inset(58% 0 43% 0); transform: translate(0px, 0px); }
  }

  .shake-stress { animation: shake-hard 0.5s cubic-bezier(.36,.07,.19,.97) infinite; }
  .glitch-layer { animation: glitch-anim 0.3s infinite linear alternate-reverse; }
`;

const QuantumCrash = () => {
  const { balance, updateBalance } = useStore();
  
  // -- Game State --
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [multiplier, setMultiplier] = useState(1.00);
  const [bet, setBet] = useState(10);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [payout, setPayout] = useState<number | null>(null);

  // -- UX State --
  const [hoverMessage, setHoverMessage] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState(0); // 0 a 100 (intensidade visual)

  // -- Refs --
  const reqRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);
  
  // -- Camera State --
  const [scaleX, setScaleX] = useState(10);
  const [scaleY, setScaleY] = useState(2);

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
    setStressLevel(0);
    setScaleX(8);
    setScaleY(2);
    
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

    // Calcular nível de "Stress" do sistema (0 a 100%)
    // Começa a ficar tenso após 2.0x, máximo em 10.0x
    const newStress = Math.min(Math.max((currentMult - 1.5) / 8, 0), 1) * 100;
    setStressLevel(newStress);

    // Camera Logic
    if (elapsedSeconds > scaleX * 0.8) setScaleX(prev => prev * 1.005);
    if (currentMult > scaleY * 0.8) setScaleY(prev => prev * 1.01);

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
    setStressLevel(0); // Reset stress visual
    // Efeito sonoro seria disparado aqui
  };

  const handleCashout = () => {
    if (status !== 'FLYING') return;
    cancelAnimation();
    
    const winAmount = bet * multiplier;
    updateBalance(winAmount);
    setPayout(winAmount);
    setStatus('CASHOUT');
    addToHistory(multiplier);
    setStressLevel(0);
    showSuccess(`Sincronia encerrada: +$${winAmount.toFixed(2)}`);
  };

  const addToHistory = (val: number) => {
    setHistory(prev => [{ multiplier: val, timestamp: Date.now() }, ...prev].slice(0, HISTORY_LIMIT));
  };

  // -- Render Math --
  const getPosition = (t: number, m: number) => {
    const x = (t / scaleX) * 100;
    const normalizedY = (m - 1) / (scaleY - 1); 
    const y = 100 - (normalizedY * 100);
    return { x, y };
  };

  const elapsed = status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT' 
    ? (Math.log(multiplier) / 0.12)
    : 0;
    
  const dronePos = getPosition(elapsed, multiplier);
  const safeDroneX = Math.min(Math.max(dronePos.x, 0), 100);
  const safeDroneY = Math.min(Math.max(dronePos.y, 0), 100);

  const pathData = `M 0 100 Q ${safeDroneX * 0.6} 100, ${safeDroneX} ${safeDroneY}`;
  const areaData = `${pathData} L ${safeDroneX} 100 L 0 100 Z`;
  const rotation = status === 'CRASHED' ? 90 : Math.min(-15 - (100 - safeDroneY) * 0.3, -10);

  // -- UX Handlers --
  const handleButtonEnter = () => {
    if (status === 'FLYING' && multiplier < 1.5) {
      setHoverMessage(HOVER_TAUNTS[Math.floor(Math.random() * HOVER_TAUNTS.length)]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px] select-none">
      <style>{GLITCH_STYLES}</style>
      
      {/* --- Painel de Controle --- */}
      <div className="bg-[#09090b] rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative z-20 overflow-hidden">
        {/* Ambient Glow baseado no Stress */}
        <div 
          className="absolute inset-0 bg-red-500/10 pointer-events-none transition-opacity duration-300"
          style={{ opacity: stressLevel / 100 }} 
        />

        <div className="space-y-8 relative z-10">
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

        <div className="space-y-4 relative z-10">
          {status === 'IDLE' || status === 'CRASHED' || status === 'CASHOUT' ? (
            <button 
              onClick={startGame} 
              className={cn(
                "w-full h-20 font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3",
                status === 'CRASHED' 
                  ? "bg-white text-black hover:bg-zinc-200" // Revanche button
                  : "bg-[#00FF9C] text-black hover:bg-[#00e68d] hover:shadow-[0_0_30px_rgba(0,255,156,0.3)]"
              )}
            >
              <Rocket size={20} fill="currentColor" /> 
              {status === 'CRASHED' ? 'Tentar Novamente' : 'Iniciar Sincronia'}
            </button>
          ) : status === 'STARTING' ? (
             <button disabled className="w-full h-20 bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest rounded-2xl cursor-wait flex items-center justify-center gap-2">
               <span className="animate-pulse">Calibrando...</span>
             </button>
          ) : (
            <div className="relative">
              {/* Tooltip de Tensão */}
              <AnimatePresence>
                {hoverMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-12 left-0 right-0 text-center"
                  >
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      {hoverMessage}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={handleCashout}
                onMouseEnter={handleButtonEnter}
                onMouseLeave={() => setHoverMessage(null)}
                // Aplica a classe de tremor baseado no stress level
                className={cn(
                  "w-full h-20 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group",
                  stressLevel > 50 && "shake-stress border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                )}
              >
                <span className="relative z-10 text-xs tracking-[0.3em] mb-1 opacity-70">
                   {stressLevel > 80 ? "EJETAR AGORA!" : "EJETAR CARGA"}
                </span>
                <span className="relative z-10 text-2xl font-mono font-bold">
                  ${(bet * multiplier).toFixed(2)}
                </span>
                
                {/* Visual Feedback de Urgência */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-red-600 w-full transition-all duration-300"
                  style={{ height: `${(stressLevel / 100) * 100}%`, opacity: 0.1 }}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Display Gráfico --- */}
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col">
        {/* Background Dinâmico */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', 
            backgroundSize: '40px 40px',
            backgroundPosition: '-1px -1px'
          }} 
        />
        
        {/* Flash Vermelho no Crash */}
        <AnimatePresence>
          {status === 'CRASHED' && (
            <motion.div 
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-red-500 z-40 pointer-events-none mix-blend-overlay"
            />
          )}
        </AnimatePresence>

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
                  strokeWidth="0.8"
                  filter="url(#glow)"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>

          {/* Avião */}
          {(status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT') && (
            <div 
              className="absolute w-8 h-8 -ml-4 -mt-4 z-20 will-change-transform"
              style={{ 
                left: `${safeDroneX}%`, 
                top: `${safeDroneY}%`,
                transform: `translate(-30%, -30%) rotate(${rotation}deg)` 
              }}
            >
               {status === 'CRASHED' ? (
                 <div className="relative">
                    {/* Partículas de Explosão Simples */}
                    <motion.div 
                       initial={{ scale: 1, opacity: 1 }}
                       animate={{ scale: 2, opacity: 0 }}
                       className="absolute inset-0 bg-red-500 rounded-full blur-sm"
                    />
                    <Skull className="text-red-500 w-8 h-8 animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                 </div>
               ) : (
                 <div className="relative">
                    <Rocket 
                      className={cn(
                        "text-[#00FF9C] w-8 h-8 drop-shadow-[0_0_15px_rgba(0,255,156,0.8)]",
                        stressLevel > 60 && "animate-pulse" // Foguete avisa instabilidade
                      )} 
                      fill="#000" 
                    />
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

            {(status === 'FLYING') && (
              <div className="text-center">
                 <div className={cn(
                   "text-7xl font-mono font-black tracking-tighter drop-shadow-2xl transition-colors",
                   stressLevel > 80 ? "text-red-500 shake-stress" : "text-white"
                 )}>
                   {multiplier.toFixed(2)}<span className="text-4xl opacity-50">x</span>
                 </div>
              </div>
            )}
            
            {status === 'CASHOUT' && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center bg-[#00FF9C]/10 backdrop-blur-md p-8 rounded-3xl border border-[#00FF9C]/20"
              >
                <div className="bg-[#00FF9C] text-black rounded-full p-3 mb-4 shadow-[0_0_30px_#00FF9C]">
                  <CheckCircle2 size={40} strokeWidth={3} />
                </div>
                <div className="text-[#00FF9C] text-xs font-black uppercase tracking-[0.4em] mb-2">Payload Secured</div>
                <div className="text-6xl font-black text-white tracking-tighter">
                  ${payout?.toFixed(2)}
                </div>
                <div className="mt-2 text-zinc-400 font-mono text-sm">
                  @ {multiplier.toFixed(2)}x
                </div>
              </motion.div>
            )}

            {status === 'CRASHED' && (
               <motion.div 
                 initial={{ scale: 1.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-center relative"
               >
                 {/* Camadas de Glitch Texto */}
                 <div className="glitch-layer absolute inset-0 text-8xl font-black text-red-500 tracking-tighter italic opacity-50 translate-x-1">
                   CRASHED
                 </div>
                 <div className="glitch-layer absolute inset-0 text-8xl font-black text-blue-500 tracking-tighter italic opacity-50 -translate-x-1 animation-delay-100">
                   CRASHED
                 </div>
                 
                 <div className="text-8xl font-black text-white tracking-tighter italic drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] relative z-10">
                   CRASHED
                 </div>
                 
                 <div className="flex items-center justify-center gap-2 mt-4 text-red-400 font-mono font-bold">
                   <TrendingUp className="rotate-90" />
                   Sinal Perdido em {multiplier.toFixed(2)}x
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