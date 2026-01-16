import { AdminStats } from '../../domain/entities';
import { Users, Coins, AlertOctagon, Wallet } from 'lucide-react';

interface Props {
  stats: AdminStats;
}

const StatCard = ({ label, value, icon: Icon, colorClass, subValue }: any) => (
  <div className="bg-[#121212] border border-white/5 rounded-xl p-5">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-mono font-black text-white mt-1 tabular-nums">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    {subValue && <p className="text-xs text-zinc-600">{subValue}</p>}
  </div>
);

export const AdminStatsView = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        label="Usuários Totais" 
        value={stats.totalUsers.toLocaleString()} 
        icon={Users} 
        colorClass="bg-blue-500" 
      />
      <StatCard 
        label="VaultCoins (Circulação)" 
        value={stats.totalVaultCoinsInCirculation.toLocaleString()} 
        icon={Coins} 
        colorClass="bg-emerald-500" 
      />
      <StatCard 
        label="Payouts (USDT)" 
        value={`$${stats.totalUsdtPaid.toLocaleString()}`} 
        icon={Wallet} 
        colorClass="bg-[#FFD700]" 
      />
      <StatCard 
        label="Pendências de Risco" 
        value={stats.pendingWithdrawalsCount + stats.flaggedAccountsCount} 
        icon={AlertOctagon} 
        colorClass="bg-red-500"
        subValue={`${stats.pendingWithdrawalsCount} Saques / ${stats.flaggedAccountsCount} Contas`}
      />
    </div>
  );
};