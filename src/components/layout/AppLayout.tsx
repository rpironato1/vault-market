"use client";

import React from 'react';
import { LayoutDashboard, Package, Gamepad2, Wallet, Users, ShieldCheck, ShoppingBag, type LucideIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useStore } from '@infra/state/store';

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: LucideIcon, label: string, active?: boolean, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all cursor-pointer group ${active ? 'bg-surface-card text-white border border-white/5 shadow-xl' : 'text-zinc-500 hover:text-white'}`}
  >
    <Icon size={20} strokeWidth={active ? 3 : 2} className={active ? 'text-accent-emerald' : 'group-hover:text-accent-emerald'} />
    <span className={`text-sm tracking-tight ${active ? 'font-black uppercase' : 'font-bold'}`}>{label}</span>
  </div>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, engagementTokens } = useStore();

  return (
    <div className="flex min-h-screen bg-surface-black text-zinc-100 font-sans selection:bg-accent-emerald/30 selection:text-white overflow-hidden">
      <aside className="w-80 border-r border-white/5 flex flex-col p-10 sticky top-0 h-screen bg-surface-black">
        <div
          className="mb-16 flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="h-12 w-12 rounded-2xl bg-accent-emerald flex items-center justify-center transition-all group-hover:shadow-glow-emerald">
            <ShieldCheck className="text-black" size={28} strokeWidth={3} />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase italic text-white">
            Vault<span className="text-accent-emerald">Net</span>
          </span>
        </div>

        <nav className="flex flex-col gap-3 flex-1">
          <div className="text-[10px] font-black text-zinc-600 uppercase mb-4 px-5 tracking-[0.3em]">Operações</div>
          <NavItem 
            icon={LayoutDashboard} 
            label="Marketplace" 
            active={location.pathname === '/marketplace'} 
            onClick={() => navigate('/marketplace')}
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
          
          <div className="text-[10px] font-black text-zinc-600 uppercase mt-12 mb-4 px-5 tracking-[0.3em]">Rede</div>
          <NavItem icon={Users} label="Afiliados VIP" onClick={() => navigate('/partners')} active={location.pathname === '/partners'} />
          <NavItem icon={Wallet} label="Sincronia" onClick={() => navigate('/tokens')} active={location.pathname === '/tokens'} />
        </nav>

        <div className="mt-auto pt-10 flex flex-col gap-6">
           <div className="rounded-3xl bg-surface-card p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-20 w-20 bg-prestige-gold/5 blur-3xl rounded-full" />
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nível VIP 02</span>
                <span className="text-prestige-gold font-mono font-bold text-xs">{engagementTokens} TK</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-prestige-gold shadow-glow-gold transition-all duration-1000"
                  style={{ width: `${Math.min((engagementTokens / 10000) * 100, 100)}%` }}
                />
              </div>
           </div>
           <MadeWithDyad />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto bg-surface-black">
        <header className="h-28 px-16 flex justify-between items-center border-b border-white/5 bg-surface-black/80 backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-10">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Rede Ativa</span>
                <span className="text-accent-emerald font-mono text-xs font-bold uppercase">Mainnet v2.4</span>
             </div>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Ping</span>
                <span className="text-white font-mono text-xs font-bold">14ms</span>
             </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Disponível p/ Saque</span>
               <span className="font-mono text-3xl font-black text-accent-emerald tracking-tighter tabular-nums">${balance.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="h-14 px-8 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center gap-3 hover:bg-accent-emerald/20 transition-all group"
            >
               <span className="text-xs font-black text-accent-emerald tracking-widest uppercase">Adquirir Ativos</span>
               <ShoppingBag size={20} className="text-accent-emerald group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>
        
        <div className="p-16 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;