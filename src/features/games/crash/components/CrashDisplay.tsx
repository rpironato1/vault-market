/**
 * Display principal do jogo Crash
 * Arquivo: components/CrashDisplay.tsx
 *
 * Renderiza a visualização do jogo:
 * - Grid de fundo
 * - Curva SVG do foguete
 * - Foguete/ícone de crash
 * - Multiplicador central
 * - Overlays de status
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Zap,
  AlertTriangle,
  Skull,
  Crosshair,
} from 'lucide-react';
import type { CrashDisplayProps } from '../domain/types';

/**
 * Componente do display principal do jogo
 */
export function CrashDisplay({
  status,
  multiplier,
  tension,
  shakeIntensity,
  currentColor,
  pathData,
  areaData,
  safeX,
  safeY,
  rotation,
}: CrashDisplayProps) {
  const showTrajectory =
    status === 'FLYING' || status === 'CRASHED' || status === 'CASHOUT';

  return (
    <div
      className="lg:col-span-2 bg-surface-black rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col transition-transform duration-75"
      style={{
        transform: `translate(${Math.random() * shakeIntensity - shakeIntensity / 2}px, ${Math.random() * shakeIntensity - shakeIntensity / 2}px)`,
      }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '-1px -1px',
        }}
      />

      {/* SVG Trajectory */}
      <div className="relative flex-1 w-full h-full z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trailGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={currentColor} stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {showTrajectory && (
            <>
              <path
                d={areaData}
                fill="url(#trailGradient)"
                className="transition-colors duration-300"
              />
              <path
                d={pathData}
                fill="none"
                stroke={status === 'CRASHED' ? '#EF4444' : currentColor}
                strokeWidth="1.5"
                filter="url(#glow)"
                strokeLinecap="round"
                className="transition-colors duration-200"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        {/* Rocket/Crash Icon */}
        {showTrajectory && (
          <RocketIcon
            status={status}
            safeX={safeX}
            safeY={safeY}
            rotation={rotation}
            currentColor={currentColor}
          />
        )}
      </div>

      {/* Status Overlays */}
      <StatusOverlay
        status={status}
        multiplier={multiplier}
        shakeIntensity={shakeIntensity}
        currentColor={currentColor}
      />

      {/* Critical Tension Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
        style={{
          opacity: tension === 'CRITICAL' ? 0.3 : 0,
          background:
            'radial-gradient(circle, transparent 50%, rgb(255, 0, 85) 100%)',
        }}
      />
    </div>
  );
}

/**
 * Sub-componente do ícone do foguete
 */
interface RocketIconProps {
  status: 'FLYING' | 'CRASHED' | 'CASHOUT' | 'IDLE' | 'STARTING';
  safeX: number;
  safeY: number;
  rotation: number;
  currentColor: string;
}

function RocketIcon({
  status,
  safeX,
  safeY,
  rotation,
  currentColor,
}: RocketIconProps) {
  return (
    <div
      className="absolute w-10 h-10 -ml-5 -mt-5 z-20 will-change-transform"
      style={{
        left: `${safeX}%`,
        top: `${safeY}%`,
        transform: `translate(-30%, -30%) rotate(${rotation}deg)`,
      }}
    >
      {status === 'CRASHED' ? (
        <div className="relative">
          <Skull className="text-red-500 w-12 h-12 animate-ping absolute opacity-50" />
          <AlertTriangle className="text-red-500 w-12 h-12 drop-shadow-[0_0_20px_rgba(239,68,68,1)]" />
        </div>
      ) : (
        <div className="relative">
          <Rocket
            className="w-10 h-10 drop-shadow-[0_0_15px_currentColor]"
            style={{ color: currentColor }}
            fill="#050505"
          />
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-12 opacity-80 blur-sm transition-colors duration-300"
            style={{
              background: `linear-gradient(to bottom, ${currentColor}, transparent)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Sub-componente dos overlays de status
 */
interface StatusOverlayProps {
  status: 'IDLE' | 'STARTING' | 'FLYING' | 'CRASHED' | 'CASHOUT';
  multiplier: number;
  shakeIntensity: number;
  currentColor: string;
}

function StatusOverlay({
  status,
  multiplier,
  shakeIntensity,
  currentColor,
}: StatusOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        {status === 'STARTING' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-accent-emerald text-sm font-black tracking-[0.5em] uppercase animate-pulse"
          >
            Iniciando Motores...
          </motion.div>
        )}

        {(status === 'FLYING' || status === 'CASHOUT') && (
          <div className="text-center relative">
            <div
              className="text-8xl font-mono font-black text-white tracking-tighter drop-shadow-2xl transition-colors duration-300"
              style={{
                textShadow: `0 0 ${shakeIntensity * 2}px ${currentColor}`,
                transform: `scale(${1 + shakeIntensity * 0.005})`,
              }}
            >
              {multiplier.toFixed(2)}
              <span className="text-4xl" style={{ color: currentColor }}>
                x
              </span>
            </div>

            {status === 'CASHOUT' && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="mt-4 bg-accent-emerald text-black px-6 py-2 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-2 shadow-glow-emerald"
              >
                <Zap size={16} fill="black" /> Saque Confirmado
              </motion.div>
            )}
          </div>
        )}

        {status === 'CRASHED' && (
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-black/80 p-8 rounded-3xl backdrop-blur-sm border border-red-500/30"
          >
            <div className="text-red-500 mb-2 flex justify-center">
              <Crosshair size={48} className="animate-spin-slow" />
            </div>
            <div className="text-6xl font-black text-red-500 tracking-tighter italic drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              SINAL PERDIDO
            </div>
            <div className="text-xl font-mono font-bold text-zinc-400 mt-2">
              Crash em <span className="text-white">{multiplier.toFixed(2)}x</span>
            </div>
            <div className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
              Aguardando reinicializacao manual...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
