import { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { MockAdminGateway } from '../../infrastructure/mock.gateway';
import { AdminUserSummary } from '../../domain/entities';
import { showError, showSuccess } from '@/utils/toast';
import { Shield, ShieldAlert, MoreHorizontal, UserX, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const gateway = new MockAdminGateway();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await gateway.fetchUsers();
      setUsers(data);
    } catch (err) {
      showError("Erro ao carregar operadores.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: AdminUserSummary['status']) => {
    if (!confirm(`Alterar status para ${newStatus}?`)) return;
    try {
      await gateway.updateUserStatus(id, newStatus);
      showSuccess(`Usuário atualizado para ${newStatus}.`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      showError("Erro ao atualizar.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Operator Grid</h1>
            <p className="text-xs text-zinc-500 font-mono">GESTÃO DE ACESSOS E RISCO</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-[#121212] rounded-xl border border-white/5 animate-pulse" />)
          ) : users.map(user => (
            <div key={user.id} className="bg-[#121212] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all group relative overflow-hidden">
              {/* Status Stripe */}
              <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
                user.status === 'ACTIVE' ? "bg-emerald-500" : 
                user.status === 'FLAGGED' ? "bg-amber-500" : "bg-red-500"
              )} />

              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border",
                    user.riskLevel === 'HIGH' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                    user.riskLevel === 'MEDIUM' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                    "bg-zinc-800 border-white/5 text-zinc-400"
                  )}>
                    {user.riskLevel === 'HIGH' ? <ShieldAlert size={20} /> : <Shield size={20} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{user.name}</h3>
                    <p className="text-[10px] font-mono text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <div className="relative group/actions">
                   <button className="text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                   <div className="absolute right-0 top-full mt-2 w-32 bg-[#0A0A0A] border border-white/10 rounded-lg shadow-xl py-1 hidden group-hover/actions:block z-20">
                      {user.status !== 'SUSPENDED' && (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                          className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-white/5 flex items-center gap-2"
                        >
                          <UserX size={12} /> BLOQUEAR
                        </button>
                      )}
                      {user.status === 'SUSPENDED' && (
                        <button 
                          onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                          className="w-full text-left px-3 py-2 text-[10px] font-bold text-emerald-500 hover:bg-white/5 flex items-center gap-2"
                        >
                          <UserCheck size={12} /> ATIVAR
                        </button>
                      )}
                   </div>
                </div>
              </div>

              <div className="pl-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 rounded p-2 border border-white/5">
                    <span className="text-[9px] font-black text-zinc-600 uppercase block">Saldo (USDT)</span>
                    <span className="text-sm font-mono font-bold text-white">${user.balanceUsdt.toFixed(2)}</span>
                  </div>
                  <div className="bg-black/20 rounded p-2 border border-white/5">
                    <span className="text-[9px] font-black text-zinc-600 uppercase block">VaultCoins</span>
                    <span className="text-sm font-mono font-bold text-emerald-500">{user.balanceVaultCoins}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600 pt-2 border-t border-white/5">
                  <span>IP: {user.lastIp}</span>
                  <span>Joined: {new Date(user.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;