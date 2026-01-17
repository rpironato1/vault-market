/**
 * @file usePlinkoRenderer.ts
 * @description Hook para renderizacao visual do Plinko.
 * Gerencia desenho de pinos, slots, bolas e particulas no canvas.
 */

import { useCallback } from 'react';
import type { ActiveBall, Particle, CanvasDimensions } from '../domain/types';
import {
  ROWS,
  PIN_RADIUS,
  BALL_RADIUS,
  MULTIPLIERS,
  HIGH_MULTIPLIER_THRESHOLD,
  COLORS,
  MAX_TRAIL_LENGTH,
  PIN_GLOW_DECAY,
  SLOT_GLOW_DECAY,
  PARTICLE_DECAY_RATE
} from '../domain/constants';

/**
 * Props do hook usePlinkoRenderer
 */
export interface UsePlinkoRendererProps {
  /** Dimensoes do canvas */
  dimensions: CanvasDimensions;
  /** Referencia da intensidade dos pinos */
  pinsRef: React.MutableRefObject<Map<string, number>>;
  /** Referencia da intensidade dos slots */
  slotsRef: React.MutableRefObject<number[]>;
  /** Referencia das bolas ativas */
  ballsRef: React.MutableRefObject<ActiveBall[]>;
  /** Referencia das particulas */
  particlesRef: React.MutableRefObject<Particle[]>;
}

/**
 * Retorno do hook usePlinkoRenderer
 */
export interface UsePlinkoRendererReturn {
  /** Desenha os pinos no canvas */
  drawPins: (ctx: CanvasRenderingContext2D) => void;
  /** Desenha os slots de destino */
  drawSlots: (ctx: CanvasRenderingContext2D) => void;
  /** Renderiza as bolas (sem fisica) */
  renderBalls: (ctx: CanvasRenderingContext2D) => void;
  /** Atualiza e renderiza particulas */
  updateParticles: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Hook para funcoes de renderizacao do Plinko
 */
export function usePlinkoRenderer({
  dimensions,
  pinsRef,
  slotsRef,
  ballsRef,
  particlesRef
}: UsePlinkoRendererProps): UsePlinkoRendererReturn {
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
   * Renderiza as bolas (trail e bola) - sem fisica
   */
  const renderBalls = useCallback((ctx: CanvasRenderingContext2D) => {
    for (const ball of ballsRef.current) {
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
  }, [ballsRef]);

  /**
   * Atualiza e renderiza particulas
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

  return {
    drawPins,
    drawSlots,
    renderBalls,
    updateParticles
  };
}
