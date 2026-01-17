import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CatalogResponseSchema } from '../../../packages/contracts/catalog';
import { RepositoryFactory } from '../factory';

export const catalogRoute = new OpenAPIHono();

const getCatalogRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Listar catálogo de NFTs',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CatalogResponseSchema,
        },
      },
      description: 'Lista de produtos',
    },
  },
});

catalogRoute.openapi(getCatalogRoute, async (c) => {
  // O controlador não sabe se é banco ou memória. Ele apenas pede ao repositório.
  const repo = RepositoryFactory.catalog;
  const result = await repo.findAll(1, 20);

  return c.json({
    products: result.items,
    total: result.total,
    page: 1,
    totalPages: Math.ceil(result.total / 20)
  }, 200);
});