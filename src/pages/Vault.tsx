"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import VaultItemCard from '@/features/vault/components/VaultItemCard';
import { useStore } from '../_infrastructure/state/store';
import { Package, MagnifyingGlass, Funnel } from '@phosphor-icons/react';

const Vault = () => {
  const { vaultItems } = useStore();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <Package weight="duotone" className="text-emerald-500 h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">Meu Vault</h1>
              <p className="text-sm text-muted-foreground font-medium">Gerenciamento de ativos e unidades criptografadas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" size={16} />
              <input 
                placeholder="Filtrar coleção..." 
                className="h-11 w-64 rounded-xl bg-white/[0.03] border border-white/5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <button className="h-11 px-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 hover:bg-white/10 transition-colors border-dashed">
              <Funnel size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
            </button>
          </div>
        </header>

        <section className="min-h-[400px]">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
              Itens Sincronizados
              <span className="h-5 px-2 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">
                {vaultItems.length}
              </span>
            </h2>
          </div>
          
          {vaultItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <Package weight="thin" className="text-white/10 h-16 w-16 mb-6" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">O Vault está vazio</p>
              <button className="mt-4 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] hover:underline">
                Adquirir Unidades no Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {vaultItems.map((item) => (
                <VaultItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default Vault;