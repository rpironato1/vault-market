"use client";

import React from 'react';
import { LayoutDashboard, Package, Gamepad2, Wallet, History, Settings, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useUserStore } from '../../_infrastructure/state/useUserStore';

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer ${active ? 'bg-emerald-500/10 text-emerald-500' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
  >
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, tokens } = useUserStore();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-foreground font-sans selection:bg-emerald-500/30">
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div 
          className="mb-10 flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Package className="text-black" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter">VAULT<span className="text-emerald-500">MARKET</span></span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2 px-3 tracking-widest">Plataforma</div>
          <NavItem 
            icon={LayoutDashboard} 
            label="Marketplace" 
            active={location.pathname === '/'} 
            onClick={() => navigate('/')}
          />
          <NavItem 
            icon={Package} 
            label="Meu Vault" 
            active={location.pathname === '/vault'}
            onClick={() => navigate('/vault')}
          />
          <NavItem 
            icon={Gamepad2} 
            label="Experiências" 
            active={location.pathname === '/games'}
            onClick={() => navigate('/games')}
          />
          <NavItem 
            icon={Share2} 
            label="Parceiros" 
            active={location.pathname === '/partners'}
            onClick={() => navigate('/partners')}
          />
          
          <div className="text-[10px] font-bold text-muted-foreground uppercase mt-6 mb-2 px-3 tracking-widest">Financeiro</div>
          <NavItem icon={Wallet} label="Carteira Crypto" />
          <NavItem icon={History} label="Transações" />
          <NavItem icon={Settings} label="Configurações" />
        </nav>

        <div className="mt-auto border-t border-white/5 pt-6">
          <div className="rounded-xl bg-white/5 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Tokens</span>
              <span className="text-emerald-400 font-mono text-xs">{tokens.toLocaleString()} TK</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${Math.min((tokens / 10000) * 100, 100)}%` }}
              />
            </div>
          </div>
          <MadeWithDyad />
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex-1" />
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Saldo Disponível</span>
              <span className="font-mono text-lg font-bold text-white">${balance.toFixed(2)}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700" />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;