import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { RewardStats } from '../components/RewardStats';
import { RewardsLedger } from '../components/RewardsLedger';
import { MockRewardsGateway } from '../../infrastructure/mock.gateway';
import { RewardsData } from '../../domain/entities';
import { showError } from '@/utils/toast';
import { Info } from 'lucide-react';

const RewardsPage = () => {
  const [data, setData] = useState<RewardsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gateway = new MockRewardsGateway();
        const result = await gateway.fetchRewardsData();
        setData(result);
      } catch (error) {
        showError('Erro ao carregar dados de recompensas.');
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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Meus Prêmios (USDT)</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-[#FFD700]/5 border border-[#FFD700]/10 p-3 rounded-lg w-fit">
            <Info size={14} className="text-[#FFD700]" />
            <p>
              Prêmios obtidos em experiências podem passar por um período de validação (Locked) antes de ficarem disponíveis para saque.
            </p>
          </div>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : data ? (
          <RewardStats balance={data.balance} />
        ) : null}

        {/* Ledger */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Histórico de Ganhos</h2>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <RewardsLedger transactions={data.transactions} />
          ) : null}
        </section>

      </div>
    </AppLayout>
  );
};

export default RewardsPage;