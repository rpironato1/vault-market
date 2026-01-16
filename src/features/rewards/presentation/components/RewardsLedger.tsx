import React from 'react';
import { RewardTransaction, RewardStatus } from '../../domain/entities';
import { GameController, Users, Gear, Clock, CheckCircle, XCircle, LockKey, Trophy } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Props {
  transactions: RewardTransaction[];
}

const StatusBadge = ({ status, unlockDate }: { status: RewardStatus, unlockDate?: number }) => {
  switch (status) {
    case 'AVAILABLE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
          <CheckCircle size={12} weight="fill" /> Disponível
        </span>
      );
    case 'LOCKED':
      return (
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
            <LockKey size={12} weight="fill" /> Bloqueado
          </span>
          {unlockDate && (
            <span className="text-[9px] text-zinc-600 mt-1 font-mono">
              Libera em: {new Date(unlockDate).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-wider border border-zinc-700">
          <CheckCircle size={12} weight="fill" /> Pago
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider border border-red-500/20">
          <XCircle size={12} weight="fill" /> {status}
        </span>
      );
  }
};

const SourceIcon = ({ source }: { source: RewardTransaction['source'] }) => {
  switch (source) {
    case 'GAME_WIN': return <GameController size={18} weight="duotone" />;
    case 'AFFILIATE_COMMISSION': return <Users size={18} weight="duotone" />;
    default: return <Gear size={18} weight="duotone" />;
  }
};

export const RewardsLedger = ({ transactions }: Props) => {
  if (transactions.length === 0) {
    return (
      <div className="py-20 text-center border border-white/5 rounded-2xl bg-[#121212]">
        <Trophy size={48} className="mx-auto text-zinc-700 mb-4" weight="duotone" />
        <p className="text-zinc-500 text-sm">Você ainda não recebeu recompensas.</p>
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
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 text-zinc-400 font-mono text-xs whitespace-nowrap">
                  {new Date(tx.timestamp).toLocaleDateString()}
                  <span className="block text-[10px] text-zinc-600">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <div className="p-1.5 rounded bg-white/5 text-zinc-400">
                      <SourceIcon source={tx.source} />
                    </div>
                    <span className="font-medium text-xs">{tx.source.replace(/_/g, ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-300 font-medium">
                  {tx.description}
                  {tx.referenceId && (
                    <span className="block text-[9px] font-mono text-zinc-600 mt-0.5">REF: {tx.referenceId}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-[#FFD700]">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <StatusBadge status={tx.status} unlockDate={tx.unlockDate} />
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