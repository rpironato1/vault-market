import { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { MockAdminGateway } from '../../infrastructure/mock.gateway';
import { AdminWithdrawalRequest } from '../../domain/entities';
import { showError, showSuccess } from '@/utils/toast';
import { Check, X, Search, Filter, Wallet, AlertOctagon, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status }: { status: AdminWithdrawalRequest['status'] }) => {
  const styles = {
    'PENDING': "bg-amber-500/10 text-amber-500 border-amber-500/20",
    'APPROVED': "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    'REJECTED': "bg-red-500/10 text-red-500 border-red-500/20",
    'MANUAL_REVIEW': "bg-purple-500/10 text-purple-500 border-purple-500/20"
  };
  return (
    <span className={cn("px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border", styles[status])}>
      {status.replace('_', ' ')}
    </span>
  );
};

const RiskBadge = ({ score }: { score: number }) => {
  let color = "text-emerald-500";
  if (score > 50) color = "text-amber-500";
  if (score > 80) color = "text-red-500";
  
  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className={cn("font-bold", color)}>{score}/100</span>
      <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className={cn("h-full", color.replace('text-', 'bg-'))} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

const AdminWithdrawalsPage = () => {
  const [requests, setRequests] = useState<AdminWithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const gateway = new MockAdminGateway();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await gateway.fetchWithdrawals();
      setRequests(data);
    } catch (err) {
      showError("Falha ao carregar saques.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!confirm(`Confirmar ação: ${action}?`)) return;
    
    setProcessingId(id);
    try {
      await gateway.processWithdrawal(id, action);
      showSuccess(`Solicitação ${action === 'APPROVE' ? 'aprovada' : 'rejeitada'}.`);
      // Otimistic update
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : r));
    } catch (err) {
      showError("Erro ao processar.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Treasury Operations</h1>
            <p className="text-xs text-zinc-500 font-mono">GERENCIAMENTO DE LIQUIDEZ E SAQUES</p>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold text-zinc-400 transition-colors">
               <Filter size={14} /> Filtros
             </button>
             <button className="flex items-center gap-2 px-3 py-2 bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/20 rounded-lg text-xs font-bold transition-colors">
               <Wallet size={14} /> Treasury Balance
             </button>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3 bg-[#0A0A0A]">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                placeholder="Buscar por ID, Email ou Hash..." 
                className="w-full bg-[#181818] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white font-mono placeholder:text-zinc-700 outline-none focus:border-white/10"
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#0F0F0F] border-b border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            <div className="col-span-2">Data / ID</div>
            <div className="col-span-3">Operador</div>
            <div className="col-span-2 text-right">Valor (USDT)</div>
            <div className="col-span-2">Risco</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-zinc-500 animate-pulse font-mono">CARREGANDO DADOS DO LEDGER...</div>
            ) : requests.map(req => (
              <div key={req.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">
                
                <div className="col-span-2">
                  <div className="text-xs font-mono text-zinc-300">{new Date(req.createdAt).toLocaleDateString()}</div>
                  <div className="text-[10px] font-mono text-zinc-600">{new Date(req.createdAt).toLocaleTimeString()}</div>
                  <div className="text-[9px] font-mono text-zinc-700 mt-1">{req.id}</div>
                </div>

                <div className="col-span-3 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{req.userEmail}</div>
                  <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-600 mt-1 truncate group-hover:text-zinc-400 transition-colors">
                    {req.walletAddress}
                    <ExternalLink size={8} className="cursor-pointer hover:text-[#00FF9C]" />
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <div className="text-sm font-mono font-bold text-[#FFD700]">${req.amount.toFixed(2)}</div>
                  <div className="text-[9px] font-mono text-zinc-600">Polygon (USDT)</div>
                </div>

                <div className="col-span-2">
                  <RiskBadge score={req.riskScore} />
                  {req.riskScore > 80 && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-red-500 mt-1">
                      <AlertOctagon size={10} /> INVESTIGAR
                    </div>
                  )}
                </div>

                <div className="col-span-2 text-center">
                  <StatusBadge status={req.status} />
                </div>

                <div className="col-span-1 flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {req.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleProcess(req.id, 'APPROVE')}
                        disabled={!!processingId}
                        className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Autorizar"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => handleProcess(req.id, 'REJECT')}
                        disabled={!!processingId}
                        className="p-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
                        title="Rejeitar"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWithdrawalsPage;