/**
 * Constantes do domínio do jogo Crash
 * Arquivo: domain/constants.ts
 *
 * Define constantes de configuração do jogo,
 * fases de tensão visual e opções de aposta.
 */

import type { TensionPhase, TensionLevel } from './types';

/**
 * Limite de itens no histórico de rodadas
 */
export const HISTORY_LIMIT = 5;

/**
 * Opções pré-definidas de aposta (VaultCoins)
 */
export const BET_OPTIONS = [10, 50, 100, 'MAX'] as const;

/**
 * Taxa de crescimento exponencial do multiplicador
 * Usado na fórmula: multiplier = e^(GROWTH_RATE * seconds)
 */
export const MULTIPLIER_GROWTH_RATE = 0.12;

/**
 * Delay em ms para iniciar o jogo após calibração
 */
export const GAME_START_DELAY = 800;

/**
 * Multiplicador máximo permitido (cap)
 */
export const MAX_MULTIPLIER = 50;

/**
 * Multiplicador mínimo de crash
 */
export const MIN_CRASH_MULTIPLIER = 1.1;

/**
 * Probabilidade de crash instantâneo (3%)
 */
export const INSTANT_CRASH_PROBABILITY = 0.03;

/**
 * Fases de tensão visual com thresholds e cores
 * - STABLE: Multiplicador abaixo de 2.0x (verde)
 * - HEATING: Multiplicador entre 2.0x e 5.0x (dourado)
 * - CRITICAL: Multiplicador acima de 5.0x (vermelho)
 */
export const TENSION_PHASES: Record<TensionLevel, TensionPhase> = {
  STABLE: {
    threshold: 0,
    colorClass: 'text-accent-emerald',
    color: 'rgb(0, 255, 156)',
    shadow: 'rgba(0,255,156,0.3)',
  },
  HEATING: {
    threshold: 2.0,
    colorClass: 'text-prestige-gold',
    color: 'rgb(255, 215, 0)',
    shadow: 'rgba(255,215,0,0.4)',
  },
  CRITICAL: {
    threshold: 5.0,
    colorClass: 'text-danger-neon',
    color: 'rgb(255, 0, 85)',
    shadow: 'rgba(255,0,85,0.6)',
  },
};

/**
 * Obtém a fase de tensão atual baseada no multiplicador
 */
export function getTensionLevel(multiplier: number): TensionLevel {
  if (multiplier > TENSION_PHASES.CRITICAL.threshold) {
    return 'CRITICAL';
  }
  if (multiplier > TENSION_PHASES.HEATING.threshold) {
    return 'HEATING';
  }
  return 'STABLE';
}

/**
 * Calcula a intensidade do shake baseada no multiplicador e tensão
 */
export function calculateShakeIntensity(
  multiplier: number,
  tension: TensionLevel
): number {
  if (tension === 'CRITICAL') {
    return 2 + multiplier * 0.1;
  }
  if (tension === 'HEATING') {
    return 0.5;
  }
  return 0;
}
