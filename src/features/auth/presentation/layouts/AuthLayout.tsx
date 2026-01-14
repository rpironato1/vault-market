import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden text-zinc-100 font-sans selection:bg-[#00FF9C]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,156,0.03),transparent_70%)]" />
      <div className="absolute top-0 left-0 h-96 w-96 bg-[#00FF9C]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-64 w-64 bg-[#FF007F]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header / Logo */}
      <div 
        className="absolute top-8 left-8 flex items-center gap-3 cursor-pointer group z-50"
        onClick={() => navigate('/')}
      >
        <div className="h-8 w-8 rounded-lg bg-[#00FF9C]/10 border border-[#00FF9C]/20 flex items-center justify-center transition-all group-hover:border-[#00FF9C]/50">
          <ShieldCheck className="text-[#00FF9C]" size={18} />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase italic text-white">
          Vault<span className="text-[#00FF9C]">Net</span>
        </span>
      </div>

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#09090b] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Top Glow on Card */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF9C]/50 to-transparent opacity-50" />
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{title}</h1>
            <p className="text-sm text-zinc-500 font-medium">{subtitle}</p>
          </div>

          {children}
        </div>
        
        <div className="mt-8 text-center">
           <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};