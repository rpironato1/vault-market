"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useUserStore } from '../../../_infrastructure/state/useUserStore';

const GRID_SIZE = 25;
const INITIAL_MINES = 3;

const DataSyncGame = () => {
  const { balance, spendBalance, tokens } = useUserStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<('IDLE' | 'SAFE' | 'CORRUPTED')[]>(new Array(GRID_SIZE).fill('IDLE'));
  const [mines, setMines] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState(10);

  const startGame = () => {
    if (!spendBalance(bet)) {
      showError("Saldo insuficiente para iniciar sincronização.");
      return;
    }

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
      showError("Sincronização Falhou: Setor Corrompido.");
    } else {
      setGrid(prev => {
        const next = [...prev];
        next[index] = 'SAFE';
        return next;
      });
      const newMult = multiplier + 0.25;
      setMultiplier(newMult);
    }
  };

  const cashOut = () => {
    setIsPlaying(false);
    const win = bet * multiplier;
    showSuccess(`Sincronização Concluída! +$${win.toFixed(2)} credenciados.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
            Custo de Sincronização
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full bg-black/40 border border-white/10 rounded-xl h-12 pl-8 pr-4 font-mono focus:border-emerald-500/50 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold uppercase">
            <span className="text-muted-foreground">Multiplicador Atual</span>
            <span className="text-emerald-400 font-mono">{multiplier.toFixed(2)}x</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500" 
              animate={{ width: `${(multiplier - 1) * 20}%` }}
            />
          </div>
        </div>

        {!isPlaying ? (
          <button 
            onClick={startGame}
            className="w-full bg-emerald-500 text-black font-bold h-14 rounded-xl hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Zap size={20} /> INICIAR VALIDAÇÃO
          </button>
        ) : (
          <button 
            onClick={cashOut}
            className="w-full bg-white text-black font-bold h-14 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
          >
            FINALIZAR E COLETAR (${(bet * multiplier).toFixed(2)})
          </button>
        )}
      </div>

      <div className="lg:col-span-2 flex justify-center">
        <div className="grid grid-cols-5 gap-3 max-w-[500px] w-full aspect-square">
          {grid.map((status, i) => (
            <motion.div
              key={i}
              whileHover={isPlaying && status === 'IDLE' ? { scale: 1.05 } : {}}
              whileTap={isPlaying && status === 'IDLE' ? { scale: 0.95 } : {}}
              onClick={() => handleTileClick(i)}
              className={`rounded-xl cursor-pointer flex items-center justify-center transition-all duration-300 border-2
                ${status === 'IDLE' ? 'bg-white/5 border-white/5 hover:border-white/10' : ''}
                ${status === 'SAFE' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : ''}
                ${status === 'CORRUPTED' ? 'bg-red-500/10 border-red-500/50 text-red-500' : ''}
              `}
            >
              {status === 'SAFE' && <CheckCircle2 size={24} />}
              {status === 'CORRUPTED' && <ShieldAlert size={24} />}
              {status === 'IDLE' && <Database size={20} className="opacity-20" />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSyncGame;