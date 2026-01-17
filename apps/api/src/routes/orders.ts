import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CreateOrderSchema, OrderSchema } from '../../../packages/contracts/orders';
import { RepositoryFactory } from '../factory';
import { v4 as uuidv4 } from 'uuid';

export const ordersRoute = new OpenAPIHono();

const createOrderRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Criar novo pedido',
  request: {
    body: {
      content: { 'application/json': { schema: CreateOrderSchema } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: OrderSchema } },
      description: 'Pedido criado',
    },
  },
});

ordersRoute.openapi(createOrderRoute, async (c) => {
  const dto = c.req.valid('json');
  const repo = RepositoryFactory.orders;
  const catalogRepo = RepositoryFactory.catalog;

  // Lógica de Negócio (Simplificada para o Controller por enquanto)
  const product = await catalogRepo.findById(dto.productId);
  if (!product) throw new Error('Produto não encontrado');

  const total = product.priceUsdt * dto.quantity;

  const order = await repo.create({
    id: uuidv4(),
    userId: 'user-demo-123', // Hardcoded até termos Auth Middleware
    status: 'PENDING',
    items: [{ productId: product.id, quantity: dto.quantity, priceAtPurchase: product.priceUsdt }],
    totalAmountUsdt: total,
    createdAt: new Date().toISOString()
  });

  return c.json(order, 201);
});