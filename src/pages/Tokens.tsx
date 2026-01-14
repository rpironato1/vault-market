"use client";

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useStore } from '../_infrastructure/state/store';
import { Lightning, Trophy, GameController, ArrowUpRight, Coins } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const ExperienceCard = ({ title, description, icon: Icon, reward, locked = false }: any) => (
  <div className={cn(
    "group relative overflow-hidden rounded-2xl border bg-white/[0.02] p-6 transition-all duration-300",
    locked ? "opacity-50 cursor-not-allowed border-white/5" : "hover:border-emerald-500/30 cursor-pointer border-white/5"
  )}>
    <div className="flex items-start justify-between mb-6">
      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <Icon size={24} weight="duotone" />
      </div>
      <div className="text-right">
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Incentivo</span>
        <p className="text-emerald-500 font-mono font-bold">+{reward} TK</p>
      </div>
    </div>
    <h3 className="text-lg font-bold mb-2 tracking-tight uppercase">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed mb-6 h-12 line-clamp-3">{description}</p>
    <div className="flex items-center gap-2 text-[10px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">
      {locked ? "Requer Nível 2" : "Iniciar Sincronia"} <ArrowUpRight size={14} weight="bold" />
    </div>
  </div>
);

const Tokens = () => {
  const { engagementTokens } = useStore();

  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        <header>
          <div className="flex items-center gap-3 mb-2">
            <Coins weight="fill" className="text-emerald-500 h-5 w-5" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Protocolo de Valor</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">Central de Tokens</h1>
          <p className="text-muted-foreground max-w-xl font-medium">
            Utilize seus Tokens de Engajamento para desbloquear novas camadas de utilidade e prioridade na rede.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 bg-emerald-500/5 blur-[100px]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saldo de Tokens Verificados</span>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-6xl font-mono font-black tracking-tighter text-white">
                {engagementTokens.toLocaleString()}
              </span>
              <span className="text-lg font-black text-emerald-500 italic uppercase">TK</span>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col justify-center">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Próximo Milestone</span>
            <div className="h-2 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[65%]" />
            </div>
            <p className="text-[10px] font-bold text-white/60">Atingir 10.000 TK para Nível 2</p>
          </div>
        </div>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-4">
            <Lightning weight="fill" className="text-emerald-500" />
            Experiências de Acúmulo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExperienceCard 
              title="Validação de Setores"
              description="Analise e valide a integridade de setores de rede para ganhar tokens de utilidade."
              icon={Lightning}
              reward="50"
            />
            <ExperienceCard 
              title="Ciclo de Sincronia"
              description="Participe dos ciclos diários de sincronização global do vault."
              icon={Trophy}
              reward="120"
            />
            <ExperienceCard 
              title="Teste de Agilidade"
              description="Protocolos experimentais de resposta rápida para usuários avançados."
              icon={GameController}
              reward="200"
              locked={true}
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Tokens;