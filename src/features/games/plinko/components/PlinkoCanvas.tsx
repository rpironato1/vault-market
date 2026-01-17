/**
 * @file PlinkoCanvas.tsx
 * @description Componente do canvas do jogo Plinko.
 * Renderiza a area de jogo com decoracoes visuais.
 */

"use client";

import { ArrowDown } from 'lucide-react';
import type { PlinkoCanvasProps } from '../domain/types';

/**
 * Componente do canvas do Plinko
 * Renderiza a area de jogo com grid decorativo e indicador de drop
 */
export function PlinkoCanvas({ canvasRef }: PlinkoCanvasProps): JSX.Element {
  return (
    <div className="lg:col-span-2 bg-surface-black rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col p-4 shadow-inner">
      {/* Grid decorativo de fundo */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgb(0, 255, 156) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Indicador de drop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-surface-card rounded-b-3xl border-b border-x border-white/10 flex items-center justify-center z-10 shadow-lg">
        <ArrowDown className="text-accent-emerald animate-bounce" size={20} />
      </div>

      {/* Canvas principal */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-0"
      />
    </div>
  );
}

export default PlinkoCanvas;
