"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataSyncGame from '../features/games/mines/components/DataSyncGame';
import DailyPulse from '../features/games/wheel/components/DailyPulse';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Radio } from 'lucide-react';

const Games = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-[#00FF9C] animate-pulse" />
             <span className="text-[10px] font-black text-[#00FF9C] uppercase tracking-[0.4em]">Tactical Operations Center</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Experiências de Rede</h1>
          <p className="text-zinc-500 text-lg font-medium max-w-2xl leading-relaxed">
            Valide pacotes de dados e sincronize ciclos orbitais para expandir seu Vault com unidades de alta fidelidade.
          </p>
        </header>

        <Tabs defaultValue="sync" className="w-full">
          <TabsList className="bg-[#121212] border border-white/5 p-2 rounded-[24px] mb-12 inline-flex">
            <TabsTrigger value="sync" className="data-[state=active]:bg-[#00FF9C] data-[state=active]:text-black rounded-xl px-8 py-3 gap-3 font-black uppercase text-[10px] tracking-widest transition-all">
              <Zap size={16} fill="currentColor" /> Sincronia de Dados
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-[#00FF9C] data-[state=active]:text-black rounded-xl px-8 py-3 gap-3 font-black uppercase text-[10px] tracking-widest transition-all">
              <Radio size={16} /> Pulso Orbital
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="outline-none focus-visible:ring-0">
            <DataSyncGame />
          </TabsContent>
          
          <TabsContent value="daily" className="outline-none focus-visible:ring-0">
            <DailyPulse />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Games;