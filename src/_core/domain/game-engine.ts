"use client";

import { Reward } from './entities';

export interface ProvablyFairResult {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  hash: string;
}

export interface GameMetadata {
  id: string;
  name: string;
  minBet: number;
  maxBet: number;
  rtp: number; // Return to Player
}

/**
 * Lógica de geração de resultado auditável
 */
export const generateProvablyFairHash = (serverSeed: string, clientSeed: string, nonce: number): string => {
  // Simulação de Hashing SHA-256 para o frontend
  return `${serverSeed}-${clientSeed}-${nonce}`; 
};