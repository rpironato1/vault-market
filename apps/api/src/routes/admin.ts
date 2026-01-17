import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { AdminDashboardResponseSchema } from '../../../../packages/contracts/admin';

export const adminRoute = new OpenAPIHono();

// Definição da Rota (O Contrato)
const getDashboardRoute = createRoute({
  method: 'get',
  path: '/dashboard',
  summary: 'Obter dados gerais da dashboard administrativa',
  description: 'Retorna estatísticas, alertas de risco e ações pendentes.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AdminDashboardResponseSchema,
        },
      },
      description: 'Dados da dashboard recuperados com sucesso',
    },
    403: {
      description: 'Acesso negado (Requer role ADMIN)',
    },
  },
});

// Implementação da Lógica (O Código)
adminRoute.openapi(getDashboardRoute, (c) => {
  return c.json({
    stats: {
      totalUsers: 12500,
      totalVaultCoinsInCirculation: 9000000,
      totalUsdtPaid: 150000,
      pendingWithdrawalsCount: 5,
      flaggedAccountsCount: 2
    },
    pendingActions: [],
    recentAlerts: [
      {
        id: '1',
        severity: 'INFO' as const,
        message: 'API iniciada com sucesso via Hono',
        timestamp: Date.now()
      }
    ]
  }, 200);
});