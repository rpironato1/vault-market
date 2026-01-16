"use client";

import AppLayout from '@/components/layout/AppLayout';
import { useStore } from '@infra/state/store';
import { Lightning, Trophy, GameController, ArrowUpRight, Coins } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const ExperienceCard = ({ title, description, icon: Icon, reward, locked = false }: any) => (
  <div className={cn(
    "group relative overflow-hidden rounded-2xl border bg-[#121214] p-7 transition-all duration-300",
    locked ? "opacity-60 cursor-not-allowed border-white/5" : "hover:border-emerald-500/40 cursor-pointer border-white/10"
  )}>
    <div className="flex items-start justify-between mb-8">
      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
        <Icon size={28} weight="duotone" />
      </div>
      <div className="text-right">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Incentivo</span>
        <p className="text-emerald-400 font-mono text-lg font-bold">+{reward} VC</p>
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3 tracking-tight uppercase text-white">{title}</h3>
    <p className="text-sm text-zinc-400 leading-relaxed mb-8 h-12 line-clamp-3 font-medium">{description}</p>
    <div className="flex items-center gap-2 text-xs font-black text-zinc-500 group-hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">
      {locked ? "Requer Nível 2" : "Iniciar Sincronia"} <ArrowUpRight size={16} weight="bold" />
    </div>
  </div>
);

const Tokens = () => {
  const { engagementTokens } = useStore();

  return (
    <AppLayout>
      <div className="flex flex-col gap-10 max-w-7xl mx-auto">
        <header>
          <div className="flex items-center gap-3 mb-3">
            <Coins weight="fill" className="text-emerald-500 h-6 w-6" />
            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Protocolo de Utilidade</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 text-white">Central VaultCoins</h1>
          <p className="text-zinc-400 text-lg max-w-xl font-medium leading-relaxed">
            VaultCoins (VC) são tokens de utilidade obtidos exclusivamente na compra de NFTs. 
            Utilize seu saldo para participar de experiências e validar a rede.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-[#121214] to-[#121214] p-10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-64 w-64 bg-emerald-500/10 blur-[100px]" />
            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Saldo de Tokens Verificados</span>
            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-7xl font-mono font-black tracking-tighter text-white">
                {engagementTokens.toLocaleString()}
              </span>
              <span className="text-2xl font-black text-emerald-500 italic uppercase">VC</span>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/10 bg-[#121214] p-10 flex flex-col justify-center">
            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-6">Status da Conta</span>
            <div className="h-3 w-full bg-zinc-800 rounded-full mb-6 overflow-hidden border border-white/5">
              <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="text-xs font-bold text-zinc-300">Conta Verificada - Nível 1</p>
          </div>
        </div>

        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-10 flex items-center gap-4">
            <Lightning weight="fill" className="text-emerald-500" />
            Experiências de Acúmulo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExperienceCard 
              title="Validação de Setores"
              description="Analise e valide a integridade de setores de rede (Mines) para ganhar tokens de utilidade."
              icon={Lightning}
              reward="50"
            />
            <ExperienceCard 
              title="Ciclo de Sincronia"
              description="Participe dos ciclos diários de sincronização global (Wheel) para bônus."
              icon={Trophy}
              reward="120"
            />
            <ExperienceCard 
              title="Teste de Agilidade"
              description="Protocolos experimentais de resposta rápida (Crash/Plinko)."
              icon={GameController}
              reward="200"
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Tokens;