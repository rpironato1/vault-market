import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { Terminal, Pause, Play, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  source: string;
  message: string;
}

const AdminLivePage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateLog = () => {
      if (isPaused) return;

      const sources = ['PAYMENT_GATEWAY', 'GAME_ENGINE', 'AUTH_SERVICE', 'RISK_ENGINE', 'API_GATEWAY'];
      const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'SUCCESS', 'WARN'];
      const messages = [
        'Validating block hash...',
        'New connection established from 192.168.x.x',
        'User session refresh token granted',
        'Transaction 0x... confirmed on Polygon',
        'High latency detected on region us-east-1',
        'Game session #8821 started (Mines)',
        'Withdrawal request #992 received'
      ];

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        level: Math.random() > 0.95 ? 'ERROR' : levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [...prev.slice(-100), newLog]); // Manter apenas últimos 100 logs
    };

    const interval = setInterval(generateLog, 800); // 800ms por log
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">Live Feed</h1>
            <p className="text-xs text-zinc-500 font-mono">MONITORAMENTO DE EVENTOS EM TEMPO REAL</p>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => setIsPaused(!isPaused)}
               className={cn(
                 "flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-bold transition-all",
                 isPaused ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-white/5 text-zinc-400 border-white/5 hover:text-white"
               )}
             >
               {isPaused ? <Play size={14} /> : <Pause size={14} />}
               {isPaused ? 'RESUME' : 'PAUSE'}
             </button>
             <button className="p-2 bg-white/5 border border-white/5 rounded-lg text-zinc-400 hover:text-white">
               <Download size={14} />
             </button>
          </div>
        </div>

        <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl overflow-hidden flex flex-col font-mono text-xs shadow-2xl relative">
          <div className="px-4 py-2 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2 text-zinc-500">
               <Terminal size={14} />
               <span className="font-bold">syslog</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-500">LISTENING</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {logs.map(log => (
              <div key={log.id} className="flex gap-3 hover:bg-white/5 px-2 py-0.5 rounded transition-colors select-text">
                <span className="text-zinc-600 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <span className={cn(
                  "font-bold w-16 shrink-0",
                  log.level === 'INFO' ? "text-blue-400" :
                  log.level === 'SUCCESS' ? "text-emerald-400" :
                  log.level === 'WARN' ? "text-amber-400" : "text-red-500"
                )}>
                  [{log.level}]
                </span>
                <span className="text-zinc-500 w-32 shrink-0 truncate hidden md:block">
                  {log.source}
                </span>
                <span className="text-zinc-300">
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLivePage;