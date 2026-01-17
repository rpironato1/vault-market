# Próximos Passos (Action Plan)

Este documento guia o desenvolvimento a partir do marco "Foundation Complete".

## Fase 1: Conexão da API (Wiring)

O backend Hono já tem rotas e contratos, mas os controllers ainda retornam objetos estáticos para validar o contrato. O próximo passo é conectar a lógica real.

1.  **Implementar Use Cases:**
    *   Criar classes de serviço em `apps/api/src/application/` para orquestrar as chamadas aos repositórios.
    *   Exemplo: `CreateOrderUseCase` deve:
        1. Validar estoque (CatalogRepo).
        2. Criar Order (OrdersRepo).
        3. Retornar dados para pagamento.

2.  **Conectar Rotas aos Use Cases:**
    *   Atualizar `apps/api/src/routes/*.ts` para instanciar os Use Cases e chamar seus métodos, removendo os mocks hardcoded.

3.  **Testar com In-Memory:**
    *   Validar o fluxo completo (Criação de Pedido -> Listagem) rodando apenas o backend com `DB_TYPE=memory`.

## Fase 2: Integração com Banco Real (Neon)

1.  **Provisionar Neon:**
    *   Criar projeto no Neon Console.
    *   Obter `DATABASE_URL`.

2.  **Executar Migrations:**
    *   `npx drizzle-kit migrate` (Isso criará as tabelas definidas em `schema.ts`).

3.  **Testar Persistência:**
    *   Mudar `DB_TYPE=postgres` no `.env`.
    *   Criar um produto via API e verificar se persiste no Neon.

## Fase 3: Motor de Jogo Server-Side

1.  **Migrar Lógica:**
    *   Mover a lógica de `src/_infrastructure/api/mock-backend.ts` (Frontend) para `apps/api/src/domain/games/` (Backend).
    *   Implementar geração de seeds e hash (Provably Fair) no backend.

2.  **Persistir Sessões:**
    *   Criar tabela `game_sessions` no schema Drizzle.
    *   Gravar cada jogada/aposta no banco para auditoria.

## Fase 4: Blockchain (Indexer & Payouts)

1.  **Indexer Worker:**
    *   Criar um Cloudflare Worker separado (ou Scheduled Task) que consulta a RPC da Polygon.
    *   Processar eventos `Purchase(address, tokenId)` e inserir no `vaultcoin_ledger`.

2.  **Payout Queue:**
    *   Configurar Cloudflare Queues para processar saques aprovados de forma assíncrona, evitando gargalos na API principal.