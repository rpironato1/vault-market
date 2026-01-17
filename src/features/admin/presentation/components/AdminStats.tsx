import { AdminStats } from '../../domain/entities';
import { Users, Coins, AlertOctagon, Wallet, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  stats: AdminStats;
}

const StatCard = ({ label, value, icon: Icon, theme, subValue }: any) => {
  const themes = {
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    emerald: "text-[#00FF9C] border-[#00FF9C]/20 bg-[#00FF9C]/5",
    gold: "text-[#FFD700] border-[#FFD700]/20 bg-[#FFD700]/5",
    red: "text-[#FF0055] border-[#FF0055]/20 bg-[#FF0055]/5",
  };

  const activeTheme = themes[theme as keyof typeof themes] || themes.blue;

  return (
    <div className={cn("rounded-xl border p-5 relative overflow-hidden group transition-all hover:border-opacity-50", activeTheme)}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 rounded-lg bg-black/40 border border-white/5">
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
           <ArrowUpRight size={12} />
           <span>24h</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-mono font-black tracking-tighter tabular-nums mb-1">
          {value}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{label}</p>
        {subValue && (
          <div className="mt-3 pt-3 border-t border-black/20 text-[10px] font-mono opacity-80">
            {subValue}
          </div>
        )}
      </div>

      {/* Glow Effect */}
      <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity", activeTheme.split(' ')[0].replace('text-', 'bg-'))} />
    </div>
  );
};

export const AdminStatsView = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        label="Total Usuários" 
        value={stats.totalUsers.toLocaleString()} 
        icon={Users} 
        theme="blue"
        subValue="+124 Novos hoje"
      />
      <StatCard 
        label="Circulação (VC)" 
        value={stats.totalVaultCoinsInCirculation.toLocaleString()} 
        icon={Coins} 
        theme="emerald" 
        subValue="Vol. Diário: 450k"
      />
      <StatCard 
        label="Payouts (USDT)" 
        value={`$${stats.totalUsdtPaid.toLocaleString()}`} 
        icon={Wallet} 
        theme="gold"
        subValue="Treasury: Saudável"
      />
      <StatCard 
        label="Ações de Risco" 
        value={stats.pendingWithdrawalsCount + stats.flaggedAccountsCount} 
        icon={AlertOctagon} 
        theme="red"
        subValue={`${stats.pendingWithdrawalsCount} Saques Pendentes`}
      />
    </div>
  );
};