"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Diamond, ShieldCheck, Play, StopCircle, AlertTriangle, RefreshCcw } from 'lucide-react'; 
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';
import { cn } from '@/lib/utils';

const GRID_SIZE = 25;
const MINES_OPTIONS = [1, 3, 5, 10, 15];

// Frases ajustadas para contexto de mineração de dados/sincronia
const RISK_MESSAGES = [
  "Sinal estável. Continuar extração?",
  "Padrão de dados promissor identificado.",
  "Risco de corrupção baixo. Prosseguir?",
  "Latência de rede otimizada.",
  "Sincronização parcial completa."
];

const DataSyncGame = () => {
  const { engagementTokens, spendTokens } = useStore(); // Usando tokens, não balance (USDT)
  
  // Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'WIN' | 'LOSS' | null>(null);
  
  // Logic State
  const [grid, setGrid] = useState<('IDLE' | 'SAFE' | 'MINE')[]>(new Array(GRID_SIZE).fill('IDLE'));
  const [mineLocations, setMineLocations] = useState<number[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  
  // UI/UX State
  const [shakeGrid, setShakeGrid] = useState(false);
  const [showCashoutHint, setShowCashoutHint] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  
  // Inputs
  const [bet, setBet] = useState(10);
  const [minesCount, setMinesCount] = useState(3);
  const [multiplier, setMultiplier] = useState(1.0);

  const calculateNextMultiplier = (currentRevealed: number, totalMines: number) => {
    const totalSpots = GRID_SIZE - currentRevealed;
    const safeSpots = GRID_SIZE - totalMines - currentRevealed;
    const houseEdge = 0.99;
    const probability = safeSpots / totalSpots;
    if (probability <= 0) return multiplier;
    return multiplier * (1 / probability) * houseEdge;
  };

  const startGame = () => {
    if (engagementTokens < bet) {
      showError("VaultCoins insuficientes. Adquira ativos no Marketplace.");
      return;
    }

    const spent = spendTokens(bet);
    if (!spent) return;

    setIsPlaying(true);
    setIsGameOver(false);
    setGameResult(null);
    setGrid(new Array(GRID_SIZE).fill('IDLE'));
    setRevealedCount(0);
    setMultiplier(1.0);
    setShakeGrid(false);
    
    const newMines: number[] = [];
    while (newMines.length < minesCount) {
      const pos = Math.floor(Math.random() * GRID_SIZE);
      if (!newMines.includes(pos)) newMines.push(pos);
    }
    setMineLocations(newMines);
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || isGameOver || grid[index] !== 'IDLE') return;

    if (mineLocations.includes(index)) {
      handleGameOver(index);
    } else {
      const nextMult = calculateNextMultiplier(revealedCount, minesCount);
      setMultiplier(nextMult);
      setRevealedCount(prev => prev + 1);
      
      setGrid(prev => {
        const next = [...prev];
        next[index] = 'SAFE';
        return next;
      });

      if (revealedCount + 1 === GRID_SIZE - minesCount) {
        cashOut(nextMult);
      }
    }
  };

  const handleGameOver = (triggerIndex: number) => {
    setIsPlaying(false);
    setIsGameOver(true);
    setGameResult('LOSS');
    setShakeGrid(true); // Aciona o tremor
    setTimeout(() => setShakeGrid(false), 500);

    showError("FALHA DE SINCRONIA: Dados Corrompidos.");

    setGrid(prev => prev.map((_, idx) => 
      mineLocations.includes(idx) ? 'MINE' : (prev[idx] === 'SAFE' ? 'SAFE' : 'IDLE')
    ));
  };

  const cashOut = (finalMult = multiplier) => {
    setIsPlaying(false);
    setIsGameOver(true);
    setGameResult('WIN');
    
    // Aqui seria a chamada ao backend para creditar USDT (Reward)
    // Por enquanto, apenas feedback visual
    const rewardValue = (bet * finalMult) * 0.1; // Ex: 10 coins -> $1 (ratio simulado)
    
    showSuccess(`Sincronia Concluída! Recompensa gerada: $${rewardValue.toFixed(2)} USDT`);
    
    setGrid(prev => prev.map((status, idx) => 
      mineLocations.includes(idx) ? 'IDLE' : status
    ));
  };

  const handleCashoutHover = (isHovering: boolean) => {
    if (!isPlaying) return;
    
    if (isHovering && multiplier < 1.5) {
      const randomMsg = RISK_MESSAGES[Math.floor(Math.random() * RISK_MESSAGES.length)];
      setHintMessage(randomMsg);
      setShowCashoutHint(true);
    } else {
      setShowCashoutHint(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[600px]">
      {/* Control Panel */}
      <div className="lg:col-span-4 bg-[#09090b] rounded-xl border border-white/10 p-6 flex flex-col gap-6 h-full shadow-xl relative z-20">
        <header className="mb-2">
          <div className="flex items-center gap-2 mb-2 opacity-50">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Protocolo de Segurança</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Validação de Blocos</h2>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Alocação (VaultCoins)</label>
            <div className="relative group">
              <input 
                type="number" 
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={isPlaying}
                className="w-full bg-[#121212] border border-white/10 rounded-lg h-12 pl-4 pr-4 font-mono text-sm text-white focus:border-[#00FF9C] focus:ring-1 focus:ring-[#00FF9C]/20 outline-none transition-all disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => !isPlaying && setBet(val)}
                  disabled={isPlaying}
                  className="h-8 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-400 transition-colors disabled:opacity-30"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Complexidade (Minas)</label>
            <div className="grid grid-cols-5 gap-2">
              {MINES_OPTIONS.map(count => (
                <button
                  key={count}
                  onClick={() => !isPlaying && setMinesCount(count)}
                  disabled={isPlaying}
                  className={cn(
                    "h-10 rounded-lg border text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    minesCount === count 
                      ? "bg-[#00FF9C]/10 border-[#00FF9C] text-[#00FF9C]" 
                      : "bg-[#121212] border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-end">
             <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Eficiência Atual</span>
             <span className={cn("text-3xl font-mono font-bold tracking-tighter", isPlaying ? "text-[#00FF9C]" : "text-zinc-600")}>
               {multiplier.toFixed(2)}x
             </span>
          </div>
          <div className="flex justify-between items-end">
             <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Retorno Potencial</span>
             <span className={cn("text-lg font-mono font-medium", isPlaying ? "text-white" : "text-zinc-600")}>
               {(bet * multiplier).toFixed(0)} VC
             </span>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {showCashoutHint && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-16 left-0 right-0 bg-[#FFD700] text-black p-3 rounded-lg shadow-lg z-30 pointer-events-none"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} fill="black" className="shrink-0" />
                  <p className="text-[10px] font-black uppercase leading-tight">{hintMessage}</p>
                </div>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFD700] rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {!isPlaying ? (
            <button 
              onClick={startGame}
              className="w-full bg-[#00FF9C] text-black h-14 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#00e68d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,156,0.1)]"
            >
              <Play size={16} fill="currentColor" /> Iniciar Validação
            </button>
          ) : (
            <button 
              onClick={() => cashOut()}
              onMouseEnter={() => handleCashoutHover(true)}
              onMouseLeave={() => handleCashoutHover(false)}
              className="w-full bg-white text-black h-14 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <StopCircle size={18} /> Consolidar Dados
            </button>
          )}
        </div>
      </div>

      {/* Grid Interface */}
      <motion.div 
        animate={shakeGrid ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="lg:col-span-8 h-full bg-[#050505] rounded-xl border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="grid grid-cols-5 gap-3 w-full max-w-[500px] aspect-square relative z-10">
          {grid.map((status, i) => (
            <motion.button
              key={i}
              whileHover={status === 'IDLE' && isPlaying ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
              whileTap={status === 'IDLE' && isPlaying ? { scale: 0.96 } : {}}
              onClick={() => handleTileClick(i)}
              disabled={!isPlaying && status === 'IDLE'}
              className={cn(
                "relative rounded-lg flex items-center justify-center transition-all duration-200 border",
                status === 'IDLE' && "bg-[#121212] border-white/5 cursor-pointer disabled:cursor-default",
                status === 'SAFE' && "bg-[#00FF9C]/5 border-[#00FF9C]/30 cursor-default",
                status === 'MINE' && "bg-red-500/10 border-red-500/30 cursor-default shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]",
                !isPlaying && status === 'IDLE' && "opacity-40"
              )}
            >
              <AnimatePresence mode="popLayout">
                {status === 'SAFE' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Diamond size={24} fill="currentColor" className="text-[#00FF9C] drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]" />
                  </motion.div>
                )}
                
                {status === 'MINE' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Bomb size={24} fill="currentColor" className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DataSyncGame;