# Vault Market

> **Simulação Econômica Descentralizada & Gamificação de Ativos**

O Vault Market (anteriormente VaultNet) é uma plataforma de marketplace de NFTs com um sistema de economia interna gamificada. O projeto combina estética "Enterprise Fintech" com mecânicas de jogos provably fair, utilizando uma arquitetura robusta e escalável.

## 🏗 Arquitetura & Stack

O projeto segue estritamente **Hexagonal Architecture (Ports & Adapters)** com **Self-Contained Systems (SCS)** no frontend e backend modular.

### Backend (`apps/api`)
- **Runtime:** Cloudflare Workers (Edge)
- **Framework:** Hono + OpenAPI (Zod)
- **Persistência:** 
  - **Hexagonal:** Repositórios intercambiáveis (In-Memory para Dev, Drizzle/Postgres para Prod).
  - **Database:** Neon (Serverless Postgres).
  - **Schema:** Drizzle ORM com tipagem financeira estrita (`numeric(20, 6)`).
- **Contratos:** `packages/contracts` (Zod Schemas compartilhados).

### Frontend (`src`)
- **Framework:** React 18 + Vite + TypeScript.
- **Estilização:** Tailwind CSS (Design System "Sophistication & Trust").
- **Gerenciamento de Estado:** Zustand.
- **Comunicação:** API Client tipado via contratos Zod.
- **Admin:** Dashboard "Risk Ops" completa com monitoramento em tempo real.

## 🚀 Funcionalidades Implementadas

### 1. Core Economy
- **VaultCoins (Utility):** Ledger imutável para créditos de jogo (não compráveis diretamente).
- **USDT Rewards (Treasury):** Ledger de prêmios com estados (Locked, Available, Paid).
- **Marketplace:** Compra de NFTs que geram VaultCoins (Asset Acquisition Model).

### 2. Admin / Risk Ops
- **Dashboard:** Monitoramento em tempo real (Live Feed).
- **Treasury:** Gestão de saques com aprovação/rejeição e badges de risco.
- **Users:** Grid de operadores com status de risco e bloqueio.

### 3. Games & Experiences (Frontend)
- **Mines (Data Sync):** Lógica de campo minado.
- **Crash (Quantum Link):** Multiplicador exponencial.
- **Plinko (Gravity Protocol):** Física de partículas.
- **Wheel (Orbital Pulse):** Roleta diária.

## 📦 Como Rodar

### Instalação
```bash
npm install
```

### Desenvolvimento (Full Stack Simulado)
O projeto está configurado para rodar com **In-Memory Database** por padrão, permitindo desenvolvimento imediato sem configurar infraestrutura externa.

```bash
# Inicia Frontend + Mock Backend
npm run dev
```

### Banco de Dados (Opcional para Dev)
Para rodar com persistência real (Neon):

1. Configure `DATABASE_URL` no `.env`.
2. Rode as migrações:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```
3. Defina `DB_TYPE=postgres` no ambiente do Worker.

## 📚 Documentação Técnica

Consulte a pasta `/docs` para detalhes profundos:
- **PRD.md:** Regras de negócio e visão do produto.
- **ARCHITECTURE_BASE.md:** Decisões de design e padrões.
- **UI/*.md:** Especificações de interface por tela.