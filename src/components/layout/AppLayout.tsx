"use client";

import React from 'react';
import { LayoutDashboard, Package, Gamepad2, Wallet, History, Settings } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-foreground font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Package className="text-black" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter">VAULT<span className="text-emerald-500">MARKET</span></span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2 px-3 tracking-widest">Plataforma</div>
          <NavItem icon={LayoutDashboard} label="Marketplace" active />
          <NavItem icon={Package} label="Meu Inventário" />
          <NavItem icon={Gamepad2} label="Central de Tokens" />
          
          <div className="text-[10px] font-bold text-muted-foreground uppercase mt-6 mb-2 px-3 tracking-widest">Financeiro</div>
          <NavItem icon={Wallet} label="Carteira Crypto" />
          <NavItem icon={History} label="Transações" />
          <NavItem icon={Settings} label="Configurações" />
        </nav>

        <div className="mt-auto border-t border-white/5 pt-6">
          <div className="rounded-xl bg-white/5 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Tokens</span>
              <span className="text-emerald-400 font-mono text-xs">8,420 TK</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
            </div>
          </div>
          <MadeWithDyad />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Unidades de colecionáveis verificadas e seguras.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Saldo Disponível</span>
              <span className="font-mono text-lg font-bold text-white">$1,245.80</span>
            </div>
            <div className="h-10 w-10 rounded-full border border-white/10 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20" />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;