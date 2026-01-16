import { PendingAction } from '../../domain/entities';
import { Check, X, AlertTriangle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface Props {
  actions: PendingAction[];
}

export const PendingReviews = ({ actions }: Props) => {
  const handleApprove = (id: string) => {
    // Em prod, chamaria gateway
    showSuccess(`Ação ${id} aprovada.`);
  };

  const handleReject = (id: string) => {
    // Em prod, abriria modal de motivo
    showSuccess(`Ação ${id} rejeitada.`);
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Fila de Revisão</h3>
        <span className="text-xs text-zinc-500">{actions.length} pendentes</span>
      </div>
      
      <div className="divide-y divide-white/5">
        {actions.map(action => (
          <div key={action.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center border",
                action.riskScore === 'CRITICAL' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                action.riskScore === 'HIGH' ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
              )}>
                <AlertTriangle size={20} />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{action.type.replace('_', ' ')}</span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded font-black uppercase",
                    action.riskScore === 'CRITICAL' ? "bg-red-500 text-black" :
                    action.riskScore === 'HIGH' ? "bg-orange-500 text-black" :
                    "bg-yellow-500 text-black"
                  )}>
                    {action.riskScore}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {action.details} • <span className="text-zinc-500">{action.user}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleApprove(action.id)}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                title="Aprovar"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={() => handleReject(action.id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                title="Rejeitar"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};