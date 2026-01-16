import { VaultCoinTransaction } from '../../domain/entities';
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Gamepad2, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  transactions: VaultCoinTransaction[];
}

const SourceIcon = ({ source }: { source: VaultCoinTransaction['source'] }) => {
  switch (source) {
    case 'NFT_PURCHASE': return <ShoppingBag size={16} />;
    case 'GAME_ENTRY': 
    case 'GAME_REWARD': return <Gamepad2 size={16} />;
    case 'AFFILIATE_BONUS': return <Users size={16} />;
    default: return <Settings size={16} />;
  }
};

export const TransactionHistory = ({ transactions }: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center border border-white/5 rounded-2xl bg-[#121212]">
        <p className="text-zinc-500 text-sm">Nenhuma movimentação registrada.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Data</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Origem</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Descrição</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-zinc-400 font-mono text-xs whitespace-nowrap">
                  {new Date(tx.timestamp).toLocaleDateString()} <span className="text-zinc-600 mx-1">•</span> {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <div className="p-1.5 rounded bg-white/5 text-zinc-400 group-hover:text-white transition-colors">
                      <SourceIcon source={tx.source} />
                    </div>
                    <span className="font-medium text-xs">{tx.source.replace(/_/g, ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400 font-medium">
                  {tx.description}
                  {tx.referenceId && (
                    <span className="block text-[9px] font-mono text-zinc-600 mt-0.5">REF: {tx.referenceId}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold">
                  <div className={cn(
                    "inline-flex items-center gap-1",
                    tx.type === 'CREDIT' ? "text-emerald-400" : "text-zinc-500"
                  )}>
                    {tx.type === 'CREDIT' ? '+' : ''}{tx.amount}
                    {tx.type === 'CREDIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};