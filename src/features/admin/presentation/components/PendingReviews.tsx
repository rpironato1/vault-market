import { PendingAction } from '../../domain/entities';
import { Check, X, Search } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface Props {
  actions: PendingAction[];
}

export const PendingReviews = ({ actions }: Props) => {
  const handleApprove = (id: string) => {
    showSuccess(`Ação ${id} aprovada.`);
  };

  const handleReject = (id: string) => {
    showSuccess(`Ação ${id} rejeitada.`);
  };

  return (
    <div className="bg-surface-card border border-white/5 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-surface-card">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Fila de Análise</h3>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-mono text-zinc-500">{actions.length} PENDENTES</span>
           <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white">
             <Search size={14} />
           </button>
        </div>
      </div>
      
      <div className="divide-y divide-white/5 overflow-y-auto max-h-[400px]">
        {actions.map(action => (
          <div key={action.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-start gap-4">
              <div className={cn(
                "mt-1 h-8 w-8 rounded flex items-center justify-center border font-bold text-[10px]",
                action.riskScore === 'CRITICAL' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                action.riskScore === 'HIGH' ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
              )}>
                {action.riskScore === 'CRITICAL' ? 'CRT' : action.riskScore === 'HIGH' ? 'HGH' : 'MED'}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{action.type.replace(/_/g, ' ')}</span>
                  <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-1.5 rounded">ID: {action.id.split('-')[1]}</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {action.details}
                </p>
                <div className="mt-1 flex items-center gap-2">
                   <span className="text-[10px] text-zinc-500">Solicitante:</span>
                   <span className="text-[10px] text-zinc-300 font-bold hover:underline cursor-pointer">{action.user}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleApprove(action.id)}
                className="h-8 px-3 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Check size={12} /> Aprovar
              </button>
              <button 
                onClick={() => handleReject(action.id)}
                className="h-8 w-8 flex items-center justify-center rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all"
                title="Rejeitar"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {actions.length === 0 && (
           <div className="p-8 text-center">
              <p className="text-xs text-zinc-600 font-mono">Nenhuma pendência na fila.</p>
           </div>
        )}
      </div>
    </div>
  );
};