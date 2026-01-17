import { ActivityItem } from '../../domain/entities';
import { ArrowDownLeft, ArrowUpRight, Clock, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  activities: ActivityItem[] | undefined;
  isLoading: boolean;
}

const TypeBadge = ({ type }: { type: ActivityItem['type'] }) => {
  const styles = {
    'NFT_PURCHASE': "text-blue-400 bg-blue-400/10 border-blue-400/20",
    'GAME_WIN': "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    'GAME_LOSS': "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
    'WITHDRAWAL': "text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/20"
  };

  const labels = {
    'NFT_PURCHASE': 'AQUISIÇÃO',
    'GAME_WIN': 'RECOMPENSA',
    'GAME_LOSS': 'CONSUMO',
    'WITHDRAWAL': 'SAQUE'
  };

  return (
    <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border", styles[type])}>
      {labels[type]}
    </span>
  );
};

export const RecentActivity = ({ activities, isLoading }: Props) => {
  if (isLoading) {
    return <div className="h-48 bg-[#121212] rounded-2xl border border-white/5 animate-pulse" />;
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center border-dashed">
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Nenhum registro no ledger.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0A0A0A] border border-white/5 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0F0F0F]">
        <div className="flex items-center gap-2">
           <Hash size={14} className="text-zinc-500" />
           <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Activity Ledger</h3>
        </div>
        <div className="text-[10px] font-mono text-zinc-600">SYNCED</div>
      </div>
      
      <div className="divide-y divide-white/5">
        {activities.map((item) => (
          <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
            
            <div className="flex items-center gap-4 flex-1">
              <div className="w-24 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                <Clock size={10} />
                {new Date(item.timestamp).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit'})} 
                <span className="opacity-50">|</span> 
                {new Date(item.timestamp).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
              </div>
              
              <TypeBadge type={item.type} />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-300 truncate group-hover:text-white transition-colors">
                  {item.description}
                </p>
                <p className="text-[9px] font-mono text-zinc-600">ID: {item.id.toUpperCase()}</p>
              </div>
            </div>

            <div className="text-right pl-4">
              <div className={cn(
                "font-mono font-bold text-sm flex items-center justify-end gap-1",
                item.amount > 0 ? "text-white" : "text-zinc-500",
                item.currency === 'USDT' && item.amount > 0 ? "text-[#FFD700]" : "",
                item.currency === 'VAULT' && item.amount > 0 ? "text-emerald-400" : ""
              )}>
                {item.amount > 0 ? '+' : ''}{item.amount}
                <span className="text-[9px] opacity-60 ml-0.5">{item.currency}</span>
                {item.amount > 0 ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
              </div>
            </div>

          </div>
        ))}
      </div>
      
      <div className="bg-[#0F0F0F] border-t border-white/5 px-4 py-2 text-center">
         <button className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
           Ver Histórico Completo
         </button>
      </div>
    </div>
  );
};