import { Zap, Lock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Trophy } from '@phosphor-icons/react';
import { DashboardBalances } from '../../domain/entities';

interface BalanceCardsProps {
  balances: DashboardBalances | null;
  isLoading: boolean;
}

export const BalanceCards = ({ balances, isLoading }: BalanceCardsProps) => {
  if (isLoading || !balances) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 rounded-2xl bg-[#121212] border border-white/5 animate-pulse" />
        <div className="h-40 rounded-2xl bg-[#121212] border border-white/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* VaultCoins Card - Utility / Emerald Theme */}
      <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-emerald-500/20 p-6 transition-all hover:border-emerald-500/40 hover:bg-[#0F0F0F]">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <Zap size={100} />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Zap size={18} fill="currentColor" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block leading-none mb-1">Utility Token</span>
                <span className="text-xs font-bold text-white">VaultCoins</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
               <TrendingUp size={12} />
               <span>ATIVO</span>
            </div>
          </div>

          <div>
            <div className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
              {balances.vaultCoins.toLocaleString()}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent my-4" />
            <div className="flex justify-between items-center">
               <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                 Disponível para Validação
               </p>
               <span className="text-xs font-bold text-emerald-500 group-hover:underline decoration-1 underline-offset-4 cursor-pointer">
                 Extrato &rarr;
               </span>
            </div>
          </div>
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />
      </div>

      {/* USDT Rewards Card - Finance / Gold Theme */}
      <div className="group relative overflow-hidden rounded-2xl bg-[#0A0A0A] border border-prestige-gold/20 p-6 transition-all hover:border-prestige-gold/40 hover:bg-[#0F0F0F]">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <Trophy size={100} weight="fill" />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-prestige-gold/10 text-prestige-gold border border-prestige-gold/20">
                <Trophy size={18} weight="fill" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block leading-none mb-1">Treasury Payout</span>
                <span className="text-xs font-bold text-white">USDT Rewards</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-prestige-gold bg-prestige-gold/10 px-2 py-1 rounded border border-prestige-gold/20">
               <ArrowUpRight size={12} />
               <span>POLYGON</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-prestige-gold">$</span>
              <span className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-[#FFD700]/50">
                {balances.usdtAvailable.toFixed(2)}
              </span>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-[#FFD700]/30 to-transparent my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={10} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500">
                  <strong className="text-zinc-300">${balances.usdtLocked.toFixed(2)}</strong> em análise
                </span>
              </div>
              <span className="text-xs font-bold text-prestige-gold group-hover:underline decoration-1 underline-offset-4 cursor-pointer">
                 Sacar &rarr;
              </span>
            </div>
          </div>
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-prestige-gold/5 blur-[50px] rounded-full pointer-events-none" />
      </div>
    </div>
  );
};