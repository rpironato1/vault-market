import React from 'react';
import { Trophy, Lock, CheckCircle, Wallet } from '@phosphor-icons/react';
import { RewardBalance } from '../../domain/entities';
import { useNavigate } from 'react-router-dom';

interface Props {
  balance: RewardBalance;
}

export const RewardStats = ({ balance }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Earned */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/5 text-zinc-400">
            <Trophy size={20} weight="duotone" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Gerado</span>
        </div>
        <div className="text-3xl font-mono font-black text-white tracking-tighter tabular-nums">
          ${balance.totalEarned.toFixed(2)}
        </div>
      </div>

      {/* Locked / Em Análise */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Lock size={20} weight="duotone" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bloqueado (Risk)</span>
        </div>
        <div className="text-3xl font-mono font-black text-white tracking-tighter tabular-nums">
          ${balance.locked.toFixed(2)}
        </div>
        <p className="text-[10px] text-zinc-600 mt-2">Aguardando validação antifraude.</p>
      </div>

      {/* Available - Actionable */}
      <div className="bg-[#121212] border border-[#FFD700]/20 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet size={80} weight="fill" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
              <CheckCircle size={20} weight="duotone" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]">Disponível</span>
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-tighter tabular-nums mb-4">
            ${balance.available.toFixed(2)}
          </div>
          
          <button 
            onClick={() => navigate('/app/withdrawals')}
            disabled={balance.available <= 0}
            className="w-full h-10 rounded-lg bg-[#FFD700] hover:bg-[#ffdf33] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Solicitar Saque
          </button>
        </div>
      </div>
    </div>
  );
};