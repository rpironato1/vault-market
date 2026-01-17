import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { BalanceSchema } from '../../../packages/contracts/balances';
import { VaultCoinsWalletResponseSchema } from '../../../packages/contracts/vaultcoins';
import { RepositoryFactory } from '../factory';

export const meRoute = new OpenAPIHono();

// --- BALANCES (REAL) ---
const getBalancesRoute = createRoute({
  method: 'get',
  path: '/balances',
  summary: 'Obter saldos do usuário',
  responses: {
    200: { content: { 'application/json': { schema: BalanceSchema } }, description: 'Saldos' },
  },
});

meRoute.openapi(getBalancesRoute, async (c) => {
  const userId = 'user-demo-123'; // Mock Auth
  
  const vcRepo = RepositoryFactory.vaultCoins;
  const rewardsRepo = RepositoryFactory.rewards;

  // Busca paralela real no banco
  const [vcBalance, usdtAvailable] = await Promise.all([
    vcRepo.getBalance(userId),
    rewardsRepo.getAvailableBalance(userId)
  ]);

  return c.json({
    vaultCoins: vcBalance,
    usdt: {
      available: usdtAvailable,
      locked: 0, // Mockado por enquanto
      totalEarned: usdtAvailable // Simplificação
    }
  }, 200);
});

// --- LEDGER (MOCK SERVER-SIDE) ---
const getLedgerRoute = createRoute({
  method: 'get',
  path: '/vaultcoins/ledger',
  summary: 'Extrato de VaultCoins',
  responses: {
    200: { content: { 'application/json': { schema: VaultCoinsWalletResponseSchema } }, description: 'Extrato' },
  },
});

meRoute.openapi(getLedgerRoute, (c) => {
  // Mock Server-Side: Retorna dados estáticos válidos para a UI
  return c.json({
    balance: { current: 1250, totalEarned: 5000, totalSpent: 3750 },
    transactions: [
      {
        id: 'tx-server-1',
        type: 'CREDIT',
        source: 'NFT_PURCHASE',
        amount: 1000,
        description: 'Mocked Server Transaction',
        timestamp: Date.now()
      }
    ]
  }, 200);
});

// --- REWARDS (MOCK SERVER-SIDE) ---
// Adicionar rota de rewards mockada se necessário...