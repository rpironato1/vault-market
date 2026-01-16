import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminStatsView } from '../components/AdminStats';
import { PendingReviews } from '../components/PendingReviews';
import { MockAdminGateway } from '../../infrastructure/mock.gateway';
import { AdminDashboardData } from '../../domain/entities';
import { showError } from '@/utils/toast';
import { BellRing } from 'lucide-react';

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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Alerts Banner */}
        {data?.recentAlerts.some(a => a.severity === 'CRITICAL') && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 mb-6">
            <BellRing size={20} className="animate-pulse" />
            <span className="text-sm font-bold">ALERTA CRÍTICO: {data.recentAlerts.find(a => a.severity === 'CRITICAL')?.message}</span>
          </div>
        )}

        {isLoading ? (
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        ) : data ? (
          <>
            <AdminStatsView stats={data.stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PendingReviews actions={data.pendingActions} />
              </div>
              
              <div className="bg-[#121212] border border-white/5 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Feed de Segurança</h3>
                <div className="space-y-4">
                  {data.recentAlerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 text-xs">
                      <div className={`w-1 h-full min-h-[24px] rounded-full ${alert.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-zinc-300">{alert.message}</p>
                        <p className="text-zinc-600 font-mono mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
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