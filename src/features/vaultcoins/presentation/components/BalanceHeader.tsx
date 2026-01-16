import React from 'react';
import { Zap } from 'lucide-react';
import { VaultCoinBalance } from '../../domain/entities';

interface Props {
  balance: VaultCoinBalance;
}

export const BalanceHeader = ({ balance }: Props) => {
  return (
    <div className="bg-[#121212] border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
              VaultCoins Balance
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-mono font-black text-white tracking-tighter tabular-nums">
              {balance.current.toLocaleString()}
            </span>
            <span className="text-xl font-bold text-zinc-500">VC</span>
          </div>
          
          <p className="mt-4 text-sm text-zinc-400 max-w-md">
            Moeda utilitária obtida exclusivamente através da compra de NFTs ou recompensas. 
            Utilize em experiências para desbloquear prêmios.
          </p>
        </div>

        <div className="flex gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
          <div>
            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Ganho</span>
            <span className="font-mono text-xl font-bold text-white tabular-nums">
              {balance.totalEarned.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Usado</span>
            <span className="font-mono text-xl font-bold text-zinc-400 tabular-nums">
              {balance.totalSpent.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};