"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap } from 'lucide-react';
import { useStore } from '@/_infrastructure/state/store';
import { showSuccess, showError } from '@/utils/toast';

const QuantumCrash = () => {
  const { balance, updateBalance } = useStore();
  const [multiplier, setMultiplier] = useState(1.00);
  const [status, setStatus] = useState<'IDLE' | 'FLYING' | 'CRASHED'>('IDLE');
  const [bet, setBet] = useState(10);
  const [cashoutAt, setCashoutAt] = useState<number | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const crashPoint = useRef<number>(2.5);

  const startFlight = () => {
    if (balance < bet) {
      showError("Saldo insuficiente para iniciar sincronia.");
      return;
    }

    updateBalance(-bet);
    setStatus('FLYING');
    setMultiplier(1.00);
    setCashoutAt(null);
    crashPoint.current = 1 + Math.random() * 5 + (Math.random() > 0.9 ? 10 : 0);

    timerRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + 0.01 * (prev * 0.5);
        if (next >= crashPoint.current) {
          handleCrash();
          return crashPoint.current;
        }
        return next;
      });
    }, 100);
  };

  const handleCrash = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('CRASHED');
    if (!cashoutAt) {
      showError(`Decaimento de Rede em ${crashPoint.current.toFixed(2)}x`);
    }
  };

  const handleCashout = () => {
    if (status !== 'FLYING' || cashoutAt) return;
    const win = bet * multiplier;
    setCashoutAt(multiplier);
    updateBalance(win);
    showSuccess(`Sincronia Concluída: +$${win.toFixed(2)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px]">
      <div className="bg-[#121212] rounded-[32px] border border-white/5 p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <header>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Status do Reator</span>
            <div className="flex items-center gap-2">
               <div className={`h-2 w-2 rounded-full animate-pulse ${status === 'FLYING' ? 'bg-[#00FF9C]' : 'bg-red-500'}`} />
               <span className="text-xs font-bold text-white uppercase">{status === 'FLYING' ? 'Ativo' : 'Aguardando'}</span>
            </div>
          </header>
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Carga de Entrada</label>
            <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={status === 'FLYING'}
              className="w-full bg-black border border-white/10 rounded-2xl h-14 px-6 font-mono text-xl font-black text-white outline-none focus:border-[#00FF9C]/50 transition-all"
            />
          </div>
        </div>
        <div className="space-y-4">
          {status !== 'FLYING' ? (
            <button onClick={startFlight} className="w-full h-20 bg-[#00FF9C] text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] transition-all active:scale-95">
              Iniciar Sincronia
            </button>
          ) : (
            <button onClick={handleCashout} disabled={!!cashoutAt} className={`w-full h-20 font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center ${cashoutAt ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-zinc-200'}`}>
              <span>{cashoutAt ? 'SINCRONIZADO' : 'CASH OUT'}</span>
              {!cashoutAt && <span className="text-xs font-mono">${(bet * multiplier).toFixed(2)}</span>}
            </button>
          )}
        </div>
      </div>
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <AnimatePresence mode="wait">
          {status === 'CRASHED' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm">
              <span className="text-8xl font-black text-red-500 italic uppercase tracking-tighter mb-4">CRASHED</span>
              <span className="text-2xl font-mono font-bold text-white">{multiplier.toFixed(2)}x</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative z-10 text-center">
          <motion.div animate={status === 'FLYING' ? { y: [0, -10, 0], scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity }} className="flex flex-col items-center">
            <div className={`text-9xl font-black tracking-tighter font-mono mb-4 transition-colors ${status === 'CRASHED' ? 'text-red-500' : 'text-white'}`}>
              {multiplier.toFixed(2)}<span className="text-4xl text-[#00FF9C]">x</span>
            </div>
            {status === 'FLYING' && (
              <div className="flex items-center gap-2 bg-[#00FF9C]/10 border border-[#00FF9C]/20 px-4 py-2 rounded-full">
                <Rocket className="text-[#00FF9C] h-4 w-4" />
                <span className="text-[10px] font-black text-[#00FF9C] uppercase tracking-widest">Sincronia Exponencial</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QuantumCrash;