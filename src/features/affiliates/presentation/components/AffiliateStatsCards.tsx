import { AffiliateStats } from '../../domain/entities';
import { Users, UserPlus, Coins, Crown } from 'lucide-react';

interface Props {
  stats: AffiliateStats;
}

export const AffiliateStatsCards = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <UserPlus size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Convites</span>
        </div>
        <div className="text-3xl font-mono font-black text-white tracking-tighter tabular-nums">
          {stats.totalReferrals}
        </div>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Users size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ativos</span>
        </div>
        <div className="text-3xl font-mono font-black text-white tracking-tighter tabular-nums">
          {stats.activeReferrals}
        </div>
        <p className="text-[10px] text-zinc-600 mt-2">
          Taxa de conversão: {(stats.conversionRate * 100).toFixed(1)}%
        </p>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
            <Coins size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ganhos Totais</span>
        </div>
        <div className="text-3xl font-mono font-black text-white tracking-tighter tabular-nums">
          ${stats.totalEarnings.toFixed(2)}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#121212] to-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Crown size={60} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Crown size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nível Atual</span>
        </div>
        <div className="text-2xl font-black text-white uppercase tracking-tight">
          {stats.currentTier}
        </div>
        <p className="text-[10px] text-zinc-500 mt-2">Próximo nível: Gold</p>
      </div>
    </div>
  );
};