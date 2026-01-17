/**
 * @file usePlinkoPhysics.ts
 * @description Hook para física e renderização canvas do Plinko.
 * Gerencia animações, colisões, partículas e atualização visual.
 */

import { useEffect, useCallback, useRef } from 'react';
import type { ActiveBall, Particle, CanvasDimensions } from '../domain/types';
import {
  ROWS,
  PIN_RADIUS,
  BALL_RADIUS,
  GRAVITY,
  BOUNCE_DAMPING,
  HORIZONTAL_FRICTION,
  MAX_TRAIL_LENGTH,
  MULTIPLIERS,
  HIGH_MULTIPLIER_THRESHOLD,
  COLORS,
  PARTICLE_DECAY_RATE,
  PARTICLE_VELOCITY_SPREAD,
  PARTICLES_ON_PIN_HIT,
  PARTICLES_ON_SLOT_LAND,
  PIN_GLOW_DECAY,
  SLOT_GLOW_DECAY,
  INITIAL_GLOW_INTENSITY
} from '../domain/constants';

/**
 * Props do hook usePlinkoPhysics
 */
export interface UsePlinkoPhysicsProps {
  /** Referência do canvas */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Dimensões calculadas */
  dimensions: CanvasDimensions;
  /** Setter para dimensões */
  setDimensions: (dims: CanvasDimensions) => void;
  /** Referência das bolas ativas */
  ballsRef: React.MutableRefObject<ActiveBall[]>;
  /** Referência das partículas */
  particlesRef: React.MutableRefObject<Particle[]>;
  /** Referência da intensidade dos pinos */
  pinsRef: React.MutableRefObject<Map<string, number>>;
  /** Referência da intensidade dos slots */
  slotsRef: React.MutableRefObject<number[]>;
  /** Valor da aposta (para cálculo de ganho) */
  bet: number;
  /** Callback quando bola chega ao slot */
  onBallLanding: (slotIndex: number, ballX: number, ballY: number) => void;
}

/**
 * Hook para gerenciar física e renderização do jogo Plinko
 */
