"use client";

import { useState, useCallback } from 'react';
import { Reward } from '@/_core/domain/types';

// Singleton-like hook for demo purposes
let balance = 1245.80;
let tokens = 8420;
let inventory: Reward[] = [];

export const useUserStore = () => {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(t => t + 1), []);

  const addReward = (reward: Reward) => {
    inventory.push(reward);
    tokens += 150; // Recompensa por engajamento
    forceUpdate();
  };

  const spendBalance = (amount: number) => {
    if (balance >= amount) {
      balance -= amount;
      forceUpdate();
      return true;
    }
    return false;
  };

  return {
    balance,
    tokens,
    inventory,
    addReward,
    spendBalance
  };
};