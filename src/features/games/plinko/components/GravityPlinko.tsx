"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Coins, ArrowDown } from 'lucide-react';
import { useStore } from '@/_infrastructure/state/store';
import { showSuccess, showError } from '@/utils/toast';

const MULTIPLIERS = [15, 8, 3, 1.5, 0.5, 0.2, 0.5, 1.5, 3, 8, 15];
const PINS_ROWS = 8;

const GravityPlinko = () => {
  const { balance, updateBalance } = useStore();
  const [bet, setBet] = useState(5);
  const [balls, setBalls] = useState<{ id: number; path: number[] }[]>([]);

  const dropBall = () => {
    if (balance < bet) {
      showError("Saldo insuficiente.");
      return;
    }
    updateBalance(-bet);
    const id = Date.now();
    const path: number[] = [];
    let currentPos = 0;
    for (let i = 0; i < PINS_ROWS; i++) {
      const move = Math.random() > 0.5 ? 1 : -1;
      currentPos += move;
      path.push(currentPos);
    }
    setBalls(prev => [...prev, { id, path }]);
    setTimeout(() => {
      const finalIndex = Math.floor((currentPos + PINS_ROWS) / 2);
      const mult = MULTIPLIERS[finalIndex] || 0.5;
      const win = bet * mult;
      updateBalance(win);
      if (mult >= 1) showSuccess(`Unidade Validada: +$${win.toFixed(2)}`);
      setBalls(prev => prev.filter(b => b.id !== id));
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px]">
      <div className="bg-[#121212] rounded-[32px] border border-white/5 p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <header>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Algoritmo de Queda</span>
            <div className="flex items-center gap-2">
               <Database className="text-[#00FF9C] h-4 w-4" />
               <span className="text-xs font-bold text-white uppercase">Sincronia de Dados</span>
            </div>
          </header>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Valor por Unidade</label>
            <div className="flex gap-2">
              {[1, 5, 10, 50].map(v => (
                <button key={v} onClick={() => setBet(v)} className={`flex-1 h-12 rounded-xl font-mono text-xs font-bold transition-all border ${bet === v ? 'bg-[#00FF9C] text-black border-[#00FF9C]' : 'bg-white/5 text-zinc-400 border-white/10 hover:border-white/20'}`}>
                  ${v}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={dropBall} className="w-full h-20 bg-[#00FF9C] text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3">
          <Coins size={20} fill="currentColor" /> Soltar Unidade
        </button>
      </div>
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col items-center p-10">
        <div className="w-full flex justify-center mb-8">
          <div className="h-4 w-20 bg-zinc-800 rounded-b-xl border-x border-b border-white/10 flex items-center justify-center">
             <ArrowDown className="text-zinc-500 h-3 w-3 animate-bounce" />
          </div>
        </div>
        <div className="relative flex-1 w-full flex flex-col items-center justify-center gap-6">
          {Array.from({ length: PINS_ROWS }).map((_, row) => (
            <div key={row} className="flex gap-8">
              {Array.from({ length: row + 2 }).map((_, pin) => (
                <div key={pin} className="h-2 w-2 rounded-full bg-zinc-700 shadow-[0_0_5px_rgba(255,255,255,0.1)]" />
              ))}
            </div>
          ))}
          <AnimatePresence>
            {balls.map((ball) => (
              <motion.div key={ball.id} initial={{ y: -50, x: 0 }} animate={{ y: Array.from({ length: PINS_ROWS }).map((_, i) => (i + 1) * 45), x: ball.path.map(p => p * 15) }} transition={{ duration: 2, ease: "linear" }} className="absolute top-0 h-4 w-4 rounded-full bg-[#00FF9C] shadow-[0_0_15px_#00FF9C] z-20" />
            ))}
          </AnimatePresence>
        </div>
        <div className="w-full flex gap-1 mt-auto">
          {MULTIPLIERS.map((m, i) => (
            <div key={i} className={`flex-1 h-10 rounded-lg flex items-center justify-center text-[10px] font-black border ${m >= 8 ? 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]' : m >= 1.5 ? 'bg-[#00FF9C]/10 border-[#00FF9C]/30 text-[#00FF9C]' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
              {m}x
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GravityPlinko;