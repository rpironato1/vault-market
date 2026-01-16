import React from 'react';
import { Zap, Lock } from 'lucide-react';
import { Trophy } from '@phosphor-icons/react';
import { DashboardBalances } from '../../domain/entities';
import { cn } from '@/lib/utils';

interface BalanceCardsProps {
  balances: DashboardBalances | null;
  isLoading: boolean;
}

export const BalanceCards = ({ balances, isLoading }: BalanceCardsProps) => {
  if (isLoading || !balances) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        <div className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* VaultCoins Card - Utilitário */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-emerald-500/20 p-6 group hover:border-emerald-500/40 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">VaultCoins (Utility)</span>
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-tighter tabular-nums">
            {balances.vaultCoins.toLocaleString()}
          </div>
          <p className="text-xs text-zinc-500 mt-2 font-medium">
            Disponível para Experiências
          </p>
        </div>
      </div>

      {/* USDT Rewards Card - Financeiro */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-white/5 p-6 group hover:border-[#FFD700]/30 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
                <Trophy size={20} weight="fill" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Rewards (USDT)</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-bold text-[#FFD700]">$</span>
            <span className="text-4xl font-mono font-black text-white tracking-tighter tabular-nums">
              {balances.usdtAvailable.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600 bg-white/5 px-3 py-1.5 rounded-lg w-fit">
            <Lock size={12} />
            <span className="font-mono font-bold">{balances.usdtLocked.toFixed(2)}</span>
            <span className="uppercase tracking-wider text-[9px]">Bloqueado / Em Análise</span>
          </div>
        </div>
      </div>
    </div>
  );
};