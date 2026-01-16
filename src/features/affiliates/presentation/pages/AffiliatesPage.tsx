import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { AffiliateStatsCards } from '../components/AffiliateStatsCards';
import { ReferralLink } from '../components/ReferralLink';
import { ReferralsList } from '../components/ReferralsList';
import { MockAffiliatesGateway } from '../../infrastructure/mock.gateway';
import { AffiliateData } from '../../domain/entities';
import { showError } from '@/utils/toast';

const AffiliatesPage = () => {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const gateway = new MockAffiliatesGateway();
        const result = await gateway.fetchAffiliateData();
        setData(result);
      } catch (error) {
        showError('Erro ao carregar dados de afiliado.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Programa de Afiliados</h1>
          <p className="text-zinc-400 text-sm">Convide novos operadores e expanda a rede VaultNet.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 h-32">
               {[1, 2, 3, 4].map(i => <div key={i} className="bg-white/5 rounded-2xl animate-pulse" />)}
            </div>
            <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          </div>
        ) : data ? (
          <>
            <AffiliateStatsCards stats={data.stats} />
            <ReferralLink link={data.referralLink} code={data.referralCode} />
            <ReferralsList referrals={data.recentReferrals} />
          </>
        ) : null}

      </div>
    </AppLayout>
  );
};

export default AffiliatesPage;