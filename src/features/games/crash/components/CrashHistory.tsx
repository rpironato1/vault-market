/**
 * Componente de histórico de rodadas do jogo Crash
 * Arquivo: components/CrashHistory.tsx
 *
 * Exibe as últimas N rodadas com seus multiplicadores finais.
 * Multiplicadores >= 2.0x são destacados em verde.
 */

import { History } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CrashHistoryProps } from '../domain/types';

/**
 * Componente que renderiza o histórico de rodadas
 */
export function CrashHistory({ history }: CrashHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="pt-6 border-t border-white/5">
      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block flex items-center gap-2">
        <History size={12} /> Ultimos Sinais
      </span>
      <div className="flex gap-2 flex-wrap">
        {history.map((h, i) => (
          <div
            key={`${h.timestamp}-${i}`}
            className={cn(
              'px-2 py-1 rounded-md text-[10px] font-mono font-bold border',
              h.multiplier >= 2.0
                ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            )}
          >
            {h.multiplier.toFixed(2)}x
          </div>
        ))}
      </div>
    </div>
  );
}
