/**
 * @file GravityPlinko.tsx
 * @description Componente orquestrador principal do jogo Plinko.
 * Integra hooks de logica e fisica com componentes visuais.
 */

"use client";

import { useRef, useCallback } from 'react';
import { usePlinkoGame } from '../hooks/usePlinkoGame';
import { usePlinkoPhysics } from '../hooks/usePlinkoPhysics';
import { PlinkoControlPanel } from './PlinkoControlPanel';
import { PlinkoCanvas } from './PlinkoCanvas';

/**
 * Componente principal do jogo Gravity Plinko
 * Orquestra a logica do jogo, fisica e renderizacao
 */
const GravityPlinko = (): JSX.Element => {
  // Referencia do canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hook de logica do jogo
  const {
    bet,
    setBet,
    soundEnabled,
    toggleSound,
    lastWin,
    dimensions,
    setDimensions,
    ballsRef,
    particlesRef,
    pinsRef,
    slotsRef,
    dropBall,
    handleBallLanding
  } = usePlinkoGame();

  /**
   * Callback para processar chegada da bola ao slot
   * Chamado pelo hook de fisica quando bola atinge um slot
   */
  const onBallLanding = useCallback((slotIndex: number) => {
    handleBallLanding(slotIndex);
  }, [handleBallLanding]);

  // Hook de fisica e renderizacao
  usePlinkoPhysics({
    canvasRef,
    dimensions,
    setDimensions,
    ballsRef,
    particlesRef,
    pinsRef,
    slotsRef,
    bet,
    onBallLanding
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[700px]">
      {/* Painel de Controles */}
      <PlinkoControlPanel
        bet={bet}
        setBet={setBet}
        lastWin={lastWin}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onDropBall={dropBall}
      />

      {/* Area do Jogo (Canvas) */}
      <PlinkoCanvas canvasRef={canvasRef} />
    </div>
  );
};

export default GravityPlinko;
