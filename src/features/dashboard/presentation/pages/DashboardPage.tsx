import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { BalanceCards } from '../components/BalanceCards';
import { ActionShortcuts } from '../components/ActionShortcuts';
import { RecentActivity } from '../components/RecentActivity';
import { MockDashboardGateway } from '../../infrastructure/mock.gateway';
import { DashboardData } from '../../domain/entities';
import { showError } from '@/utils/toast';
import { ShieldCheck } from 'lucide-react';

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gateway = new MockDashboardGateway();
        const result = await gateway.fetchDashboardData();
        setData(result);
      } catch (error) {
        showError('Erro ao carregar dados do dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">Painel de Controle</h1>
            <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
              ID: <span className="text-white">OP-8821</span> • Status: <span className="text-emerald-500">Online</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
             <ShieldCheck size={12} className="text-emerald-500" />
             Conexão Segura
          </div>
        </div>

        {/* Balances */}
        <section>
          <BalanceCards balances={data ? data.balances : null} isLoading={isLoading} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Column */}
           <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Acesso Rápido</h2>
                </div>
                <ActionShortcuts />
              </section>

              <section>
                <RecentActivity activities={data?.recentActivity} isLoading={isLoading} />
              </section>
           </div>

           {/* Side Column (Placeholder para Stats/News) */}
           <div className="hidden lg:block space-y-6">
              <div className="rounded-2xl bg-[#0A0A0A] border border-white/5 p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center">
                 <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <span className="font-black text-zinc-500 text-lg">?</span>
                 </div>
                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Espaço para Widgets</p>
                 <p className="text-[10px] text-zinc-600 mt-2">Próximas atualizações: Gráfico de Rendimento</p>
              </div>
           </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default DashboardPage;