import { ActivityItem } from '../../domain/entities';
import { Clock, TrendingUp, TrendingDown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  activities: ActivityItem[] | undefined;
  isLoading: boolean;
}

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
  switch (type) {
    case 'NFT_PURCHASE': return <ShoppingBag size={16} className="text-blue-400" />;
    case 'GAME_WIN': return <TrendingUp size={16} className="text-emerald-400" />;
    case 'GAME_LOSS': return <TrendingDown size={16} className="text-red-400" />;
    case 'WITHDRAWAL': return <Clock size={16} className="text-[#FFD700]" />;
    default: return <Clock size={16} className="text-zinc-400" />;
  }
};

export const RecentActivity = ({ activities, isLoading }: Props) => {
  if (isLoading) {
    return <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />;
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-[#121212] border border-white/5 text-center">
        <p className="text-zinc-500 text-sm">Nenhuma atividade registrada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#121212] border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Últimas Movimentações</h3>
      </div>
      <div className="divide-y divide-white/5">
        {activities.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                <ActivityIcon type={item.type} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.description}</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "font-mono font-bold text-sm",
                item.amount > 0 ? "text-emerald-400" : "text-white",
                item.type === 'GAME_LOSS' && "text-zinc-500"
              )}>
                {item.amount > 0 ? '+' : ''}{item.amount} {item.currency}
              </span>
              <div className="text-[9px] font-black uppercase tracking-wider text-zinc-600">
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};