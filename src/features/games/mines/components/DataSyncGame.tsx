"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldAlert, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@/_infrastructure/state/store';

const GRID_SIZE = 25;
const INITIAL_MINES = 3;

const DataSyncGame = () => {
  const { balance, updateBalance } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<('IDLE' | 'SAFE' | 'CORRUPTED')[]>(new Array(GRID_SIZE).fill('IDLE'));
  const [mines, setMines] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState(10);

  const startGame = () => {
    if (balance < bet) {
      showError("Saldo insuficiente para iniciar validação.");
      return;
    }

    updateBalance(-bet);
    const newMines: number[] = [];
    while (newMines.length < INITIAL_MINES) {
      const pos = Math.floor(Math.random() * GRID_SIZE);
      if (!newMines.includes(pos)) newMines.push(pos);
    }
    
    setMines(newMines);
    setGrid(new Array(GRID_SIZE).fill('IDLE'));
    setIsPlaying(true);
    setMultiplier(1.0);
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || grid[index] !== 'IDLE') return;

    if (mines.includes(index)) {
      setGrid(prev => {
        const next = [...prev];
        next[index] = 'CORRUPTED';
        return next;
      });
      setIsPlaying(false);
      showError("Sincronização Falhou: Setor Corrompido detectado.");
    } else {
      setGrid(prev => {
        const next = [...prev];
        next[index] = 'SAFE';
        return next;
      });
      const newMult = multiplier + 0.35;
      setMultiplier(newMult);
    }
  };

  const cashOut = () => {
    setIsPlaying(false);
    const win = bet * multiplier;
    updateBalance(win);
    showSuccess(`Validação Concluída! +$${win.toFixed(2)} credenciados.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Control Panel */}
      <div className="bg-[#121212] rounded-[32px] border border-white/5 p-8 flex flex-col gap-8 shadow-2xl">
        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 block">
            Carga de Operação (USDT)
          </label>
          <div className="relative group">
            <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full bg-black border border-white/10 rounded-2xl h-16 pl-6 pr-4 font-mono text-xl font-bold focus:border-[#00FF9C]/50 outline-none transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600 uppercase">Input</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Multiplicador de Rede</span>
             <span className="text-3xl font-mono font-black text-[#00FF9C] tracking-tighter">{multiplier.toFixed(2)}x</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-[#00FF9C] shadow-[0_0_15px_#00FF9C]" 
              animate={{ width: `${Math.min((multiplier - 1) * 20, 100)}%` }}
            />
          </div>
        </div>

        {!isPlaying ? (
          <button 
            onClick={startGame}
            className="w-full bg-[#00FF9C] text-black font-black h-18 rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <Zap size={20} fill="currentColor" /> Iniciar Validação
          </button>
        ) : (
          <button 
            onClick={cashOut}
            className="w-full bg-white text-black font-black h-18 rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            <ShieldCheck size={20} /> Finalizar (${(bet * multiplier).toFixed(2)})
          </button>
        )}
        
        <p className="text-[9px] font-bold text-zinc-600 text-center uppercase tracking-widest leading-relaxed">
          O término antecipado garante a integridade dos dados coletados até o momento.
        </p>
      </div>

      {/* Grid Interface */}
      <div className="lg:col-span-2 flex justify-center items-center bg-[#050505] rounded-[40px] border border-white/5 p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.05),transparent)] pointer-events-none" />
        
        <div className="grid grid-cols-5 gap-4 max-w-[500px] w-full aspect-square relative z-10">
          {grid.map((status, i) => (
            <motion.div
              key={i}
              whileHover={isPlaying && status === 'IDLE' ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
              whileTap={isPlaying && status === 'IDLE' ? { scale: 0.95 } : {}}
              onClick={() => handleTileClick(i)}
              className={`rounded-2xl cursor-pointer flex items-center justify-center transition-all duration-300 border-2 relative
                ${status === 'IDLE' ? 'bg-[#121212] border-white/5 hover:border-white/20' : ''}
                ${status === 'SAFE' ? 'bg-[#00FF9C]/10 border-[#00FF9C]/40 text-[#00FF9C] shadow-[0_0_20px_rgba(0,255,156,0.1)]' : ''}
                ${status === 'CORRUPTED' ? 'bg-[#FF3131]/10 border-[#FF3131]/40 text-[#FF3131] shadow-[0_0_20px_rgba(255,49,49,0.1)]' : ''}
              `}
            >
              {status === 'SAFE' && <CheckCircle2 size={28} strokeWidth={2.5} />}
              {status === 'CORRUPTED' && <ShieldAlert size={28} strokeWidth={2.5} />}
              {status === 'IDLE' && <div className="h-1.5 w-1.5 rounded-full bg-white/10" />}
              
              <AnimatePresence>
                {status === 'SAFE' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 2 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 border border-[#00FF9C] rounded-2xl pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSyncGame;