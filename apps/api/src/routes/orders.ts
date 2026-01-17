import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CreateOrderSchema, OrderSchema } from '../../../../packages/contracts/orders';
import { RepositoryFactory } from '../factory';
import { v4 as uuidv4 } from 'uuid';

export const ordersRoute = new OpenAPIHono();

const createOrder = createRoute({
  method: 'post',
  path: '/',
  summary: 'Criar novo pedido de compra',
  request: {
    body: {
      content: { 'application/json': { schema: CreateOrderSchema } },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: OrderSchema } },
      description: 'Pedido criado com sucesso',
    },
    400: {
      description: 'Erro de validação ou produto não encontrado'
    }
  },
});

ordersRoute.openapi(createOrder, async (c) => {
  const data = c.req.valid('json');
  const repo = RepositoryFactory.orders;
  const catalogRepo = RepositoryFactory.catalog;

  // 1. Validar Produto (Lógica Real)
  const product = await catalogRepo.findById(data.productId);
  if (!product) {
    return c.json({ error: 'Product not found' } as any, 400);
  }

  // 2. Criar Pedido via Repositório
  const newOrder = await repo.create({
    id: uuidv4(),
    userId: 'user-demo-123', // Em prod, viria do Auth Middleware
    items: [{
      productId: product.id,
      quantity: data.quantity,
      priceAtPurchase: product.priceUsdt
    }],
    totalAmountUsdt: product.priceUsdt * data.quantity,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  });

  return c.json(newOrder, 201);
});