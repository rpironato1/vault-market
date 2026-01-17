import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CatalogResponseSchema } from '../../../packages/contracts/catalog';

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

catalogRoute.openapi(getCatalogRoute, (c) => {
  return c.json({
    products: [],
    total: 0,
    page: 1,
    totalPages: 1
  }, 200);
});