import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Users, Wallet, AlertTriangle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ icon: Icon, label, path, active }: any) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-bold transition-all",
        active 
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
          : "text-zinc-500 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  );
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#09090b]">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className="font-black text-white text-sm uppercase tracking-wider">Risk Ops</h1>
            <p className="text-[10px] text-zinc-500 font-mono">ADMIN CONSOLE</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            icon={LayoutDashboard} 
            label="Visão Geral" 
            path="/admin" 
            active={location.pathname === '/admin'} 
          />
          <NavItem 
            icon={Wallet} 
            label="Saques & Financeiro" 
            path="/admin/withdrawals" 
            active={location.pathname === '/admin/withdrawals'} 
          />
          <NavItem 
            icon={Users} 
            label="Usuários & Afiliados" 
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

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-bold text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} /> Sair do Console
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-white/5 bg-[#09090b]/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-500">SYSTEM STATUS: NOMINAL</span>
          </div>
          <div className="text-xs font-bold text-zinc-400">
            Admin: <span className="text-white">Neo Anderson</span>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};