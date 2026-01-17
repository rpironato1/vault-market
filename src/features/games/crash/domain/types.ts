/**
 * Tipos e interfaces do domínio do jogo Crash
 * Arquivo: domain/types.ts
 *
 * Define os tipos fundamentais para o estado do jogo,
 * histórico e fases de tensão visual.
 */

/**
 * Estados possíveis do jogo Crash
 * - IDLE: Aguardando início
 * - STARTING: Calibrando/iniciando
 * - FLYING: Jogo em andamento
 * - CRASHED: Multiplicador crashou
 * - CASHOUT: Usuário efetuou cashout com sucesso
 */
export type GameStatus = 'IDLE' | 'STARTING' | 'FLYING' | 'CRASHED' | 'CASHOUT';

/**
 * Níveis de tensão visual do jogo
 * Usados para alterar cores e efeitos conforme o multiplicador sobe
 */
export type TensionLevel = 'STABLE' | 'HEATING' | 'CRITICAL';

/**
 * Registro de histórico de uma rodada
 */
export interface GameHistory {
  /** Multiplicador final da rodada */
  multiplier: number;
  /** Timestamp da rodada */
  timestamp: number;
}

/**
 * Configuração de fase de tensão
 * Define threshold, cores e efeitos para cada nível
 */
export interface TensionPhase {
  /** Multiplicador mínimo para ativar esta fase */
  threshold: number;
  /** Classe Tailwind para cor do texto */
  colorClass: string;
  /** Cor RGB para efeitos dinâmicos */
  color: string;
  /** Cor de sombra para glow effects */
  shadow: string;
}

/**
 * Estado do jogo retornado pelo hook useCrashGame
 */
export interface CrashGameState {
  status: GameStatus;
  multiplier: number;
  bet: number;
  history: GameHistory[];
  tension: TensionLevel;
  shakeIntensity: number;
  cashoutHovered: boolean;
  viewScale: { x: number; y: number };
  engagementTokens: number;
}

/**
 * Ações disponíveis no hook useCrashGame
 */
export interface CrashGameActions {
  startGame: () => void;
  handleCashout: () => void;
  setBet: (value: number) => void;
  setCashoutHovered: (value: boolean) => void;
}

/**
 * Props para o componente CrashControlPanel
 */
export interface CrashControlPanelProps {
  status: GameStatus;
  bet: number;
  multiplier: number;
  tension: TensionLevel;
  history: GameHistory[];
  cashoutHovered: boolean;
  currentColor: string;
  onBetChange: (value: number) => void;
  onStartGame: () => void;
  onCashout: () => void;
  onCashoutHoverChange: (hovered: boolean) => void;
}

/**
 * Props para o componente CrashDisplay
 */
export interface CrashDisplayProps {
  status: GameStatus;
  multiplier: number;
  tension: TensionLevel;
  shakeIntensity: number;
  currentColor: string;
  pathData: string;
  areaData: string;
  safeX: number;
  safeY: number;
  rotation: number;
}

/**
 * Props para o componente CrashHistory
 */
export interface CrashHistoryProps {
  history: GameHistory[];
}
