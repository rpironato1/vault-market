import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';

// Importação de Rotas (Controllers)
import { adminRoute } from './routes/admin';
import { catalogRoute } from './routes/catalog';
import { ordersRoute } from './routes/orders';
import { meRoute } from './routes/me';
import { withdrawalsRoute } from './routes/withdrawals';

const app = new OpenAPIHono();

// Middlewares Globais
app.use('/*', cors());

// Rota de Healthcheck (Padrão DevOps)
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'VaultNet API',
    description: 'API oficial do protocolo VaultNet. Contratos validados via Zod.',
  },
});

// Swagger UI para visualização dos contratos
app.get('/ui', swaggerUI({ url: '/doc' }));

// Registro de Rotas (Versionamento v1)
app.route('/v1/admin', adminRoute);
app.route('/v1/catalog', catalogRoute);
app.route('/v1/orders', ordersRoute);
app.route('/v1/me', meRoute);
app.route('/v1/withdrawals', withdrawalsRoute);

export default {
  port: 8787,
  fetch: app.fetch,
};