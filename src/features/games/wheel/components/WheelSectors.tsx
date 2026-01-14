"use client";

import React from 'react';

interface Sector {
  label: string;
  color: string;
  value: number;
}

export const WheelSectors = ({ sectors }: { sectors: Sector[] }) => {
  const angle = 360 / sectors.length;

  return (
    <g>
      {sectors.map((sector, i) => {
        const startAngle = i * angle;
        const endAngle = (i + 1) * angle;
        
        const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
        const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
        const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
        const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

        return (
          <g key={i}>
            <path
              d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
              fill={sector.color}
              fillOpacity={sector.color.startsWith('#1') ? 0.9 : 0.2}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.2"
            />
            
            {/* Definição do Path para o Texto Curvo */}
            <defs>
              <path
                id={`arc-${i}`}
                d={`M ${50 + 38 * Math.cos((Math.PI * (startAngle - 90)) / 180)} ${50 + 38 * Math.sin((Math.PI * (startAngle - 90)) / 180)} 
                   A 38 38 0 0 1 ${50 + 38 * Math.cos((Math.PI * (endAngle - 90)) / 180)} ${50 + 38 * Math.sin((Math.PI * (endAngle - 90)) / 180)}`}
              />
            </defs>

            <text fill={sector.color === '#121212' ? 'white' : sector.color} fontSize="4" fontWeight="900" letterSpacing="0.1em">
              <textPath xlinkHref={`#arc-${i}`} startOffset="50%" textAnchor="middle">
                {sector.label}
              </textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
};