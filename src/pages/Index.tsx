"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.05),transparent_70%)]" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-[#00FF9C]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-[#FF007F]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl px-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-[#00FF9C]/10 border border-[#00FF9C]/20 mb-8 shadow-[0_0_50px_rgba(0,255,156,0.2)]">
          <ShieldCheck size={40} className="text-[#00FF9C]" />
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-6">
          Vault<span className="text-[#00FF9C]">Net</span>
        </h1>
        
        <p className="text-zinc-500 text-lg font-medium mb-12 leading-relaxed">
          The decentralized asset validation protocol is currently synchronizing. <br />
          Access the marketplace to view available units.
        </p>

        <button 
          onClick={() => navigate('/marketplace')}
          className="h-14 px-8 rounded-2xl bg-[#00FF9C] text-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto hover:shadow-[0_0_30px_rgba(0,255,156,0.4)]"
        >
          Enter Marketplace <ArrowRight size={20} />
        </button>
      </div>

      <div className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
        System Status: Nominal
      </div>
    </div>
  );
};

export default Index;