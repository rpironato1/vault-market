"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Coins, ArrowDown, Zap, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '@/_infrastructure/state/store';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

// --- CONFIGURAÇÃO FÍSICA E VISUAL ---
const ROWS = 12; // Aumentado para mais tempo de queda (tensão)
const PIN_RADIUS = 3;
const BALL_RADIUS = 5;
const GRAVITY = 0.25;
const BOUNCE_DAMPING = 0.6;
const MULTIPLIERS = [15, 8, 3, 1.5, 1.1, 1, 0.5, 1, 1.1, 1.5, 3, 8, 15];

// Cores
const COLORS = {
  primary: '#00FF9C',
  pinIdle: '#333',
  pinActive: '#FFFFFF',
  ball: '#00FF9C',
  text: '#FFFFFF'
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ActiveBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  path: number[]; // Índices dos caminhos (0 = esq, 1 = dir)
  currentRow: number;
  trail: {x: number, y: number}[];
}

const GravityPlinko = () => {
  const { balance, updateBalance } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // -- Game State --
  const [bet, setBet] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastWin, setLastWin] = useState<number | null>(null);
  
  // -- Physics State (Refs para performance no loop) --
  const ballsRef = useRef<ActiveBall[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const pinsRef = useRef<Map<string, number>>(new Map()); // Key: "row-col", Value: HitIntensity (0-1)
  const slotsRef = useRef<number[]>(new Array(MULTIPLIERS.length).fill(0)); // HitIntensity para os slots
  
  // -- Dimensões Calculadas --
  const [dimensions, setDimensions] = useState({ w: 0, h: 0, spacing: 0 });

  // 1. Inicialização do Canvas e Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!canvas || !ctx) return;
      
      // Limpar Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Renderizar Pinos
      drawPins(ctx);
      
      // 2. Renderizar Slots (Multiplicadores)
      drawSlots(ctx);

      // 3. Atualizar e Renderizar Bolas
      updateBalls(ctx);

      // 4. Atualizar e Renderizar Partículas
      updateParticles(ctx);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  // Observer para redimensionamento responsivo
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          const w = parent.clientWidth;
          const h = parent.clientHeight;
          canvasRef.current.width = w;
          canvasRef.current.height = h;
          
          // Calcular espaçamento baseado na largura e número de linhas
          // O topo da pirâmide tem 3 pinos (exemplo), a base tem ROWS + 2
          const maxPins = ROWS + 2;
          const spacing = Math.min(w / (maxPins + 1), h / (ROWS + 4));
          
          setDimensions({ w, h, spacing });
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- LÓGICA DE RENDERIZAÇÃO ---

  const drawPins = (ctx: CanvasRenderingContext2D) => {
    const { w, spacing } = dimensions;
    const startY = spacing * 2; // Margem superior

    for (let row = 0; row < ROWS; row++) {
      const pinsInRow = row + 3; // Começando com 3 pinos no topo para abrir o leque
      const rowWidth = (pinsInRow - 1) * spacing;
      const startX = (w - rowWidth) / 2;

      for (let col = 0; col < pinsInRow; col++) {
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        
        // Efeito de Colisão (Glow)
        const key = `${row}-${col}`;
        let intensity = pinsRef.current.get(key) || 0;
        
        if (intensity > 0) {
          ctx.beginPath();
          ctx.arc(x, y, PIN_RADIUS + (intensity * 4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.fill();
          // Decay do brilho
          pinsRef.current.set(key, Math.max(0, intensity - 0.05));
        }

        ctx.beginPath();
        ctx.arc(x, y, PIN_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = intensity > 0.2 ? COLORS.pinActive : COLORS.pinIdle;
        ctx.fill();
      }
    }
  };

  const drawSlots = (ctx: CanvasRenderingContext2D) => {
    const { w, spacing } = dimensions;
    const startY = spacing * 2 + ROWS * spacing;
    const slotCount = MULTIPLIERS.length;
    const totalWidth = slotCount * spacing;
    const startX = (w - totalWidth) / 2 + (spacing / 2);

    for (let i = 0; i < slotCount; i++) {
      const x = startX + i * spacing;
      const y = startY + spacing / 2;
      
      const intensity = slotsRef.current[i] || 0;
      
      // Box do Slot
      const boxW = spacing - 4;
      const boxH = 30;
      
      // Efeito "Hit" no slot
      if (intensity > 0) {
        ctx.shadowBlur = 20 * intensity;
        ctx.shadowColor = COLORS.primary;
        ctx.fillStyle = `rgba(0, 255, 156, ${0.1 + intensity * 0.4})`;
        slotsRef.current[i] = Math.max(0, intensity - 0.05);
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      }

      // Desenhar o container do multiplicador
      ctx.beginPath();
      ctx.roundRect(x - boxW/2, y, boxW, boxH, 6);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      // Borda baseada na raridade
      const isHigh = MULTIPLIERS[i] >= 8;
      ctx.strokeStyle = isHigh ? (intensity > 0 ? '#FFD700' : '#FFD70040') : (intensity > 0 ? '#00FF9C' : '#FFFFFF20');
      ctx.lineWidth = 1;
      ctx.stroke();

      // Texto
      ctx.fillStyle = isHigh ? '#FFD700' : '#FFFFFF';
      ctx.font = `bold ${Math.min(10, spacing/3)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${MULTIPLIERS[i]}x`, x, y + boxH/2);
    }
  };

  const updateBalls = (ctx: CanvasRenderingContext2D) => {
    const { w, spacing } = dimensions;
    const startY = spacing * 2;

    // Iterar ao contrário para poder remover elementos
    for (let i = ballsRef.current.length - 1; i >= 0; i--) {
      const ball = ballsRef.current[i];
      
      // Física simplificada guiada pelo caminho
      // A bola não usa física 100% real para garantir que ela caia no slot determinado pelo RNG.
      // Usamos uma interpolação com "noise" para parecer física.

      // Detectar alvo atual (próximo pino ou slot)
      const currentRow = ball.currentRow;
      const direction = ball.path[currentRow]; // -0.5 (esq) ou 0.5 (dir)
      
      // Calcular posições alvo
      const pinsInRow = currentRow + 3;
      const rowWidth = (pinsInRow - 1) * spacing;
      const rowStartX = (w - rowWidth) / 2;
      
      // Posição Y do próximo pino/linha
      const targetY = startY + (currentRow + 1) * spacing;
      
      // Gravidade simples
      ball.vy += GRAVITY;
      ball.y += ball.vy;
      ball.x += ball.vx;

      // Colisão com "chão virtual" de cada linha para decidir o bounce
      if (ball.y >= targetY - PIN_RADIUS && currentRow < ROWS) {
        // Colisão com o pino!
        spawnParticles(ball.x, ball.y, 5, COLORS.primary);
        
        // Identificar qual pino bateu para acender
        // Lógica aproximada para encontrar o pino mais próximo no grid visual
        const pinIndexEstimate = Math.round((ball.x - rowStartX) / spacing);
        const nextPinX = rowStartX + (pinIndexEstimate + (direction > 0 ? 0.5 : -0.5)) * spacing; 
        
        // Acender pino
        // Precisamos saber o índice exato do pino na linha atual para a chave do Map
        // Isso é complexo calcular reverso, então vamos acender visualmente por proximidade se necessário
        // Simplificação: Acender o pino que "empurrou" a bola
        pinsRef.current.set(`${currentRow}-${Math.floor((ball.x - rowStartX)/spacing) + (direction > 0 ? 1 : 0)}`, 1);

        // Física do Rebote
        ball.vy *= -BOUNCE_DAMPING; // Perde energia Y
        ball.vx += direction * (Math.random() * 0.5 + 1.5); // Ganha impulso X na direção do caminho
        
        ball.currentRow++; // Avança para próxima linha lógica
      }

      // Atrito lateral
      ball.vx *= 0.98;

      // Limite inferior (Slot)
      const slotsY = startY + ROWS * spacing;
      if (ball.y >= slotsY) {
        // Bola chegou no slot!
        const finalX = ball.x;
        // Calcular índice do slot baseado no X
        const slotCount = MULTIPLIERS.length;
        const totalWidth = slotCount * spacing;
        const startSlotsX = (w - totalWidth) / 2 + (spacing / 2);
        
        let slotIndex = Math.floor((finalX - (startSlotsX - spacing/2)) / spacing);
        slotIndex = Math.max(0, Math.min(slotIndex, slotCount - 1));

        // Efeitos de Finalização
        const multiplier = MULTIPLIERS[slotIndex];
        const win = bet * multiplier;
        
        slotsRef.current[slotIndex] = 1; // Acender slot
        spawnParticles(ball.x, ball.y, 20, multiplier >= 8 ? '#FFD700' : '#00FF9C');
        
        if (multiplier >= 1) {
          showSuccess(`+$${win.toFixed(2)} (${multiplier}x)`);
          updateBalance(win);
          setLastWin(win);
        }

        // Remover bola
        ballsRef.current.splice(i, 1);
        continue;
      }

      // --- Desenhar Bola ---
      
      // Rastro (Trail)
      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > 10) ball.trail.shift();

      ctx.beginPath();
      for (let t = 0; t < ball.trail.length - 1; t++) {
        const point = ball.trail[t];
        ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = `rgba(0, 255, 156, 0.2)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corpo
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.ball;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.ball;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset para performance
    }
  };

  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;

      if (p.life <= 0) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
      ctx.globalAlpha = 1;
    }
  };

  const spawnParticles = (x: number, y: number, count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
        color
      });
    }
  };

  // --- LÓGICA DO JOGO ---

  const dropBall = () => {
    if (balance < bet) {
      showError("Saldo insuficiente.");
      return;
    }
    updateBalance(-bet);

    // Calcular caminho determinístico
    // O caminho é uma série de -1 (esquerda) e 1 (direita)
    const path: number[] = [];
    let currentXIndex = 0; // Índice relativo ao centro
    
    for (let i = 0; i < ROWS; i++) {
      // 50/50 chance, mas podemos viciar levemente para o centro se quisermos
      const dir = Math.random() > 0.5 ? 0.5 : -0.5;
      path.push(dir);
      currentXIndex += dir;
    }

    // Posição Inicial
    const { w, spacing } = dimensions;
    const startX = w / 2; // Topo central
    const startY = spacing;

    ballsRef.current.push({
      id: Date.now(),
      x: startX + (Math.random() - 0.5) * 2, // Leve jitter inicial
      y: startY,
      vx: 0,
      vy: 0,
      path,
      currentRow: 0,
      trail: []
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-[700px]">
      
      {/* --- Controles --- */}
      <div className="bg-[#09090b] rounded-[32px] border border-white/5 p-8 flex flex-col justify-between shadow-2xl relative z-20">
        <div className="space-y-6">
          <header>
             <div className="flex items-center gap-2 mb-2">
               <Database className="text-[#00FF9C] h-4 w-4" />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gravity Protocol</span>
            </div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter">PLINKO</h2>
          </header>

          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Carga de Entrada</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input 
                 type="number" 
                 value={bet}
                 onChange={(e) => setBet(Number(e.target.value))}
                 className="col-span-2 bg-[#121212] border border-white/10 rounded-xl h-12 px-4 font-mono text-white outline-none focus:border-[#00FF9C]"
              />
              {[10, 50, 100, 500].map(v => (
                <button key={v} onClick={() => setBet(v)} className="h-10 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-zinc-400 border border-white/5 hover:border-white/20 transition-all">
                  ${v}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5">
             <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] font-bold text-zinc-500 uppercase">Último Ganho</span>
               <span className="text-[#00FF9C] font-mono font-bold">${lastWin?.toFixed(2) || '0.00'}</span>
             </div>
             <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
               <motion.div 
                 key={lastWin}
                 initial={{ width: '0%' }}
                 animate={{ width: '100%', opacity: 0 }}
                 transition={{ duration: 1 }}
                 className="h-full bg-[#00FF9C]"
               />
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={dropBall} 
            className="w-full h-20 bg-[#00FF9C] text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_40px_rgba(0,255,156,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2"><Coins size={24} fill="currentColor" /> SOLTAR UNIDADE</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {soundEnabled ? 'ÁUDIO ATIVO' : 'ÁUDIO MUDO'}
          </button>
        </div>
      </div>

      {/* --- Área do Jogo (Canvas) --- */}
      <div className="lg:col-span-2 bg-[#050505] rounded-[40px] border border-white/5 relative overflow-hidden flex flex-col p-4 shadow-inner">
        {/* Decoração de Fundo */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, #00FF9C 1px, transparent 1px)', 
            backgroundSize: '30px 30px'
          }} 
        />
        
        {/* Spawn Point Visual */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-[#121212] rounded-b-3xl border-b border-x border-white/10 flex items-center justify-center z-10 shadow-lg">
           <ArrowDown className="text-[#00FF9C] animate-bounce" size={20} />
        </div>

        <canvas 
          ref={canvasRef}
          className="w-full h-full relative z-0"
        />
      </div>
    </div>
  );
};

export default GravityPlinko;