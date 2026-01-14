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
        
        // O ângulo inicial 0 começa no topo (12 horas) graças ao -90 no cálculo de seno/cosseno
        const startAngle = i * angle;
        const endAngle = (i + 1) * angle;
        
        const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
        const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
        const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
        const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

        return (
          <motion.g 
            key={i}
            animate={isWinner ? {
              scale: isJackpot ? [1, 1.08, 1.04] : [1, 1.04, 1],
              filter: [
                `drop-shadow(0 0 0px ${sector.color})`, 
                `drop-shadow(0 0 15px ${sector.color})`, 
                `drop-shadow(0 0 5px ${sector.color})`
              ]
            } : { scale: 1, filter: "none" }}
            transition={{ duration: 0.5, repeat: isWinner ? Infinity : 0 }}
            style={{ transformOrigin: '50% 50%', zIndex: isWinner ? 50 : 1 }}
          >
            {/* Fatia */}
            <path
              d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
              fill={sector.color}
              fillOpacity={isWinner ? 1 : 0.85}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.3"
            />
            
            <defs>
              <path
                id={`textPath-${i}`}
                d={`M ${50 + 35 * Math.cos((Math.PI * (startAngle - 90)) / 180)} ${50 + 35 * Math.sin((Math.PI * (startAngle - 90)) / 180)} 
                   A 35 35 0 0 1 ${50 + 35 * Math.cos((Math.PI * (endAngle - 90)) / 180)} ${50 + 35 * Math.sin((Math.PI * (endAngle - 90)) / 180)}`}
              />
            </defs>

            <text 
              fill={isWinner ? "white" : "rgba(255,255,255,0.7)"} 
              fontSize="4.5" 
              fontWeight="900" 
              letterSpacing="0.05em"
            >
              <textPath xlinkHref={`#textPath-${i}`} startOffset="50%" textAnchor="middle">
                {sector.label}
              </textPath>
            </text>
          </motion.g>
        );
      })}
    </g>
  );
};