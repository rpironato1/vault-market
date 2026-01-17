import { z } from 'zod';

export const GameTypeSchema = z.enum(['MINES', 'WHEEL', 'CRASH', 'PLINKO']);

export const GameSessionSchema = z.object({
  id: z.string(),
  gameType: GameTypeSchema,
  status: z.enum(['ACTIVE', 'FINISHED', 'CASHOUT']),
  wager: z.number().positive(),
  multiplier: z.number().default(1.0),
  potentialWin: z.number(),
  createdAt: z.string().datetime(),
});

export const GameActionSchema = z.object({
  gameId: z.string(),
  action: z.string(), // 'REVEAL', 'SPIN', 'CASHOUT', 'DROP'
  payload: z.record(z.any()).optional(),
});

export type GameSession = z.infer<typeof GameSessionSchema>;
export type GameAction = z.infer<typeof GameActionSchema>;