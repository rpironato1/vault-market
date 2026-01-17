/**
 * Componente orquestrador do jogo Quantum Crash
 * Arquivo: components/QuantumCrash.tsx
 *
 * Este componente atua como orquestrador, delegando:
 * - Lógica do jogo para useCrashGame
 * - Cálculos visuais para useCrashVisuals
 * - Painel de controle para CrashControlPanel
 * - Display do jogo para CrashDisplay
 */

"use client";

import { useCrashGame, useCrashVisuals } from '../hooks';
import { CrashControlPanel } from './CrashControlPanel';
import { CrashDisplay } from './CrashDisplay';

/**
 * Componente principal do jogo Quantum Crash
 * Orquestra os sub-componentes e hooks
 */
const QuantumCrash = () => {
  // Hook de lógica do jogo
  const {
    status,
    multiplier,
    bet,
    history,
    tension,
    shakeIntensity,
    cashoutHovered,
    viewScale,
    startGame,
    handleCashout,
    setBet,
    setCashoutHovered,
  } = useCrashGame();

  // Hook de cálculos visuais
  const {
    safeX,
    safeY,
    pathData,
    areaData,
    rotation,
    currentColor,
  } = useCrashVisuals({
    status,
    multiplier,
    tension,
    viewScale,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[600px]">
      {/* Painel de Controle */}
      <CrashControlPanel
        status={status}
        bet={bet}
        multiplier={multiplier}
        tension={tension}
        history={history}
        cashoutHovered={cashoutHovered}
        currentColor={currentColor}
        onBetChange={setBet}
        onStartGame={startGame}
        onCashout={handleCashout}
        onCashoutHoverChange={setCashoutHovered}
      />

      {/* Display Principal */}
      <CrashDisplay
        status={status}
        multiplier={multiplier}
        tension={tension}
        shakeIntensity={shakeIntensity}
        currentColor={currentColor}
        pathData={pathData}
        areaData={areaData}
        safeX={safeX}
        safeY={safeY}
        rotation={rotation}
      />
    </div>
  );
};

export default QuantumCrash;
