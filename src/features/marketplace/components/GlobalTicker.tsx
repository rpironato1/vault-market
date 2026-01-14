"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning, UserCircle } from '@phosphor-icons/react';

const NAMES = ["Lucas", "Ana", "Gabriel", "Beatriz", "Roberto", "Carla", "Marcos"];
const BOXES = ["Cyber Unit", "Apex Vault", "Neural Node", "Core Pack"];

const GlobalTicker = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Math.random(),
        user: NAMES[Math.floor(Math.random() * NAMES.length)],
        reward: (Math.random() * 500 + 50).toFixed(2),
        box: BOXES[Math.floor(Math.random() * BOXES.length)]
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed left-6 top-32 w-64 hidden xl:flex flex-col gap-3 z-40">
      <div className="flex items-center gap-2 mb-2 px-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Fluxo de Recompensas</span>
      </div>
      <AnimatePresence initial={false}>
        {activities.map((act) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card border border-white/5 rounded-xl p-3 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
              <UserCircle weight="duotone" className="text-zinc-500" size={20} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-zinc-300 truncate">{act.user} sincronizou</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-mono font-black text-emerald-400">${act.reward}</span>
                <span className="text-[9px] text-zinc-500 truncate">na {act.box}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GlobalTicker;