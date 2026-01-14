"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Sector {
  label: string;
  color: string;
  value: number;
}

interface WheelSectorsProps {
  sectors: Sector[];
  winningIndex: number | null;
}

export const WheelSectors = ({ sectors, winningIndex }: WheelSectorsProps) => {
  const angle = 360 / sectors.length;

  return (
    <g>
      {sectors.map((sector, i) => {
        const isWinner = winningIndex === i;
        const isJackpot = sector.label === 'JACKPOT';
        const startAngle = i * angle;
        const endAngle = (i + 1) * angle;
        
        const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
        const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
        const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
        const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

        return (
          <motion.g 
            key={i}
            initial={false}
            animate={isWinner ? {
              scale: isJackpot ? [1, 1.1, 1.05] : [1, 1.05, 1],
              filter: isWinner 
                ? [
                    `drop-shadow(0 0 0px ${sector.color})`, 
                    `drop-shadow(0 0 20px ${sector.color})`, 
                    `drop-shadow(0 0 10px ${sector.color})`
                  ] 
                : "none"
            } : { scale: 1, filter: "none" }}
            transition={{ 
              duration: isJackpot ? 0.4 : 0.6, 
              repeat: isWinner ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '50% 50%', zIndex: isWinner ? 50 : 1 }}
          >
            {/* Fatia da Roda */}
            <path
              d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
              fill={sector.color}
              fillOpacity={isWinner ? 1 : (sector.color.startsWith('#1') ? 0.9 : 0.25)}
              stroke={isWinner ? "white" : "rgba(255,255,255,0.1)"}
              strokeWidth={isWinner ? "0.8" : "0.2"}
              className="transition-all duration-300"
            />
            
            {/* Aura de Brilho Extra para Jackpot */}
            {isWinner && isJackpot && (
              <motion.path
                d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                fill="url(#jackpotGradient)"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
            )}

            {/* Texto Curvo */}
            <defs>
              <path
                id={`arc-${i}`}
                d={`M ${50 + 38 * Math.cos((Math.PI * (startAngle - 90)) / 180)} ${50 + 38 * Math.sin((Math.PI * (startAngle - 90)) / 180)} 
                   A 38 38 0 0 1 ${50 + 38 * Math.cos((Math.PI * (endAngle - 90)) / 180)} ${50 + 38 * Math.sin((Math.PI * (endAngle - 90)) / 180)}`}
              />
              <radialGradient id="jackpotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF007F" stopOpacity="0" />
              </radialGradient>
            </defs>

            <motion.text 
              fill={isWinner ? "white" : (sector.color === '#121212' ? 'rgba(255,255,255,0.4)' : sector.color)} 
              fontSize={isWinner ? "5" : "4"} 
              fontWeight="900" 
              letterSpacing="0.1em"
              animate={isWinner ? { y: [0, -1, 0] } : {}}
            >
              <textPath xlinkHref={`#arc-${i}`} startOffset="50%" textAnchor="middle">
                {sector.label}
              </textPath>
            </motion.text>
          </motion.g>
        );
      })}
    </g>
  );
};