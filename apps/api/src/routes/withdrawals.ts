import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CreateWithdrawalSchema, WithdrawalRequestSchema } from '../../../../packages/contracts/rewards';
import { v4 as uuidv4 } from 'uuid';

export const withdrawalsRoute = new OpenAPIHono();

const requestWithdrawal = createRoute({
  method: 'post',
  path: '/',
  summary: 'Solicitar saque de USDT',
  request: {
    body: {
      content: { 'application/json': { schema: CreateWithdrawalSchema } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: WithdrawalRequestSchema } },
      description: 'Solicitação criada',
    },
  },
});

withdrawalsRoute.openapi(requestWithdrawal, async (c) => {
  const data = c.req.valid('json');

  return c.json({
    id: uuidv4(),
    userId: 'user-demo-123',
    amount: data.amount,
    walletAddress: data.walletAddress,
    network: data.network,
    status: 'PENDING_REVIEW' as const, 
    createdAt: new Date().toISOString(),
    txHash: undefined,
    rejectionReason: undefined,
    riskScore: 15 // Mocked risk score
  }, 201);
});