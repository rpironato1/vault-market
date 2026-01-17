import { useNavigate } from 'react-router-dom';
import { Package, Gamepad2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ActionShortcuts = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Marketplace',
      desc: 'Adquirir Ativos',
      icon: Package,
      path: '/marketplace',
      theme: 'blue',
      tag: 'STORE'
    },
    {
      label: 'Experiências',
      desc: 'Iniciar Sincronia',
      icon: Gamepad2,
      path: '/games',
      theme: 'emerald',
      tag: 'PLAY'
    },
    {
      label: 'Gestão de Saque',
      desc: 'Transferir USDT',
      icon: Wallet,
      path: '/withdrawals',
      theme: 'gold',
      tag: 'FINANCE'
    }
  ];

  const themes = {
    blue: "hover:border-blue-500/30 hover:bg-blue-500/5 group-hover:text-blue-400",
    emerald: "hover:border-emerald-500/30 hover:bg-emerald-500/5 group-hover:text-emerald-400",
    gold: "hover:border-prestige-gold/30 hover:bg-prestige-gold/5 group-hover:text-prestige-gold"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => {
        const activeTheme = themes[action.theme as keyof typeof themes];
        
        return (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={cn(
              "relative flex items-center justify-between p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 transition-all group overflow-hidden text-left h-24",
              activeTheme
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="flex flex-col relative z-10">
              <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-50 group-hover:opacity-100 transition-opacity", 
                 action.theme === 'blue' ? 'text-blue-400' : 
                 action.theme === 'emerald' ? 'text-emerald-400' : 'text-prestige-gold'
              )}>
                {action.tag}
              </span>
              <span className="font-bold text-white text-sm group-hover:scale-105 transition-transform origin-left">
                {action.label}
              </span>
              <span className="text-[10px] text-zinc-500 mt-0.5">{action.desc}</span>
            </div>

            <div className={cn(
              "h-10 w-10 rounded-xl bg-[#151515] border border-white/5 flex items-center justify-center transition-all group-hover:scale-110",
              action.theme === 'blue' ? 'group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:text-blue-400' : 
              action.theme === 'emerald' ? 'group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 group-hover:text-emerald-400' : 
              'group-hover:bg-prestige-gold/10 group-hover:border-prestige-gold/20 group-hover:text-prestige-gold'
            )}>
              <action.icon size={20} className="text-zinc-600 group-hover:text-current transition-colors" />
            </div>
          </button>
        );
      })}
    </div>
  );
};