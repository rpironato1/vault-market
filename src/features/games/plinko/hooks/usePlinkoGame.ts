/**
 * @file usePlinkoGame.ts
 * @description Hook principal para lógica do jogo Plinko.
 * Gerencia estado do jogo, drops de bolas e cálculo de scores.
 */

import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@infra/state/store';
import { showSuccess, showError } from '@/utils/toast';
import type { ActiveBall, Particle, CanvasDimensions } from '../domain/types';
import {
  ROWS,
  MULTIPLIERS,
  DEFAULT_BET
} from '../domain/constants';

/**
 * Retorno do hook usePlinkoGame
 */
export interface UsePlinkoGameReturn {
  /** Valor atual da aposta */
  bet: number;
  /** Setter para aposta */
  setBet: (value: number) => void;
  /** Som habilitado */
  soundEnabled: boolean;
  /** Toggle som */
  toggleSound: () => void;
  /** Último ganho */
  lastWin: number | null;
  /** Dimensões do canvas */
  dimensions: CanvasDimensions;
  /** Setter para dimensões */
  setDimensions: (dims: CanvasDimensions) => void;
  /** Referência para bolas ativas */
  ballsRef: React.MutableRefObject<ActiveBall[]>;
  /** Referência para partículas */
  particlesRef: React.MutableRefObject<Particle[]>;
  /** Referência para intensidade dos pinos */
  pinsRef: React.MutableRefObject<Map<string, number>>;
  /** Referência para intensidade dos slots */
  slotsRef: React.MutableRefObject<number[]>;
  /** Dropar uma nova bola */
  dropBall: () => void;
  /** Processar chegada da bola ao slot */
  handleBallLanding: (slotIndex: number) => void;
}

/**
 * Hook para gerenciar o estado e lógica do jogo Plinko
 * @returns Objeto com estado, refs e funções do jogo
 */
export function usePlinkoGame(): UsePlinkoGameReturn {
  const { engagementTokens, setTokens } = useStore();
  const navigate = useNavigate();

  // Estado do jogo
  const [bet, setBet] = useState<number>(DEFAULT_BET);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<CanvasDimensions>({ w: 0, h: 0, spacing: 0 });

  // Referências mutáveis para performance (evita re-renders)
  const ballsRef = useRef<ActiveBall[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const pinsRef = useRef<Map<string, number>>(new Map());
  const slotsRef = useRef<number[]>(new Array(MULTIPLIERS.length).fill(0));

  /**
   * Toggle do som
   */
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  /**
   * Gera o caminho aleatório para a bola
   * Cada elemento é -0.5 ou 0.5 indicando direção
   */
  const generateBallPath = useCallback((): number[] => {
    const path: number[] = [];
    for (let i = 0; i < ROWS; i++) {
      const dir = Math.random() > 0.5 ? 0.5 : -0.5;
      path.push(dir);
    }
    return path;
  }, []);

  /**
   * Dropa uma nova bola no tabuleiro
   * Valida saldo, debita aposta e cria bola com path aleatório
   */
  const dropBall = useCallback(() => {
    // Validar saldo
    if (engagementTokens < bet) {
      showError("Voce nao possui VaultCoins suficientes. Compre NFTs para ganhar VaultCoins.");
      setTimeout(() => navigate('/marketplace'), 2000);
      return;
    }

    // Debitar aposta
    setTokens(engagementTokens - bet);

    // Gerar path aleatório
    const path = generateBallPath();

    // Calcular posição inicial
    const { w, spacing } = dimensions;
    const startX = w / 2;
    const startY = spacing;

    // Criar nova bola
    const newBall: ActiveBall = {
      id: Date.now(),
      x: startX + (Math.random() - 0.5) * 2,
      y: startY,
      vx: 0,
      vy: 0,
      path,
      currentRow: 0,
      trail: []
    };

    ballsRef.current.push(newBall);
  }, [bet, dimensions, engagementTokens, generateBallPath, navigate, setTokens]);

  /**
   * Processa a chegada de uma bola a um slot
   * @param slotIndex Índice do slot (0 a MULTIPLIERS.length - 1)
   */
  const handleBallLanding = useCallback((slotIndex: number) => {
    const multiplier = MULTIPLIERS[slotIndex];
    const win = bet * multiplier;

    // Ativar glow do slot
    slotsRef.current[slotIndex] = 1;

    // Mostrar ganho se multiplier >= 1
    if (multiplier >= 1) {
      showSuccess(`+${win.toFixed(0)} VC`);
      setLastWin(win);
    }
  }, [bet]);

  return {
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
  };
}
