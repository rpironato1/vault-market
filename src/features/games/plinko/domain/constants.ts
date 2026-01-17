/**
 * @file constants.ts
 * @description Constantes de configuração física e visual do jogo Plinko.
 * Centraliza todos os valores configuráveis para fácil ajuste.
 */

// ============================================
// CONFIGURAÇÃO DO TABULEIRO
// ============================================

/** Número de linhas de pinos no tabuleiro */
export const ROWS = 12;

/** Raio de cada pino (em pixels) */
export const PIN_RADIUS = 3;

/** Raio da bola (em pixels) */
export const BALL_RADIUS = 5;

// ============================================
// FÍSICA
// ============================================

/** Força da gravidade aplicada por frame */
export const GRAVITY = 0.25;

/** Fator de amortecimento ao quicar (0-1, onde 1 = sem perda de energia) */
export const BOUNCE_DAMPING = 0.6;

/** Fator de atrito horizontal por frame */
export const HORIZONTAL_FRICTION = 0.98;

/** Tamanho máximo do trail (número de pontos) */
export const MAX_TRAIL_LENGTH = 10;

// ============================================
// MULTIPLICADORES DOS SLOTS
// ============================================

/**
 * Multiplicadores para cada slot de destino.
 * O índice corresponde à posição do slot (esquerda para direita).
 * Slots nas bordas têm multiplicadores maiores (maior risco).
 */
export const MULTIPLIERS: readonly number[] = [
  15, 8, 3, 1.5, 1.1, 1, 0.5, 1, 1.1, 1.5, 3, 8, 15
] as const;

/** Multiplicador mínimo para considerar "alto ganho" (cor dourada) */
export const HIGH_MULTIPLIER_THRESHOLD = 8;

// ============================================
// DESIGN TOKENS - CORES
// ============================================

/**
 * Paleta de cores baseada nos tokens Tailwind do projeto.
 * Usa rgb() para compatibilidade com ctx.fillStyle do canvas.
 */
export const COLORS = {
  /** Cor primária/accent (emerald) */
  primary: 'rgb(0, 255, 156)',

  /** Cor do pino em estado idle */
  pinIdle: 'rgb(51, 51, 51)',

  /** Cor do pino quando ativado (colisão) */
  pinActive: 'rgb(255, 255, 255)',

  /** Cor da bola */
  ball: 'rgb(0, 255, 156)',

  /** Cor do texto */
  text: 'rgb(255, 255, 255)',

  /** Cor dourada para multiplicadores altos */
  gold: 'rgb(255, 215, 0)',

  /** Cor do trail (com transparência via rgba) */
  trailStroke: 'rgba(0, 255, 156, 0.2)'
} as const;

// ============================================
// CONFIGURAÇÃO DE PARTÍCULAS
// ============================================

/** Taxa de decaimento da vida das partículas por frame */
export const PARTICLE_DECAY_RATE = 0.02;

/** Velocidade máxima inicial das partículas */
export const PARTICLE_VELOCITY_SPREAD = 4;

/** Número de partículas em colisão com pino */
export const PARTICLES_ON_PIN_HIT = 5;

/** Número de partículas ao entrar no slot */
export const PARTICLES_ON_SLOT_LAND = 20;

// ============================================
// CONFIGURAÇÃO DE ILUMINAÇÃO
// ============================================

/** Taxa de decaimento da iluminação dos pinos */
export const PIN_GLOW_DECAY = 0.05;

/** Taxa de decaimento da iluminação dos slots */
export const SLOT_GLOW_DECAY = 0.05;

/** Intensidade de glow inicial ao colidir */
export const INITIAL_GLOW_INTENSITY = 1;

// ============================================
// VALORES DE APOSTA PREDEFINIDOS
// ============================================

/** Opções rápidas de aposta em VaultCoins */
export const BET_PRESETS: readonly number[] = [10, 50, 100, 500] as const;

/** Aposta padrão inicial */
export const DEFAULT_BET = 10;
