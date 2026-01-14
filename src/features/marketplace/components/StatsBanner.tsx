"use client";

import React, { useEffect, useState } from 'react';
import { TrendUp, CurrencyDollar } from '@phosphor-icons/react';

const StatsBanner = () => {
  const [total, setTotal] = useState(124500.00);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotal(prev => prev + Math.random() * 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-8 bg-card/50 border border-white/5 rounded-2xl px-8 py-4 backdrop-blur-md">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <CurrencyDollar weight="fill" className="text-emerald-500" size={16} />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sincronizados Hoje</span>
        </div>
        <div className="font-mono text-2xl font-black tracking-tighter text-white">
          USDT {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      <div className="h-10 w-px bg-white/5" />
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <TrendUp weight="fill" className="text-secondary" size={16} />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Usuários Ativos</span>
        </div>
        <div className="font-mono text-2xl font-black tracking-tighter text-white">
          4,842
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;