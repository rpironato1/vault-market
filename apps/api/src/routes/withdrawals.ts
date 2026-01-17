import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CreateWithdrawalSchema, WithdrawalRequestSchema } from '../../../packages/contracts/rewards';
import { v4 as uuidv4 } from 'uuid';

export const withdrawalsRoute = new OpenAPIHono();

const createWithdrawalRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Solicitar saque',
  request: {
    body: { content: { 'application/json': { schema: CreateWithdrawalSchema } } }
  },
  responses: {
    201: { content: { 'application/json': { schema: WithdrawalRequestSchema } }, description: 'Saque criado' }
  }
});

withdrawalsRoute.openapi(createWithdrawalRoute, (c) => {
  const dto = c.req.valid('json');
  
  // Mock Server-Side: Aceita e retorna objeto de sucesso
  return c.json({
    id: uuidv4(),
    userId: 'user-demo-123',
    amount: dto.amount,
    walletAddress: dto.walletAddress,
    network: 'POLYGON',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString()
  }, 201);
});