"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Diamond, ShieldCheck, Play, StopCircle } from 'lucide-react'; 
import { showSuccess, showError } from '@/utils/toast';
import { useStore } from '@infra/state/store'; // Importando store refatorada
import { MockBackend } from '@infra/api/mock-backend'; // Backend simulado
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const GRID_SIZE = 25;
const MINES_OPTIONS = [1, 3, 5, 10, 15];

const DataSyncGame = () => {
  const { engagementTokens, setTokens } = useStore(); 
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [grid, setGrid] = useState<('IDLE' | 'SAFE' | 'MINE')[]>(new Array(GRID_SIZE).fill('IDLE'));
  const [gameId, setGameId] = useState<string | null>(null);
  
  const [bet, setBet] = useState(10);
  const [minesCount, setMinesCount] = useState(3);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [potentialWin, setPotentialWin] = useState(0);

  const startGame = async () => {
    if (engagementTokens < bet) {
      showError("Você não possui VaultCoins suficientes. Compre NFTs para ganhar VaultCoins.");
      setTimeout(() => navigate('/marketplace'), 2000);
      return;
    }

    setIsLoading(true);
    try {
      const session = await MockBackend.startMines(bet, minesCount);
      
      setTokens(session.balanceAfterWager);
      setGameId(session.gameId);
      
      setGrid(new Array(GRID_SIZE).fill('IDLE'));
      setCurrentMultiplier(1.0);
      setPotentialWin(bet);
      setIsPlaying(true);
      setIsGameOver(false);
      
    } catch (e) {
      showError("Erro ao iniciar sessão.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTileClick = async (index: number) => {
    if (!isPlaying || isGameOver || isLoading || grid[index] !== 'IDLE' || !gameId) return;

    try {
      const result = await MockBackend.revealMines(gameId, index);
      
      if (result.status === 'MINE') {
        setGrid(prev => {
          const next = [...prev];
          next[index] = 'MINE';
          return next;
        });
        setIsGameOver(true);
        setIsPlaying(false);
        showError("FALHA DE SINCRONIA: Dados Corrompidos.");
      } else {
        setGrid(prev => {
          const next = [...prev];
          next[index] = 'SAFE';
          return next;
        });
        setCurrentMultiplier(result.currentMultiplier);
        setPotentialWin(result.potentialReward);
      }
    } catch (e) {
      showError("Erro de comunicação com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const cashOut = async () => {
    if (!gameId || isGameOver) return;
    
    setIsLoading(true);
    try {
      const result = await MockBackend.cashoutMines(gameId);
      
      setTokens(result.newBalance); 
      
      showSuccess(`Sincronia Concluída! +${result.totalPayout} VC`);
      setIsPlaying(false);
      setIsGameOver(true);
      
    } catch (e) {
      showError("Erro ao realizar cashout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[600px]">
      <div className="lg:col-span-4 bg-surface-card rounded-xl border border-white/10 p-6 flex flex-col gap-6 h-full shadow-xl relative z-20">
        <header className="mb-2">
          <div className="flex items-center gap-2 mb-2 opacity-50">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Protocolo de Segurança</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Validação de Blocos</h2>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Alocação (VaultCoins)</label>
            <div className="relative group">
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                disabled={isPlaying || isLoading}
                className="w-full bg-surface-input border border-white/10 rounded-lg h-12 pl-4 pr-4 font-mono text-sm text-white focus:border-accent-emerald outline-none disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => !isPlaying && setBet(val)}
                  disabled={isPlaying || isLoading}
                  className="h-8 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-mono text-zinc-400 transition-colors disabled:opacity-30"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Complexidade (Minas)</label>
            <div className="grid grid-cols-5 gap-2">
              {MINES_OPTIONS.map(count => (
                <button
                  key={count}
                  onClick={() => !isPlaying && setMinesCount(count)}
                  disabled={isPlaying || isLoading}
                  className={cn(
                    "h-10 rounded-lg border text-xs font-bold transition-all disabled:opacity-50",
                    minesCount === count
                      ? "bg-accent-emerald/10 border-accent-emerald text-accent-emerald"
                      : "bg-surface-card border-white/5 text-zinc-500 hover:border-white/20"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-end">
             <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Eficiência</span>
             <span className={cn("text-3xl font-mono font-bold tracking-tighter", isPlaying ? "text-accent-emerald" : "text-zinc-600")}>
               {currentMultiplier.toFixed(2)}x
             </span>
          </div>
          <div className="flex justify-between items-end">
             <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Acumulado</span>
             <span className={cn("text-lg font-mono font-medium", isPlaying ? "text-white" : "text-zinc-600")}>
               {potentialWin.toFixed(0)} VC
             </span>
          </div>
        </div>

        <div>
          {!isPlaying ? (
            <button
              onClick={startGame}
              disabled={isLoading}
              className="w-full bg-accent-emerald text-black h-14 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-accent-emerald-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando...' : <><Play size={16} fill="currentColor" /> Iniciar Validação</>}
            </button>
          ) : (
            <button 
              onClick={cashOut}
              disabled={isLoading || isGameOver}
              className="w-full bg-white text-black h-14 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Processando...' : <><StopCircle size={18} /> Consolidar Dados</>}
            </button>
          )}
        </div>
      </div>

      <div className="lg:col-span-8 h-full bg-surface-black rounded-xl border border-white/5 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="grid grid-cols-5 gap-3 w-full max-w-[500px] aspect-square relative z-10">
          {grid.map((status, i) => (
            <motion.button
              key={i}
              whileHover={status === 'IDLE' && isPlaying ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
              whileTap={status === 'IDLE' && isPlaying ? { scale: 0.96 } : {}}
              onClick={() => handleTileClick(i)}
              disabled={!isPlaying || status !== 'IDLE'}
              className={cn(
                "relative rounded-lg flex items-center justify-center transition-all duration-200 border",
                status === 'IDLE' && "bg-surface-card border-white/5 cursor-pointer disabled:cursor-default",
                status === 'SAFE' && "bg-accent-emerald/5 border-accent-emerald/30 cursor-default",
                status === 'MINE' && "bg-red-500/10 border-red-500/30 cursor-default shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]",
                !isPlaying && status === 'IDLE' && "opacity-40"
              )}
            >
              <AnimatePresence mode="popLayout">
                {status === 'SAFE' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Diamond size={24} fill="currentColor" className="text-accent-emerald drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]" />
                  </motion.div>
                )}
                
                {status === 'MINE' && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Bomb size={24} fill="currentColor" className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSyncGame;