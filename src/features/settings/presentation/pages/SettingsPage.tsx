import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ProfileSection } from '../components/ProfileSection';
import { WalletManager } from '../components/WalletManager';
import { MockSettingsGateway } from '../../infrastructure/mock.gateway';
import { SettingsData } from '../../domain/entities';
import { showError } from '@/utils/toast';

const SettingsPage = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const gateway = new MockSettingsGateway();
      const result = await gateway.fetchSettings();
      setData(result);
    } catch (error) {
      showError('Erro ao carregar configurações.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Configurações</h1>
          <p className="text-zinc-400 text-sm">Gerencie sua conta e métodos de recebimento.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
          </div>
        ) : data ? (
          <>
            <ProfileSection profile={data.profile} />
            <WalletManager wallets={data.wallets} onUpdate={loadData} />
          </>
        ) : null}

      </div>
    </AppLayout>
  );
};

export default SettingsPage;