import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Users, Wallet, AlertTriangle, LogOut, Activity, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
}

const NavItem = ({ icon: Icon, label, path, active }: NavItemProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs font-bold transition-all border border-transparent",
        active 
          ? "bg-[#00FF9C]/10 text-[#00FF9C] border-[#00FF9C]/20 shadow-[0_0_15px_rgba(0,255,156,0.1)]" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 hover:border-white/5"
      )}
    >
      <Icon size={16} />
      <span className="uppercase tracking-wider">{label}</span>
    </button>
  );
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#FF0055]/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#050505] fixed h-full z-30">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-[#FF0055]/10 flex items-center justify-center text-[#FF0055] border border-[#FF0055]/20 shadow-[0_0_20px_rgba(255,0,85,0.2)]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="font-black text-white text-sm uppercase tracking-tighter">VaultNet</h1>
              <p className="text-[10px] text-[#FF0055] font-black uppercase tracking-[0.2em]">Risk Ops</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Monitoramento</div>
          <NavItem 
            icon={LayoutDashboard} 
            label="Visão Geral" 
            path="/admin" 
            active={location.pathname === '/admin'} 
          />
          <NavItem 
            icon={Activity} 
            label="Live Feed" 
            path="/admin/live" 
            active={location.pathname === '/admin/live'} 
          />
          
          <div className="px-4 py-2 mt-6 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Gestão</div>
          <NavItem 
            icon={Wallet} 
            label="Saques & Treasury" 
            path="/admin/withdrawals" 
            active={location.pathname === '/admin/withdrawals'} 
          />
          <NavItem 
            icon={Users} 
            label="Operadores" 
            path="/admin/users" 
            active={location.pathname === '/admin/users'} 
          />
          <NavItem 
            icon={AlertTriangle} 
            label="Alertas de Risco" 
            path="/admin/risk" 
            active={location.pathname === '/admin/risk'} 
          />
        </nav>

        <div className="p-4 border-t border-white/5 bg-[#09090b]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-black/40 border border-white/5">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
             <span className="text-[10px] font-mono text-zinc-400">SYSTEM: <span className="text-emerald-500">NOMINAL</span></span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs font-bold text-zinc-500 hover:text-[#FF0055] hover:bg-[#FF0055]/10 transition-colors uppercase tracking-wider"
          >
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen">
        <header className="h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-600">Session ID: <span className="text-zinc-300">ADMIN-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Operador Logado</p>
              <p className="text-xs font-bold text-white">Neo Anderson</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10" />
          </div>
        </header>
        <div className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};