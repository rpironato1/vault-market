/**
 * Hook principal de lógica do jogo Crash
 * Arquivo: hooks/useCrashGame.ts
 *
 * Gerencia todo o estado e lógica do jogo:
 * - Início/parada do jogo
 * - Loop de animação do multiplicador
 * - Cashout e crash
 * - Histórico de rodadas
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@infra/state/store';
import { showSuccess, showError } from '@/utils/toast';
import type { GameStatus, GameHistory, TensionLevel } from '../domain/types';
import {
  HISTORY_LIMIT,
  GAME_START_DELAY,
  MULTIPLIER_GROWTH_RATE,
  MAX_MULTIPLIER,
  MIN_CRASH_MULTIPLIER,
  INSTANT_CRASH_PROBABILITY,
  getTensionLevel,
  calculateShakeIntensity,
} from '../domain/constants';

/**
 * Interface de retorno do hook useCrashGame
 */
interface UseCrashGameReturn {
  // Estado do jogo
  status: GameStatus;
  multiplier: number;
  bet: number;
  history: GameHistory[];
  tension: TensionLevel;
  shakeIntensity: number;
  cashoutHovered: boolean;
  viewScale: { x: number; y: number };
  engagementTokens: number;

  // Ações
  startGame: () => void;
  handleCashout: () => void;
  setBet: (value: number) => void;
  setCashoutHovered: (value: boolean) => void;
}

/**
 * Hook que encapsula toda a lógica do jogo Crash
 */
export function useCrashGame(): UseCrashGameReturn {
  const { engagementTokens, setTokens } = useStore();

  // Estado do jogo
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [multiplier, setMultiplier] = useState(1.0);
  const [bet, setBet] = useState(10);
  const [history, setHistory] = useState<GameHistory[]>([]);

  // Estado de UX
  const [tension, setTension] = useState<TensionLevel>('STABLE');
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [cashoutHovered, setCashoutHovered] = useState(false);
  const [viewScale, setViewScale] = useState({ x: 10, y: 2 });

  // Refs para animação
  const reqRef = useRef<number | undefined>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);

  /**
   * Cancela a animação do requestAnimationFrame
   */
  const cancelAnimation = useCallback(() => {
    if (reqRef.current) {
      cancelAnimationFrame(reqRef.current);
      reqRef.current = undefined;
    }
  }, []);

  /**
   * Adiciona rodada ao histórico
   */
  const addToHistory = useCallback((val: number) => {
    setHistory((prev) =>
      [{ multiplier: val, timestamp: Date.now() }, ...prev].slice(
        0,
        HISTORY_LIMIT
      )
    );
  }, []);

  /**
   * Processa o crash do jogo
   */
  const handleCrash = useCallback(
    (finalValue: number) => {
      cancelAnimation();
      setStatus('CRASHED');
      setMultiplier(finalValue);
      addToHistory(finalValue);
      setShakeIntensity(20);
      setTimeout(() => setShakeIntensity(0), 500);
    },
    [cancelAnimation, addToHistory]
  );

  /**
   * Loop principal de animação do multiplicador
   */
  const loop = useCallback(() => {
    const now = Date.now();
    const elapsedSeconds = (now - startTimeRef.current) / 1000;
    const currentMult = Math.pow(Math.E, MULTIPLIER_GROWTH_RATE * elapsedSeconds);

    setMultiplier(currentMult);

    // Atualiza tensão e shake
    const newTension = getTensionLevel(currentMult);
    setTension(newTension);
    setShakeIntensity(calculateShakeIntensity(currentMult, newTension));

    // Atualiza escala de visualização
    setViewScale((prev) => ({
      x: Math.max(prev.x, elapsedSeconds * 1.2),
      y: Math.max(prev.y, currentMult * 1.1),
    }));

    // Verifica crash
    if (currentMult >= crashPointRef.current) {
      handleCrash(crashPointRef.current);
    } else {
      reqRef.current = requestAnimationFrame(loop);
    }
  }, [handleCrash]);

  /**
   * Inicia uma nova rodada
   */
  const startGame = useCallback(() => {
    if (engagementTokens < bet) {
      showError('VaultCoins insuficientes. Adquira ativos no Marketplace.');
      return;
    }

    // Debita tokens
    setTokens(engagementTokens - bet);

    // Reset estado
    setStatus('STARTING');
    setMultiplier(1.0);
    setViewScale({ x: 8, y: 2 });
    setTension('STABLE');
    setShakeIntensity(0);

    // Inicia jogo após delay de calibração
    setTimeout(() => {
      setStatus('FLYING');
      startTimeRef.current = Date.now();

      // Calcula ponto de crash
      const r = Math.random();
      let crash = 1.0;
      if (r > INSTANT_CRASH_PROBABILITY) {
        crash =
          Math.floor(
            100 * Math.E ** (Math.random() * Math.log(100))
          ) / 100;
        if (crash > MAX_MULTIPLIER) crash = MAX_MULTIPLIER;
        if (crash < MIN_CRASH_MULTIPLIER) crash = MIN_CRASH_MULTIPLIER;
      }
      crashPointRef.current = crash;

      // Inicia loop de animação
      reqRef.current = requestAnimationFrame(loop);
    }, GAME_START_DELAY);
  }, [engagementTokens, bet, setTokens, loop]);

  /**
   * Processa cashout do usuário
   */
  const handleCashout = useCallback(() => {
    if (status !== 'FLYING') return;
    cancelAnimation();

    const winAmount = bet * multiplier;
    setStatus('CASHOUT');
    addToHistory(multiplier);
    showSuccess(`Sincronia encerrada: +${winAmount.toFixed(0)} VC (Simulado)`);
  }, [status, cancelAnimation, bet, multiplier, addToHistory]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => cancelAnimation();
  }, [cancelAnimation]);

  return {
    // Estado
    status,
    multiplier,
    bet,
    history,
    tension,
    shakeIntensity,
    cashoutHovered,
    viewScale,
    engagementTokens,

    // Ações
    startGame,
    handleCashout,
    setBet,
    setCashoutHovered,
  };
}
