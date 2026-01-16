import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { WithdrawalForm } from '../components/WithdrawalForm';
import { WithdrawalHistory } from '../components/WithdrawalHistory';
import { MockWithdrawalsGateway } from '../../infrastructure/mock.gateway';
import { WithdrawalData } from '../../domain/entities';
import { showError } from '@/utils/toast';

const WithdrawalPage = () => {
  const [data, setData] = useState<WithdrawalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const gateway = new MockWithdrawalsGateway();
      const result = await gateway.fetchWithdrawalData();
      setData(result);
    } catch (error) {
      showError('Erro ao carregar dados de saque.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Saque de Recompensas</h1>
          <p className="text-zinc-400 text-sm">Transfira seus ganhos em USDT diretamente para sua carteira Polygon.</p>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        ) : data ? (
          <>
            <WithdrawalForm data={data} onSuccess={loadData} />
            <WithdrawalHistory requests={data.history} />
          </>
        ) : null}

      </div>
    </AppLayout>
  );
};

export default WithdrawalPage;