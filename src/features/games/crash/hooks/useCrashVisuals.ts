/**
 * Hook de cálculos visuais do jogo Crash
 * Arquivo: hooks/useCrashVisuals.ts
 *
 * Calcula valores derivados para renderização:
 * - Posição do foguete (X, Y)
 * - Paths SVG da curva
 * - Rotação do foguete
 * - Cor atual baseada na tensão
 */

import { useMemo } from 'react';
import type { GameStatus, TensionLevel } from '../domain/types';
import { TENSION_PHASES, MULTIPLIER_GROWTH_RATE } from '../domain/constants';

/**
 * Interface de retorno do hook useCrashVisuals
 */
interface UseCrashVisualsReturn {
  /** Coordenada X segura (0-100) */
  safeX: number;
  /** Coordenada Y segura (0-100) */
  safeY: number;
  /** Path data da curva do foguete */
  pathData: string;
  /** Path data da área preenchida abaixo da curva */
  areaData: string;
  /** Rotação do foguete em graus */
  rotation: number;
  /** Cor RGB atual baseada na tensão */
  currentColor: string;
}

interface UseCrashVisualsParams {
  status: GameStatus;
  multiplier: number;
  tension: TensionLevel;
  viewScale: { x: number; y: number };
}

/**
 * Hook que calcula valores visuais derivados para o jogo Crash
 */
export function useCrashVisuals({
  status,
  multiplier,
  tension,
  viewScale,
}: UseCrashVisualsParams): UseCrashVisualsReturn {
  return useMemo(() => {
    // Calcula tempo atual baseado no multiplicador
    const currentTime =
      status === 'STARTING' || status === 'IDLE'
        ? 0
        : Math.log(multiplier) / MULTIPLIER_GROWTH_RATE;

    // Calcula porcentagens de posição
    const xPercent = (currentTime / viewScale.x) * 100;
    const yPercent = ((multiplier - 1) / (viewScale.y - 1)) * 100;
    const svgY = 100 - yPercent;

    // Garante valores seguros dentro do viewBox
    const safeX = Math.min(Math.max(xPercent, 0), 100);
    const safeY = Math.min(Math.max(svgY, 0), 100);

    // Gera paths SVG
    const pathData = `M 0 100 Q ${safeX * 0.5} 100, ${safeX} ${safeY}`;
    const areaData = `${pathData} L ${safeX} 100 L 0 100 Z`;

    // Calcula rotação do foguete
    const rotation =
      status === 'CRASHED' ? 90 : Math.max(-45, -10 - yPercent * 0.5);

    // Obtém cor atual da fase de tensão
    const currentColor = TENSION_PHASES[tension].color;

    return {
      safeX,
      safeY,
      pathData,
      areaData,
      rotation,
      currentColor,
    };
  }, [status, multiplier, tension, viewScale]);
}
