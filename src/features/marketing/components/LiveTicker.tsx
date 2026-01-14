"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChartLineUp } from '@phosphor-icons/react';

const WINNERS = [
  { user: "r***9", prize: "500 USDT", box: "Cyber Box" },
  { user: "x***2", prize: "1.200 USDT", box: "Legendary" },
  { user: "v***k", prize: "50 USDT", box: "Core Pack" },
  { user: "m***0", prize: "2.500 USDT", box: "Apex Vault" },
];

const LiveTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WINNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-10 left-10 z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          className="flex items-center gap-4 bg-[#121212]/80 backdrop-blur-xl border border-white/5 p-3 rounded-2xl shadow-2xl"
        >
          <div className="h-10 w-10 rounded-xl bg-[#00FF9C]/10 flex items-center justify-center text-[#00FF9C]">
            <Trophy weight="fill" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Win</span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] animate-ping" />
            </div>
            <p className="text-xs font-bold text-white">
              <span className="text-[#FFD700]">{WINNERS[index].user}</span> ganhou <span className="text-[#00FF9C]">{WINNERS[index].prize}</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveTicker;