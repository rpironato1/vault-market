import { ShieldCheck, ArrowRight, Star } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export const HeroMarketplace = () => {
  return (
    <div className="relative w-full py-20 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden bg-[#09090b] border-b border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00FF9C]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF9C]/10 border border-[#00FF9C]/20 text-[#00FF9C] text-[10px] font-black uppercase tracking-widest mb-6">
          <ShieldCheck weight="fill" size={14} />
          <span>Verified Asset Distribution</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6">
          Aquisição de <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9C] to-emerald-600">
            Ativos Digitais
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Obtenha Game Coins e NFTs exclusivos através do nosso sistema de distribuição garantida. 
          <span className="text-white block mt-2">Valor do prêmio sempre superior ao custo de aquisição.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="h-14 px-8 rounded-xl bg-[#00FF9C] text-black font-black uppercase tracking-widest hover:bg-[#00e68d] transition-all flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,156,0.3)]">
            Explorar Catálogo <ArrowRight weight="bold" />
          </button>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
            <Star weight="fill" className="text-[#FFD700]" />
            <span>4.9/5 Avaliação de Usuários</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};