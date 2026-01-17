import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CatalogResponseSchema, ProductSchema } from '../../../packages/contracts/catalog';
import { RepositoryFactory } from '../factory';

export const catalogRoute = new OpenAPIHono();

const listCatalogRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Listar catálogo',
  responses: {
    200: {
      content: { 'application/json': { schema: CatalogResponseSchema } },
      description: 'Catálogo recuperado',
    },
  },
});

const getProductRoute = createRoute({
  method: 'get',
  path: '/:id',
  summary: 'Obter produto por ID',
  responses: {
    200: {
      content: { 'application/json': { schema: ProductSchema } },
      description: 'Detalhes do produto',
    },
    404: {
      description: 'Produto não encontrado',
    }
  },
});

catalogRoute.openapi(listCatalogRoute, async (c) => {
  const repo = RepositoryFactory.catalog;
  const result = await repo.findAll(1, 20);
  
  return c.json({
    products: result.items,
    total: result.total,
    page: 1,
    totalPages: Math.ceil(result.total / 20)
  }, 200);
});

catalogRoute.openapi(getProductRoute, async (c) => {
  const { id } = c.req.param();
  const repo = RepositoryFactory.catalog;
  const product = await repo.findById(id);
  
  if (!product) {
    return c.json({ error: 'Not found' } as any, 404);
  }
  
  return c.json(product, 200);
});