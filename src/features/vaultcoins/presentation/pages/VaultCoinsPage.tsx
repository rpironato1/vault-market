import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { BalanceHeader } from '../components/BalanceHeader';
import { TransactionHistory } from '../components/TransactionHistory';
import { MockVaultCoinsGateway } from '../../infrastructure/mock.gateway';
import { VaultCoinsData } from '../../domain/entities';
import { showError } from '@/utils/toast';
import { Info } from 'lucide-react';

const VaultCoinsPage = () => {
  const [data, setData] = useState<VaultCoinsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gateway = new MockVaultCoinsGateway();
        const result = await gateway.fetchWalletData();
        setData(result);
      } catch (error) {
        showError('Erro ao carregar dados da carteira.');
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
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Carteira VaultCoins</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg w-fit">
            <Info size={14} className="text-blue-400" />
            <p>VaultCoins são obtidas através da compra de NFTs e recompensas. <span className="text-blue-400 font-bold">Não é possível comprá-las diretamente.</span></p>
          </div>
        </div>

        {/* Balance */}
        {isLoading ? (
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        ) : data ? (
          <BalanceHeader balance={data.balance} />
        ) : null}

        {/* History */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Extrato de Movimentações</h2>
            {/* Filtros básicos poderiam entrar aqui */}
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <TransactionHistory transactions={data.transactions} />
          ) : null}
        </section>

      </div>
    </AppLayout>
  );
};

export default VaultCoinsPage;