import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { CatalogResponseSchema, ProductSchema } from '../../../../packages/contracts/catalog';
import { RepositoryFactory } from '../factory';

export const catalogRoute = new OpenAPIHono();

const listCatalog = createRoute({
  method: 'get',
  path: '/',
  summary: 'Listar catálogo de NFTs',
  responses: {
    200: {
      content: { 'application/json': { schema: CatalogResponseSchema } },
      description: 'Lista de produtos paginada',
    },
  },
});

const getProduct = createRoute({
  method: 'get',
  path: '/:id',
  summary: 'Obter detalhes de um NFT',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ProductSchema } },
      description: 'Detalhes do produto',
    },
    404: {
      description: 'Produto não encontrado',
    },
  },
});

catalogRoute.openapi(listCatalog, async (c) => {
  const repo = RepositoryFactory.catalog;
  const result = await repo.findAll(1, 20); // Hardcoded pagination for MVP

  return c.json({
    products: result.items,
    total: result.total,
    page: 1,
    totalPages: Math.ceil(result.total / 20)
  }, 200);
});

catalogRoute.openapi(getProduct, async (c) => {
  const { id } = c.req.valid('param');
  const repo = RepositoryFactory.catalog;
  const product = await repo.findById(id);

  if (!product) {
    return c.json({ error: 'Not found' } as any, 404);
  }

  return c.json(product, 200);
});