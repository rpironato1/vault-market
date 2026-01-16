"use client";

import AppLayout from '@/components/layout/AppLayout';
import { useStore } from '@infra/state/store';
import VaultItemCard from '@/features/vault/components/VaultItemCard';
import { HardDrive, MagnifyingGlass, Funnel } from '@phosphor-icons/react';

const Vault = () => {
  const { vaultItems } = useStore();

  return (
    <AppLayout>
      <div className="flex flex-col gap-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <HardDrive className="text-emerald-500" weight="fill" size={24} />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Secure Custody Protocol</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Custódia de Ativos</h1>
            <p className="text-zinc-500 font-medium max-w-md">
              Gerencie seus ativos digitais verificados e Gift Cards. Todos os itens possuem lastro garantido pela rede.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                placeholder="PROCURAR HASH..."
                className="bg-[#121212] border border-white/10 rounded-2xl h-14 pl-12 pr-6 font-mono text-xs font-bold focus:border-emerald-500/50 outline-none w-64 transition-all text-white placeholder:text-zinc-700"
              />
            </div>
            <button className="h-14 w-14 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              <Funnel size={20} />
            </button>
          </div>
        </header>

        {vaultItems.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-50 border-2 border-dashed border-white/5 rounded-3xl">
            <HardDrive size={80} weight="thin" className="mb-6 text-zinc-700" />
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-500">Nenhum ativo detectado no setor de custódia.</p>
            <p className="text-xs text-zinc-600 mt-2">Visite o Marketplace para iniciar aquisições.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {vaultItems.map((item, idx) => (
              <VaultItemCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Vault;