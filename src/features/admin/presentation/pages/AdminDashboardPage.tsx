import { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminStatsView } from '../components/AdminStats';
import { PendingReviews } from '../components/PendingReviews';
import { MockAdminGateway } from '../../infrastructure/mock.gateway';
import { AdminDashboardData } from '../../domain/entities';
import { showError } from '@/utils/toast';
import { BellRing, Terminal, Activity } from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gateway = new MockAdminGateway();
        const result = await gateway.fetchDashboardData();
        setData(result);
      } catch (error) {
        showError('Falha ao carregar painel administrativo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Banner de Alerta Crítico */}
        {data?.recentAlerts.some(a => a.severity === 'CRITICAL') && (
          <div className="bg-danger-neon/10 border border-danger-neon/20 rounded-lg p-4 flex items-center justify-between text-danger-neon shadow-glow-danger">
            <div className="flex items-center gap-3">
              <BellRing size={20} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Atenção Necessária</span>
              <span className="w-px h-4 bg-danger-neon/20" />
              <span className="text-sm font-mono font-bold text-white">
                {data.recentAlerts.find(a => a.severity === 'CRITICAL')?.message}
              </span>
            </div>
            <button className="text-[10px] font-bold uppercase underline decoration-1 underline-offset-4 hover:text-white">Ver Detalhes</button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-4 gap-4 h-32">
             {[1,2,3,4].map(i => <div key={i} className="bg-surface-card border border-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : data ? (
          <>
            {/* KPI Stats */}
            <AdminStatsView stats={data.stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
              {/* Coluna Principal - Fila */}
              <div className="lg:col-span-2 h-full">
                <PendingReviews actions={data.pendingActions} />
              </div>
              
              {/* Coluna Secundária - Terminal de Segurança */}
              <div className="bg-surface-card border border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-surface-black">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Log</span>
                  </div>
                  <Activity size={14} className="text-emerald-500 animate-pulse" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[10px] bg-black">
                  {data.recentAlerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 hover:bg-white/5 p-2 rounded transition-colors group border-l-2 border-transparent hover:border-white/20">
                      <span className="text-zinc-600 shrink-0 select-none">
                        [{new Date(alert.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]
                      </span>
                      <div className="flex flex-col">
                        <span className={`font-bold ${alert.severity === 'CRITICAL' ? 'text-danger-neon' : 'text-yellow-500'}`}>
                          {alert.severity === 'CRITICAL' ? '[CRITICAL_ERR]' : '[WARN_FLAG]'}
                        </span>
                        <span className="text-zinc-300 group-hover:text-white transition-colors">{alert.message}</span>
                      </div>
                    </div>
                  ))}
                  {/* Fake logs para preencher espaço visual */}
                  {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex gap-3 p-2 opacity-40">
                      <span className="text-zinc-600 shrink-0">
                        [{new Date(Date.now() - (i+1)*60000).toLocaleTimeString([], {hour12: false})}]
                      </span>
                      <div className="flex flex-col">
                        <span className="text-emerald-500 font-bold">[SYSTEM_INFO]</span>
                        <span className="text-zinc-400">Routine heartbeat check passed. Node sync nominal.</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-white/5 bg-surface-black">
                   <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded border border-white/5">
                      <span className="text-emerald-500 animate-pulse">_</span>
                      <input className="bg-transparent border-none outline-none text-xs font-mono text-zinc-400 w-full placeholder:text-zinc-700" placeholder="Type command..." disabled />
                   </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;