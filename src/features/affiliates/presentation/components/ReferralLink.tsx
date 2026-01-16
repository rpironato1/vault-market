import { Copy, Share2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface Props {
  link: string;
  code: string;
}

export const ReferralLink = ({ link, code }: Props) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(`${label} copiado!`);
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 w-full">
        <h3 className="text-lg font-bold text-white mb-1">Seu Link Exclusivo</h3>
        <p className="text-sm text-zinc-400 mb-4">Compartilhe e ganhe recompensas por cada novo usuário ativo.</p>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 flex items-center justify-between h-12">
            <span className="text-sm font-mono text-zinc-300 truncate">{link}</span>
            <button 
              onClick={() => copyToClipboard(link, "Link")}
              className="text-zinc-500 hover:text-white transition-colors p-2"
            >
              <Copy size={16} />
            </button>
          </div>
          <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 bg-white/5 rounded-xl border border-white/5 border-dashed min-w-[200px]">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Código de Convite</span>
        <div 
          onClick={() => copyToClipboard(code, "Código")}
          className="text-2xl font-mono font-black text-white tracking-wider cursor-pointer hover:text-emerald-400 transition-colors flex items-center gap-2"
        >
          {code} <Copy size={16} className="opacity-50" />
        </div>
      </div>
    </div>
  );
};