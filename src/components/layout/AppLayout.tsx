"use client";

import React from 'react';
import { LayoutDashboard, Package, Gamepad2, Wallet, History, Users, ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useStore } from '../../_infrastructure/state/store';

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all cursor-pointer group ${active ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:bg-white/10 hover:text-white'}`}
  >
    <Icon size={18} strokeWidth={active ? 3 : 2} className={active ? '' : 'group-hover:text-emerald-400'} />
    <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </div>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, engagementTokens } = useStore();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30">
      <aside className="w-72 border-r border-white/10 flex flex-col p-8 sticky top-0 h-screen bg-[#0d0d0f]">
        <div 
          className="mb-12 flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center transition-transform group-hover:rotate-12">
            <Package className="text-black" size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
            Vault<span className="text-emerald-500">Net</span>
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <div className="text-[10px] font-black text-zinc-500 uppercase mb-4 px-4 tracking-[0.2em]">Plataforma</div>
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
            icon={Users} 
            label="Rede de Parceiros" 
            active={location.pathname === '/partners'}
            onClick={() => navigate('/partners')}
          />
          
          <div className="text-[10px] font-black text-zinc-500 uppercase mt-8 mb-4 px-4 tracking-[0.2em]">Sincronia</div>
          <NavItem icon={Wallet} label="Ativos Digitais" />
          <NavItem icon={History} label="Log de Operações" />
        </nav>

        <div className="mt-auto pt-8 flex flex-col gap-4">
           <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tokens</span>
                <span className="text-emerald-400 font-mono font-bold text-xs">{engagementTokens.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${Math.min((engagementTokens / 10000) * 100, 100)}%` }}
                />
              </div>
           </div>
           <MadeWithDyad />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto bg-[#09090b]">
        <header className="h-24 px-12 flex justify-between items-center border-b border-white/10 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex-1" />
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Saldo em Carteira</span>
               <span className="font-mono text-2xl font-black text-white tracking-tighter tabular-nums">${balance.toFixed(2)}</span>
            </div>
            <button className="h-12 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 hover:bg-emerald-500/20 transition-colors">
               <span className="text-xs font-bold text-emerald-400">DEPOSITAR</span>
               <ArrowUpRight size={18} className="text-emerald-400" />
            </button>
          </div>
        </header>
        
        <div className="p-12 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;