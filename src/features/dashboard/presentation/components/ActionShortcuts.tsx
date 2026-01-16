import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Gamepad2, Wallet, ArrowRight } from 'lucide-react';

export const ActionShortcuts = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Explorar NFTs',
      desc: 'Adquira ativos e receba Coins',
      icon: Package,
      path: '/marketplace',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'hover:border-blue-400/30'
    },
    {
      label: 'Jogar',
      desc: 'Use Coins nas experiências',
      icon: Gamepad2,
      path: '/games',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'hover:border-emerald-400/30'
    },
    {
      label: 'Sacar Prêmios',
      desc: 'Transfira USDT para sua wallet',
      icon: Wallet,
      path: '/withdrawals',
      color: 'text-[#FFD700]',
      bg: 'bg-[#FFD700]/10',
      border: 'hover:border-[#FFD700]/30'
    }
  ];

  return (
    <div>
      <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-4 p-4 rounded-xl bg-[#121212] border border-white/5 transition-all text-left group ${action.border}`}
          >
            <div className={`h-12 w-12 rounded-lg ${action.bg} ${action.color} flex items-center justify-center shrink-0`}>
              <action.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-sm group-hover:underline decoration-1 underline-offset-4 decoration-zinc-500">
                {action.label}
              </div>
              <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
                {action.desc}
              </div>
            </div>
            <ArrowRight size={16} className="text-zinc-700 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};