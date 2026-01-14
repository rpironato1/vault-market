import React from 'react';
import { ShieldCheck, TrendingUp, Package } from 'lucide-react';

export const MarketHero = () => {
  return (
    <section className="relative w-full py-24 px-6 md:px-12 rounded-[32px] bg-[#09090b] border border-white/5 overflow-hidden mb-12">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Protocolo de Valor Garantido</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.95]">
          O ÚNICO MARKETPLACE <br />
          ONDE O <span className="text-emerald-500">VALOR</span> SUPERA <br />
          O <span className="text-zinc-500">PREÇO.</span>
        </h1>

        <p className="text-lg text-zinc-400 font-medium max-w-xl leading-relaxed mb-10">
          Adquira Caixas Misteriosas com garantia matemática de valor superior. 
          Receba NFTs, Gift Cards ou Moedas de Jogo exclusivas para utilizar em nosso ecossistema.
        </p>

        <div className="flex flex-wrap items-center gap-8 border-t border-white/5 pt-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white font-bold">
              <TrendingUp size={18} className="text-emerald-500" />
              <span>+12% ROI</span>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Média de Retorno</span>
          </div>
          
          <div className="w-px h-10 bg-white/10" />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white font-bold">
              <Package size={18} className="text-emerald-500" />
              <span>Instantâneo</span>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Entrega no Vault</span>
          </div>
        </div>
      </div>
    </section>
  );
};