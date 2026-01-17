/**
 * Painel de controle do jogo Crash
 * Arquivo: components/CrashControlPanel.tsx
 *
 * Gerencia a interface de controle:
 * - Input de aposta
 * - Botões de valores pré-definidos
 * - Botões de ação (iniciar/cashout)
 * - Histórico de rodadas
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CrashControlPanelProps } from '../domain/types';
import { BET_OPTIONS } from '../domain/constants';
import { CrashHistory } from './CrashHistory';

/**
 * Componente do painel de controle
 */
export function CrashControlPanel({
  status,
  bet,
  multiplier,
  tension,
  history,
  cashoutHovered,
  currentColor,
  onBetChange,
  onStartGame,
  onCashout,
  onCashoutHoverChange,
}: CrashControlPanelProps) {
  const isGameActive = status === 'FLYING' || status === 'STARTING';
  const canChangeBet = status === 'IDLE' || status === 'CRASHED' || status === 'CASHOUT';

  return (
    <div className="bg-surface-card rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative z-20 overflow-hidden">
      {/* Background gradient dinâmico */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at top right, ${currentColor}, transparent 70%)`,
        }}
      />

      <div className="space-y-8 relative z-10">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-2">
            <Zap
              className={cn(
                'h-4 w-4 transition-colors',
                status === 'FLYING' ? 'animate-pulse' : 'text-zinc-600'
              )}
              style={{ color: status === 'FLYING' ? currentColor : undefined }}
            />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Status do Reator
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-white italic tracking-tighter">
              QUANTUM
            </h2>
            <span
              className="text-sm font-bold transition-colors duration-500"
              style={{ color: currentColor }}
            >
              v2.4
            </span>
          </div>
        </header>

        {/* Bet Input */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
            Alocacao (VaultCoins)
          </label>
          <div className="relative">
            <input
              type="number"
              value={bet}
              onChange={(e) => onBetChange(Number(e.target.value))}
              disabled={isGameActive}
              className="w-full bg-surface-card border border-white/10 rounded-2xl h-16 px-6 font-mono text-2xl font-black text-white outline-none focus:border-accent-emerald transition-all disabled:opacity-50"
            />
          </div>
          <div className="flex gap-2">
            {BET_OPTIONS.map((val, i) => (
              <button
                key={i}
                onClick={() =>
                  typeof val === 'number' && canChangeBet
                    ? onBetChange(val)
                    : undefined
                }
                disabled={!canChangeBet}
                className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-zinc-400 transition-colors uppercase disabled:opacity-30"
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <CrashHistory history={history} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 relative z-10">
        {canChangeBet ? (
          <button
            onClick={onStartGame}
            className="w-full h-20 bg-accent-emerald text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-accent-emerald-hover shadow-glow-emerald transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Rocket size={20} fill="currentColor" />
            {status === 'CRASHED' ? 'RE-SINCRONIZAR' : 'INICIAR SINCRONIA'}
          </button>
        ) : status === 'STARTING' ? (
          <button
            disabled
            className="w-full h-20 bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest rounded-2xl cursor-wait flex items-center justify-center gap-2"
          >
            <span className="animate-pulse">Calibrando...</span>
          </button>
        ) : (
          <CashoutButton
            bet={bet}
            multiplier={multiplier}
            tension={tension}
            cashoutHovered={cashoutHovered}
            currentColor={currentColor}
            onCashout={onCashout}
            onHoverChange={onCashoutHoverChange}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Sub-componente do botão de cashout
 */
interface CashoutButtonProps {
  bet: number;
  multiplier: number;
  tension: 'STABLE' | 'HEATING' | 'CRITICAL';
  cashoutHovered: boolean;
  currentColor: string;
  onCashout: () => void;
  onHoverChange: (hovered: boolean) => void;
}

function CashoutButton({
  bet,
  multiplier,
  tension,
  cashoutHovered,
  currentColor,
  onCashout,
  onHoverChange,
}: CashoutButtonProps) {
  return (
    <div className="relative">
      <AnimatePresence>
        {cashoutHovered && multiplier < 1.5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-12 left-0 right-0 text-center"
          >
            <span className="bg-prestige-gold text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
              Sinal fraco. Manter link?
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onCashout}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        className="w-full h-20 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-zinc-200"
        style={{
          boxShadow: tension === 'CRITICAL' ? `0 0 30px ${currentColor}` : 'none',
          animation: tension === 'CRITICAL' ? 'pulse 0.5s infinite' : 'none',
        }}
      >
        <span className="relative z-10 text-xs tracking-[0.3em] mb-1 text-zinc-500">
          DESCONECTAR
        </span>
        <span className="relative z-10 text-2xl font-mono font-bold">
          {(bet * multiplier).toFixed(0)} VC
        </span>

        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-zinc-200">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: '100%',
              backgroundColor: currentColor,
            }}
          />
        </div>
      </button>
    </div>
  );
}
