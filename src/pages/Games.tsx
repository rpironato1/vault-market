"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DataSyncGame from '../features/games/mines/components/DataSyncGame';
import DailyPulse from '../features/games/wheel/components/DailyPulse';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, RotateCw } from 'lucide-react';

const Games = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Experiências</h1>
          <p className="text-muted-foreground">Participe de validações de rede e ciclos diários para expandir seu vault.</p>
        </header>

        <Tabs defaultValue="sync" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-8">
            <TabsTrigger value="sync" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black rounded-lg gap-2">
              <Zap size={16} /> Sincronia de Dados
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black rounded-lg gap-2">
              <RotateCw size={16} /> Pulso Diário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="outline-none">
            <DataSyncGame />
          </TabsContent>
          
          <TabsContent value="daily" className="outline-none">
            <DailyPulse />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Games;