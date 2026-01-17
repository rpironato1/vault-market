import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { BalanceSchema } from '../../../../packages/contracts/balances';
import { VaultCoinsWalletResponseSchema } from '../../../../packages/contracts/vaultcoins';
import { z } from 'zod';
import { RepositoryFactory } from '../factory';

export const meRoute = new OpenAPIHono();

// --- SCHEMAS TEMPORÁRIOS PARA MOCK (Compatíveis com UI) ---
const RewardTransactionSchema = z.object({
  id: z.string(),
  source: z.enum(['GAME_WIN', 'AFFILIATE_COMMISSION', 'SYSTEM_ADJUSTMENT']),
  description: z.string(),
  amount: z.number(),
  status: z.enum(['EARNED', 'LOCKED', 'AVAILABLE', 'PAID', 'REJECTED']),
  timestamp: z.number(),
  unlockDate: z.number().optional()
});

const RewardsResponseSchema = z.object({
  balance: z.object({
    totalEarned: z.number(),
    locked: z.number(),
    available: z.number(),
    paid: z.number(),
  }),
  transactions: z.array(RewardTransactionSchema)
});

// --- ROUTES ---

const getBalances = createRoute({
  method: 'get',
  path: '/balances',
  summary: 'Obter saldos consolidados do usuário',
  responses: {
    200: {
      content: { 'application/json': { schema: BalanceSchema } },
      description: 'Saldos recuperados',
    },
  },
});

const getLedger = createRoute({
  method: 'get',
  path: '/vaultcoins/ledger',
  summary: 'Extrato de VaultCoins',
  responses: {
    200: {
      content: { 'application/json': { schema: VaultCoinsWalletResponseSchema } },
      description: 'Extrato completo',
    },
  },
});

const getRewards = createRoute({
  method: 'get',
  path: '/rewards',
  summary: 'Histórico de recompensas (Mock)',
  responses: {
    200: {
      content: { 'application/json': { schema: RewardsResponseSchema } },
      description: 'Dados de recompensas',
    },
  },
});

// --- IMPLEMENTATION ---

meRoute.openapi(getBalances, async (c) => {
  const vaultCoinsRepo = RepositoryFactory.vaultCoins;
  
  // Real: Busca do banco
  const vcBalance = await vaultCoinsRepo.getBalance('user-demo-123');
  
  // Mock: USDT simulado por enquanto
  const mockUsdt = {
    available: 150.50,
    locked: 45.00,
    totalEarned: 1250.00
  };

  return c.json({
    vaultCoins: vcBalance > 0 ? vcBalance : 5000, // Fallback p/ demo se zero
    usdt: mockUsdt
  }, 200);
});

meRoute.openapi(getLedger, (c) => {
  return c.json({
    balance: {
      current: 5000,
      totalEarned: 12000,
      totalSpent: 7000
    },
    transactions: [
      {
        id: 'tx-server-1',
        type: 'CREDIT' as const,
        source: 'NFT_PURCHASE' as const,
        amount: 1000,
        description: 'Bônus: Cyber Sentinel Unit (Server Validated)',
        referenceId: 'ord-123',
        timestamp: Date.now() - 86400000
      },
      {
        id: 'tx-server-2',
        type: 'DEBIT' as const,
        source: 'GAME_ENTRY' as const,
        amount: 50,
        description: 'Mines Entry',
        referenceId: 'game-999',
        timestamp: Date.now() - 3600000
      }
    ]
  }, 200);
});

meRoute.openapi(getRewards, (c) => {
  return c.json({
    balance: {
      totalEarned: 1250.50,
      locked: 45.00,
      available: 150.50,
      paid: 1055.00
    },
    transactions: [
      {
        id: 'rw-srv-1',
        source: 'GAME_WIN' as const,
        description: 'Vitória em Mines (Server)',
        amount: 15.00,
        status: 'AVAILABLE' as const,
        timestamp: Date.now() - 1800000
      },
      {
        id: 'rw-srv-2',
        source: 'GAME_WIN' as const,
        description: 'Big Win Crash',
        amount: 45.00,
        status: 'LOCKED' as const,
        timestamp: Date.now() - 7200000,
        unlockDate: Date.now() + 86400000
      }
    ]
  }, 200);
});