/**
 * @file types.ts
 * @description Tipos e interfaces para o jogo Plinko
 * Contém todas as definições de tipos para estado do jogo,
 * física, partículas e elementos visuais.
 */

/**
 * Representa uma partícula visual para efeitos de colisão/landing
 */
export interface Particle {
  /** Posição X da partícula */
  x: number;
  /** Posição Y da partícula */
  y: number;
  /** Velocidade horizontal */
  vx: number;
  /** Velocidade vertical */
  vy: number;
  /** Tempo de vida restante (0-1) */
  life: number;
  /** Cor da partícula */
  color: string;
}

/**
 * Representa uma bola ativa em queda no tabuleiro
 */
export interface ActiveBall {
  /** Identificador único da bola */
  id: number;
  /** Posição X atual */
  x: number;
  /** Posição Y atual */
  y: number;
  /** Velocidade horizontal */
  vx: number;
  /** Velocidade vertical */
  vy: number;
  /** Caminho pré-determinado de direções (-0.5 ou 0.5 para cada row) */
  path: number[];
  /** Linha atual onde a bola está */
  currentRow: number;
  /** Histórico de posições para renderizar trail */
  trail: TrailPoint[];
}

/**
 * Ponto do rastro visual da bola
 */
export interface TrailPoint {
  x: number;
  y: number;
}

/**
 * Dimensões calculadas do canvas e espaçamento
 */
export interface CanvasDimensions {
  /** Largura do canvas */
  w: number;
  /** Altura do canvas */
  h: number;
  /** Espaçamento entre pinos */
  spacing: number;
}

/**
 * Estado do jogo Plinko
 */
export interface PlinkoGameState {
  /** Valor da aposta atual */
  bet: number;
  /** Som habilitado */
  soundEnabled: boolean;
  /** Último ganho */
  lastWin: number | null;
  /** Dimensões do canvas */
  dimensions: CanvasDimensions;
}

/**
 * Referências mutáveis do jogo
 */
export interface PlinkoGameRefs {
  /** Array de bolas ativas */
  balls: ActiveBall[];
  /** Array de partículas visuais */
  particles: Particle[];
  /** Mapa de intensidade de iluminação dos pinos (chave: "row-col") */
  pins: Map<string, number>;
  /** Array de intensidade de iluminação dos slots */
  slots: number[];
}

/**
 * Props para componentes visuais do Plinko
 */
export interface PlinkoPanelProps {
  /** Valor da aposta */
  bet: number;
  /** Setter para valor da aposta */
  setBet: (value: number) => void;
  /** Último ganho */
  lastWin: number | null;
  /** Som habilitado */
  soundEnabled: boolean;
  /** Toggle de som */
  toggleSound: () => void;
  /** Callback para dropar bola */
  onDropBall: () => void;
}

/**
 * Props do componente Canvas do Plinko
 */
export interface PlinkoCanvasProps {
  /** Referência do canvas */
  canvasRef: React.RefObject<HTMLCanvasElement>;
}
