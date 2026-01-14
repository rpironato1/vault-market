"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Gamepad2, Zap, Trophy, ArrowUpRight } from 'lucide-react';

const TokenCard = ({ title, description, icon: Icon, reward }: { title: string, description: string, icon: any, reward: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-emerald-500/30 transition-all cursor-pointer">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-emerald-500/10 blur-[40px] group-hover:bg-emerald-500/20 transition-all" />
    <div className="flex items-start justify-between mb-4">
      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
        <Icon size={24} />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recompensa</span>
        <p className="text-emerald-400 font-mono font-bold">+{reward} TK</p>
      </div>
    </div>
    <h3 className="text-xl font-bold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <div className="flex items-center gap-2 text-xs font-bold text-white/40 group-hover:text-white transition-colors">
      ACESSAR EXPERIÊNCIA <ArrowUpRight size={14} />
    </div>
  </div>
);

const Tokens = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Central de Tokens</h1>
          <p className="text-muted-foreground">Utilize seus tokens de engajamento para desbloquear utilidades e benefícios na rede.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Saldo de Tokens</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-mono font-bold tracking-tighter">8,420</span>
              <span className="text-sm font-bold opacity-40">TK</span>
            </div>
          </div>
          {/* Outros stats podem ser adicionados aqui */}
        </div>

        <div>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Zap size={20} className="text-emerald-400" />
            Experiências de Engajamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TokenCard 
              title="Validação de Redes"
              description="Participe do fluxo de validação de itens e ganhe tokens por cada unidade verificada com sucesso."
              icon={Zap}
              reward="50"
            />
            <TokenCard 
              title="Missões de Curadoria"
              description="Analise as tendências do marketplace e ajude a selecionar as próximas Mystery Boxes da temporada."
              icon={Trophy}
              reward="120"
            />
            <TokenCard 
              title="Mini-Sincronia"
              description="Teste de precisão e agilidade para coletar fragmentos de tokens em tempo real."
              icon={Gamepad2}
              reward="200"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Tokens;