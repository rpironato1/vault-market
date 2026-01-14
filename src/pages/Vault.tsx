"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import InventoryGrid from '../features/vault/components/InventoryGrid';
import { useUserStore } from '../_infrastructure/state/useUserStore';
import { Package, Search, Filter } from 'lucide-react';

const Vault = () => {
  const { inventory } = useUserStore();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <Package className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Meu Vault</h1>
              <p className="text-muted-foreground">Gerencie sua coleção de ativos e unidades digitais.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                placeholder="Filtrar coleção..." 
                className="h-10 w-64 rounded-lg bg-white/5 border border-white/10 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <button className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-colors">
              <Filter size={16} />
              <span className="text-sm font-medium">Filtros</span>
            </button>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Itens Verificados
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{inventory.length}</span>
            </h2>
          </div>
          <InventoryGrid items={inventory} />
        </section>
      </div>
    </AppLayout>
  );
};

export default Vault;