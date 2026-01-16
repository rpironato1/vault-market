import React from 'react';
import { Referral } from '../../domain/entities';
import { User, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  referrals: Referral[];
}

export const ReferralsList = ({ referrals }: Props) => {
  if (referrals.length === 0) {
    return (
      <div className="py-12 text-center border border-white/5 rounded-2xl bg-[#121212]">
        <p className="text-zinc-500 text-sm">Você ainda não tem indicações.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Últimas Indicações</h3>
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Usuário</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Data</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider text-right">Gerado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {referrals.map((ref) => (
              <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                      <User size={16} />
                    </div>
                    <span className="font-bold text-white text-sm">{ref.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                  {new Date(ref.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    ref.status === 'ACTIVE' 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-zinc-800 text-zinc-500"
                  )}>
                    {ref.status === 'ACTIVE' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {ref.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-white">
                  ${ref.earningsGenerated.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};