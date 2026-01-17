/**
 * @file PlinkoControlPanel.tsx
 * @description Painel de controle do jogo Plinko.
 * Contém controles de aposta, último ganho e botões de ação.
 */

"use client";

import { motion } from 'framer-motion';
import { Database, Coins, Volume2, VolumeX } from 'lucide-react';
import { BET_PRESETS } from '../domain/constants';
import type { PlinkoPanelProps } from '../domain/types';

/**
 * Componente do painel de controle do Plinko
 * Renderiza os controles de aposta, visualização de ganho e botões de ação
 */
export function PlinkoControlPanel({
  bet,
  setBet,
  lastWin,
  soundEnabled,
  toggleSound,
  onDropBall
}: PlinkoPanelProps): JSX.Element {
  return (
    <div className="bg-surface-card rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative z-20">
      <div className="space-y-6">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-accent-emerald h-4 w-4" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Gravity Protocol
            </span>
          </div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">
            PLINKO
          </h2>
        </header>

        {/* Controles de Aposta */}
        <div>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">
            Alocacao (VaultCoins)
          </label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="col-span-2 bg-surface-card border border-white/10 rounded-xl h-12 px-4 font-mono text-white outline-none focus:border-accent-emerald"
            />
            {BET_PRESETS.map(v => (
              <button
                key={v}
                onClick={() => setBet(v)}
                className="h-10 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-zinc-400 border border-white/5 hover:border-white/20 transition-all"
              >
                {v} VC
              </button>
            ))}
          </div>
        </div>

        {/* Indicador de Ultimo Ganho */}
        <div className="p-4 rounded-2xl bg-surface-card border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">
              Ultimo Ganho
            </span>
            <span className="text-accent-emerald font-mono font-bold">
              {lastWin?.toFixed(0) || '0'} VC
            </span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              key={lastWin}
              initial={{ width: '0%' }}
              animate={{ width: '100%', opacity: 0 }}
              transition={{ duration: 1 }}
              className="h-full bg-accent-emerald"
            />
          </div>
        </div>
      </div>

      {/* Botoes de Acao */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onDropBall}
          className="w-full h-20 bg-accent-emerald text-black font-black uppercase tracking-widest rounded-2xl shadow-glow-emerald transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Coins size={24} fill="currentColor" />
            INICIAR PROTOCOLO
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>

        <button
          onClick={toggleSound}
          className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {soundEnabled ? 'AUDIO ATIVO' : 'AUDIO MUDO'}
        </button>
      </div>
    </div>
  );
}

export default PlinkoControlPanel;
