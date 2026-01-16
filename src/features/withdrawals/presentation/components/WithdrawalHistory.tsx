import { WithdrawalRequest } from '../../domain/entities';
import { CheckCircle, Clock, XCircle, ArrowSquareOut } from '@phosphor-icons/react';

interface Props {
  requests: WithdrawalRequest[];
}

const StatusBadge = ({ status }: { status: WithdrawalRequest['status'] }) => {
  switch (status) {
    case 'COMPLETED':
      return <span className="text-emerald-500 flex items-center gap-1"><CheckCircle weight="fill" /> Pago</span>;
    case 'PENDING_REVIEW':
    case 'PROCESSING':
      return <span className="text-amber-500 flex items-center gap-1"><Clock weight="fill" /> Análise</span>;
    case 'REJECTED':
      return <span className="text-red-500 flex items-center gap-1"><XCircle weight="fill" /> Recusado</span>;
    default:
      return <span className="text-zinc-500">{status}</span>;
  }
};

export const WithdrawalHistory = ({ requests }: Props) => {
  if (requests.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Histórico</h3>
      <div className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Data</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Valor</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider">Destino</th>
              <th className="px-6 py-4 font-bold text-zinc-500 uppercase text-[10px] tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 text-zinc-400 font-mono text-xs whitespace-nowrap">
                  {new Date(req.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-white">
                  ${req.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    {req.walletAddress}
                    {req.txHash && (
                      <a href={`https://polygonscan.com/tx/${req.txHash}`} target="_blank" rel="noreferrer" className="text-[#FFD700] hover:underline">
                        <ArrowSquareOut />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-xs font-bold uppercase">
                  <div className="flex justify-end">
                    <StatusBadge status={req.status} />
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