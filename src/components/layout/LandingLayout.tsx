"use client";

import React from 'react';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#00FF9C]/30 selection:text-white flex flex-col">
      <header className="h-24 px-6 md:px-12 flex justify-between items-center border-b border-white/5 bg-[#050505]/80 backdrop-blur-3xl sticky top-0 z-50">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="h-10 w-10 rounded-xl bg-[#00FF9C] flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_#00FF9C]">
            <ShieldCheck className="text-black" size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white hidden sm:inline-block">
            Vault<span className="text-[#00FF9C]">Net</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/games')}
              className="h-12 px-6 rounded-xl bg-[#121212] border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-all hidden sm:block"
            >
              Jogar
            </button>
            <button 
              onClick={() => navigate('/marketplace')}
              className="h-12 px-6 rounded-xl bg-[#00FF9C]/10 border border-[#00FF9C]/20 flex items-center gap-2 hover:bg-[#00FF9C]/20 transition-all group"
            >
               <span className="text-xs font-black text-[#00FF9C] tracking-widest uppercase">Entrar</span>
               <ArrowUpRight size={16} className="text-[#00FF9C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <footer className="border-t border-white/5 bg-[#09090b] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <MadeWithDyad />
          <p className="mt-4 text-xs text-zinc-600 text-center max-w-md">
            VaultNet é um protocolo de simulação econômica fechada. Ativos digitais não possuem valor monetário real fora do ecossistema.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;