/**
 * @file usePlinkoPhysics.ts
 * @description Hook para fisica e loop de animacao do Plinko.
 * Gerencia colisoes, movimento das bolas e resize do canvas.
 */

import { useEffect, useCallback, useRef } from 'react';
import type { ActiveBall, Particle, CanvasDimensions } from '../domain/types';
import { usePlinkoRenderer } from './usePlinkoRenderer';
import {
  ROWS,
  PIN_RADIUS,
  GRAVITY,
  BOUNCE_DAMPING,
  HORIZONTAL_FRICTION,
  MULTIPLIERS,
  HIGH_MULTIPLIER_THRESHOLD,
  COLORS,
  PARTICLE_VELOCITY_SPREAD,
  PARTICLES_ON_PIN_HIT,
  PARTICLES_ON_SLOT_LAND,
  INITIAL_GLOW_INTENSITY
} from '../domain/constants';

/**
 * Props do hook usePlinkoPhysics
 */
export interface UsePlinkoPhysicsProps {
  /** Referencia do canvas */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Dimensoes calculadas */
  dimensions: CanvasDimensions;
  /** Setter para dimensoes */
  setDimensions: (dims: CanvasDimensions) => void;
  /** Referencia das bolas ativas */
  ballsRef: React.MutableRefObject<ActiveBall[]>;
  /** Referencia das particulas */
  particlesRef: React.MutableRefObject<Particle[]>;
  /** Referencia da intensidade dos pinos */
  pinsRef: React.MutableRefObject<Map<string, number>>;
  /** Referencia da intensidade dos slots */
  slotsRef: React.MutableRefObject<number[]>;
  /** Valor da aposta (para calculo de ganho) */
  bet: number;
  /** Callback quando bola chega ao slot */
  onBallLanding: (slotIndex: number, ballX: number, ballY: number) => void;
}

/**
 * Hook para gerenciar fisica e animacao do jogo Plinko
 */
export function usePlinkoPhysics({
  canvasRef,
  dimensions,
  setDimensions,
  ballsRef,
  particlesRef,
  pinsRef,
  slotsRef,
  onBallLanding
}: UsePlinkoPhysicsProps): void {
  // Ref para callback atualizado
  const onBallLandingRef = useRef(onBallLanding);
  onBallLandingRef.current = onBallLanding;

  // Hook de renderizacao
  const { drawPins, drawSlots, renderBalls, updateParticles } = usePlinkoRenderer({
    dimensions,
    pinsRef,
    slotsRef,
    ballsRef,
    particlesRef
  });

  /**
   * Spawna particulas visuais em uma posicao
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
   * Atualiza fisica das bolas (movimento, colisao, landing)
   */
  const updateBallsPhysics = useCallback(() => {
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

      // Aplicar fisica
      ball.vy += GRAVITY;
      ball.y += ball.vy;
      ball.x += ball.vx;

      // Verificar colisao com pino
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
      }
    }
  }, [dimensions, ballsRef, pinsRef, spawnParticles]);

  // Effect para loop de renderizacao
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
      updateBallsPhysics();
      renderBalls(ctx);
      updateParticles(ctx);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasRef, dimensions, drawPins, drawSlots, updateBallsPhysics, renderBalls, updateParticles]);

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
