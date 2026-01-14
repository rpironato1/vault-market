"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useStore } from '../_infrastructure/state/store';
import VaultItemCard from '../features/vault/components/VaultItemCard';
import { HardDrive, MagnifyingGlass, Funnel } from '@phosphor-icons/react';

const Vault = () => {
  const { vaultItems } = useStore();

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <HardDrive className="text-[#00FF9C]" weight="fill" size={24} />
               <span className="text-[10px] font-black text-[#00FF9C] uppercase tracking-[0.4em]">Secure Custody Protocol</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Meu Vault</h1>
            <p className="text-zinc-500 font-medium max-w-md">
              Gerencie seus ativos validados e prepare-os para sincronização de liquidez externa.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                placeholder="PROCURAR HASH..."
                className="bg-[#121212] border border-white/10 rounded-2xl h-14 pl-12 pr-6 font-mono text-xs font-bold focus:border-[#00FF9C]/50 outline-none w-64 transition-all"
              />
            </div>
            <button className="h-14 w-14 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              <Funnel size={20} />
            </button>
          </div>
        </header>

        {vaultItems.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-30">
            <HardDrive size={80} weight="thin" className="mb-6" />
            <p className="font-mono text-sm uppercase tracking-[0.3em]">Nenhum ativo detectado no setor de custódia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {vaultItems.map((item) => (
              <VaultItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Vault;