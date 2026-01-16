import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { BalanceCards } from '../components/BalanceCards';
import { ActionShortcuts } from '../components/ActionShortcuts';
import { RecentActivity } from '../components/RecentActivity';
import { MockDashboardGateway } from '../../infrastructure/mock.gateway';
import { DashboardData } from '../../domain/entities';
import { showError } from '@/utils/toast';

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
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Visão Geral</h1>
          <p className="text-zinc-400 text-sm font-medium">Bem-vindo de volta, Operador.</p>
        </div>

        {/* Balances */}
        <section>
          <BalanceCards balances={data ? data.balances : null} isLoading={isLoading} />
        </section>

        {/* Shortcuts */}
        <section>
          <ActionShortcuts />
        </section>

        {/* Activity */}
        <section>
          <RecentActivity activities={data?.recentActivity} isLoading={isLoading} />
        </section>

      </div>
    </AppLayout>
  );
};

export default DashboardPage;