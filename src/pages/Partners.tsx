"use client";

import AppLayout from '@/components/layout/AppLayout';
import { Users, Crown, Rocket, ChartLineUp, Copy, Share } from '@phosphor-icons/react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const Partners = () => {
  const copyLink = () => {
    navigator.clipboard.writeText("https://vaultnet.io/ref/commander1");
    showSuccess("Link de Expansão copiado!");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-12">
        <header className="relative py-20 px-12 rounded-[40px] bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-10">
             <Crown className="text-[#FFD700]/20" size={120} weight="fill" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
               <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[0.4em]">Elite Growth Network</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-6 uppercase text-white leading-[0.9]">
              Torne-se um <br />
              <span className="text-[#FFD700] italic">Arquiteto de Rede.</span>
            </h1>
            <p className="text-lg text-zinc-400 font-medium mb-10 leading-relaxed">
              Expanda as fronteiras da VaultNet e receba recompensas de validação por cada unidade sincronizada por sua rede.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-500">vaultnet.io/ref/commander1</span>
                <button onClick={copyLink} className="text-[#FFD700] hover:scale-110 transition-transform">
                  <Copy size={20} weight="bold" />
                </button>
              </div>
              <button className="h-16 px-10 rounded-2xl bg-[#FFD700] text-black font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                <Share size={20} weight="bold" /> Convidar
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Taxa de Validação", value: "15%", icon: Rocket, sub: "Sobre cada caixa aberta" },
            { label: "Tokens Bônus", value: "2.500", icon: ChartLineUp, sub: "Por novo parceiro ativo" },
            { label: "Parceiros Totais", value: "142", icon: Users, sub: "Nível de Rede: Ouro" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#121212] border border-white/5 rounded-[32px] p-8 flex flex-col gap-6">
               <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#FFD700]">
                  <stat.icon weight="fill" size={28} />
               </div>
               <div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{stat.label}</span>
                  <span className="text-3xl font-black text-white uppercase tracking-tighter">{stat.value}</span>
                  <p className="text-[10px] font-bold text-zinc-600 mt-2 uppercase">{stat.sub}</p>
               </div>
            </div>
          ))}
        </div>

        <section className="bg-[#121212] rounded-[40px] border border-white/5 p-12">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-8">Hierarquia de Comando</h2>
          <div className="flex flex-col gap-4">
            {[
              { level: "BRONZE", req: "0-10 Refs", comm: "5%", active: false },
              { level: "SILVER", req: "11-50 Refs", comm: "10%", active: false },
              { level: "GOLD", req: "51-200 Refs", comm: "15%", active: true },
              { level: "DIAMOND", req: "201+ Refs", comm: "25%", active: false },
            ].map((tier, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex items-center justify-between p-6 rounded-2xl border transition-all",
                  tier.active ? "bg-[#FFD700]/5 border-[#FFD700]/30" : "bg-black/20 border-white/5 opacity-50"
                )}
              >
                <div className="flex items-center gap-6">
                   <div className={cn("h-4 w-4 rounded-full", tier.active ? "bg-[#FFD700] shadow-[0_0_10px_#FFD700]" : "bg-zinc-800")} />
                   <span className={cn("font-black tracking-widest text-sm", tier.active ? "text-[#FFD700]" : "text-zinc-500")}>{tier.level}</span>
                </div>
                <span className="font-mono text-xs font-bold text-zinc-400">{tier.req}</span>
                <span className="font-black text-white">{tier.comm}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Partners;