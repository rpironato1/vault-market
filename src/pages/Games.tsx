"use client";

import AppLayout from '@/components/layout/AppLayout';
import { DataSyncGame, DailyPulse, QuantumCrash, GravityPlinko } from '@/features/games';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Radio, Rocket, Database, Info } from 'lucide-react';

const Games = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12 max-w-7xl mx-auto">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Tactical Operations Center</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Experiências de Rede</h1>
          <p className="text-zinc-500 text-lg font-medium max-w-2xl leading-relaxed">
            Utilize suas VaultCoins para validar pacotes de dados e sincronizar ciclos orbitais. 
            Desempenho bem-sucedido gera recompensas em USDT.
          </p>
          
          <div className="flex items-center gap-2 text-xs text-zinc-600 bg-white/5 p-3 rounded-lg w-fit border border-white/5">
            <Info size={14} />
            <span>Nenhuma moeda fiduciária é utilizada diretamente nestas operações.</span>
          </div>
        </header>

        <Tabs defaultValue="mines" className="w-full">
          <TabsList className="bg-surface-card border border-white/5 p-2 rounded-[24px] mb-12 inline-flex overflow-x-auto max-w-full">
            <TabsTrigger value="mines" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black rounded-xl px-8 py-3 gap-3 font-black uppercase text-[10px] tracking-widest transition-all text-zinc-400">
              <Zap size={16} fill="currentColor" /> Data Sync
            </TabsTrigger>
            <TabsTrigger value="crash" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black rounded-xl px-8 py-3 gap-3 font-black uppercase text-[10px] tracking-widest transition-all text-zinc-400">
              <Rocket size={16} /> Quantum Link
            </TabsTrigger>
            <TabsTrigger value="plinko" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black rounded-xl px-8 py-3 gap-3 font-black uppercase text-[10px] tracking-widest transition-all text-zinc-400">
              <Database size={16} /> Gravity Protocol
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black rounded-xl px-8 py-3 gap-3 font-black uppercase text-[10px] tracking-widest transition-all text-zinc-400">
              <Radio size={16} /> Orbital Pulse
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px]">
            <TabsContent value="mines" className="outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DataSyncGame />
            </TabsContent>

            <TabsContent value="crash" className="outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <QuantumCrash />
            </TabsContent>

            <TabsContent value="plinko" className="outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <GravityPlinko />
            </TabsContent>
            
            <TabsContent value="daily" className="outline-none focus-visible:ring-0 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DailyPulse />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Games;