export function usePlinkoPhysics({
  canvasRef,
  dimensions,
  setDimensions,
  ballsRef,
  particlesRef,
  pinsRef,
  slotsRef,
  bet,
  onBallLanding
}: UsePlinkoPhysicsProps): void {
  // Ref para guardar callback atualizado
  const onBallLandingRef = useRef(onBallLanding);
  onBallLandingRef.current = onBallLanding;

  /**
   * Spawna partículas visuais em uma posição
   */
  const spawnParticles = useCallback((
    x: number,
    y: number,
    count: number,
    color: string
  ) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * PARTICLE_VELOCITY_SPREAD,
        vy: (Math.random() - 0.5) * PARTICLE_VELOCITY_SPREAD,
        life: 1.0,
        color
      });
    }
  }, [particlesRef]);

  /**
   * Desenha os pinos no canvas
   */
  const drawPins = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, spacing } = dimensions;
    const startY = spacing * 2;

    for (let row = 0; row < ROWS; row++) {
      const pinsInRow = row + 3;
      const rowWidth = (pinsInRow - 1) * spacing;
      const startX = (w - rowWidth) / 2;

      for (let col = 0; col < pinsInRow; col++) {
        const x = startX + col * spacing;
        const y = startY + row * spacing;

        const key = `${row}-${col}`;
        let intensity = pinsRef.current.get(key) || 0;

        // Desenhar glow se ativo
        if (intensity > 0) {
          ctx.beginPath();
          ctx.arc(x, y, PIN_RADIUS + (intensity * 4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.fill();
          pinsRef.current.set(key, Math.max(0, intensity - PIN_GLOW_DECAY));
        }

        // Desenhar pino
        ctx.beginPath();
        ctx.arc(x, y, PIN_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = intensity > 0.2 ? COLORS.pinActive : COLORS.pinIdle;
        ctx.fill();
      }
    }
  }, [dimensions, pinsRef]);

  /**
   * Desenha os slots de destino
   */
  const drawSlots = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, spacing } = dimensions;
    const startY = spacing * 2 + ROWS * spacing;
    const slotCount = MULTIPLIERS.length;
    const totalWidth = slotCount * spacing;
    const startX = (w - totalWidth) / 2 + (spacing / 2);

    for (let i = 0; i < slotCount; i++) {
      const x = startX + i * spacing;
      const y = startY + spacing / 2;

      const intensity = slotsRef.current[i] || 0;

      const boxW = spacing - 4;
      const boxH = 30;

      // Configurar estilo baseado na intensidade
      if (intensity > 0) {
        ctx.shadowBlur = 20 * intensity;
        ctx.shadowColor = COLORS.primary;
        ctx.fillStyle = `rgba(0, 255, 156, ${0.1 + intensity * 0.4})`;
        slotsRef.current[i] = Math.max(0, intensity - SLOT_GLOW_DECAY);
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      }

      // Desenhar caixa do slot
      ctx.beginPath();
      ctx.roundRect(x - boxW / 2, y, boxW, boxH, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cor da borda baseada no multiplicador
      const isHigh = MULTIPLIERS[i] >= HIGH_MULTIPLIER_THRESHOLD;
      const activeColor = isHigh ? COLORS.gold : COLORS.primary;
      const inactiveColor = isHigh ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255, 255, 255, 0.125)';

      ctx.strokeStyle = intensity > 0 ? activeColor : inactiveColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Texto do multiplicador
      ctx.fillStyle = isHigh ? COLORS.gold : COLORS.text;
      ctx.font = `bold ${Math.min(10, spacing / 3)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${MULTIPLIERS[i]}x`, x, y + boxH / 2);
    }
  }, [dimensions, slotsRef]);

  /**
   * Atualiza física e renderiza as bolas
   */
  const updateBalls = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, spacing } = dimensions;
    const startY = spacing * 2;

    for (let i = ballsRef.current.length - 1; i >= 0; i--) {
      const ball = ballsRef.current[i];

      const currentRow = ball.currentRow;
      const direction = ball.path[currentRow];

      const pinsInRow = currentRow + 3;
      const rowWidth = (pinsInRow - 1) * spacing;
      const rowStartX = (w - rowWidth) / 2;

      const targetY = startY + (currentRow + 1) * spacing;

      // Aplicar física
      ball.vy += GRAVITY;
      ball.y += ball.vy;
      ball.x += ball.vx;

      // Verificar colisão com pino
      if (ball.y >= targetY - PIN_RADIUS && currentRow < ROWS) {
        spawnParticles(ball.x, ball.y, PARTICLES_ON_PIN_HIT, COLORS.primary);

        const pinCol = Math.floor((ball.x - rowStartX) / spacing) + (direction > 0 ? 1 : 0);
        pinsRef.current.set(`${currentRow}-${pinCol}`, INITIAL_GLOW_INTENSITY);

        // Bounce
        ball.vy *= -BOUNCE_DAMPING;
        ball.vx += direction * (Math.random() * 0.5 + 1.5);

        ball.currentRow++;
      }

      // Atrito horizontal
      ball.vx *= HORIZONTAL_FRICTION;

      // Verificar chegada ao slot
      const slotsY = startY + ROWS * spacing;
      if (ball.y >= slotsY) {
        const finalX = ball.x;
        const slotCount = MULTIPLIERS.length;
        const totalWidth = slotCount * spacing;
        const startSlotsX = (w - totalWidth) / 2 + (spacing / 2);

        let slotIndex = Math.floor((finalX - (startSlotsX - spacing / 2)) / spacing);
        slotIndex = Math.max(0, Math.min(slotIndex, slotCount - 1));

        const multiplier = MULTIPLIERS[slotIndex];
        const particleColor = multiplier >= HIGH_MULTIPLIER_THRESHOLD ? COLORS.gold : COLORS.primary;

        spawnParticles(ball.x, ball.y, PARTICLES_ON_SLOT_LAND, particleColor);

        // Callback para processar ganho
        onBallLandingRef.current(slotIndex, ball.x, ball.y);

        // Remover bola
        ballsRef.current.splice(i, 1);
        continue;
      }

      // Atualizar trail
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > MAX_TRAIL_LENGTH) {
        ball.trail.shift();
      }

      // Renderizar trail
      ctx.beginPath();
      for (let t = 0; t < ball.trail.length - 1; t++) {
        const point = ball.trail[t];
        ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = COLORS.trailStroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Renderizar bola
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.ball;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.ball;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [dimensions, ballsRef, pinsRef, spawnParticles]);

  /**
   * Atualiza e renderiza partículas
   */
  const updateParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= PARTICLE_DECAY_RATE;

      if (p.life <= 0) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
      ctx.globalAlpha = 1;
    }
  }, [particlesRef]);

  // Effect para loop de renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPins(ctx);
      drawSlots(ctx);
      updateBalls(ctx);
      updateParticles(ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasRef, dimensions, drawPins, drawSlots, updateBalls, updateParticles]);

  // Effect para resize do canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          const w = parent.clientWidth;
          const h = parent.clientHeight;
          canvasRef.current.width = w;
          canvasRef.current.height = h;
          const maxPins = ROWS + 2;
          const spacing = Math.min(w / (maxPins + 1), h / (ROWS + 4));
          setDimensions({ w, h, spacing });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, setDimensions]);
}
