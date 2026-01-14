"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const WheelPointer = ({ isSpinning }: { isSpinning: boolean }) => (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-50 flex flex-col items-center">
    <motion.div 
      animate={isSpinning ? { 
        rotate: [0, -15, 0, 15, 0],
        scale: [1, 1.1, 1] 
      } : {}}
      transition={{ duration: 0.15, repeat: isSpinning ? Infinity : 0 }}
      className="relative"
    >
      {/* Corpo do Ponteiro */}
      <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
        <path d="M20 60L40 20L20 0L0 20L20 60Z" fill="url(#pointerGradient)" />
        <path d="M20 50L35 22L20 8L5 22L20 50Z" fill="#00FF9C" fillOpacity="0.3" />
        <defs>
          <linearGradient id="pointerGradient" x1="20" y1="0" x2="20" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#00FF9C" />
          </linearGradient>
        </defs>
      </svg>
      {/* Brilho do Ponteiro */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#00FF9C] blur-xl opacity-40" />
    </motion.div>
  </div>
);