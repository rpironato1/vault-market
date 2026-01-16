Hoje (UTC) é **16 de janeiro de 2026**.

A seguir está minha análise inicial do **repositório atual** + um **plano de evolução (PRD + arquitetura + estrutura + backlog)** para levar o *vault market* do estado embrionário para um produto escalável e seguro — alinhado ao seu pré‑rascunho e ao stack alvo (Neon + Cloudflare Workers + Hyperdrive + Hono + React/Vite/Tailwind + Polygon USDT).

---

## 1) Leitura rápida do estado atual do repo

### O que já existe (sólido e reaproveitável)

1. **Front-end React/Vite com rotas e páginas** já estruturadas (há `src/`, `public/`, `vercel.json`, etc.). ([GitHub][1])
2. **Arquitetura no front já aponta para “Hexagonal + Self-Contained Features (SCS)”**, com features isoladas (ex.: `features/auth`, `features/gift-cards`, `features/landing-marketplace`) e camadas como `domain`, `infrastructure`, `presentation`. ([GitHub][1])
3. Um **módulo de Auth** implementado com ports/types no domínio + adapter/store na infraestrutura + UI/layout/páginas na apresentação (ainda mockado). ([GitHub][2])
4. Uma **landing marketplace** já implementada como feature, com controller/hook e catálogo estático, e um fluxo “comprar e revelar recompensa” (atualmente simulado no client). ([GitHub][3])
5. Features de “itens/caixas/gift cards” já com UI/UX e entidades de domínio (ex.: `GiftBoxTier`, componentes com animações etc.). ([GitHub][4])

### O que ainda NÃO existe (e é central para o seu produto alvo)

1. **Back-end real** (API, persistência, regras antifraude, ledger de coins, payouts, etc.). O que existe hoje é majoritariamente **simulação no front** (ex.: uso de `Math.random()` para “recompensas”). ([GitHub][3])
2. **Integração blockchain Polygon/USDT** (wallet connect, leitura de eventos, execução de transferências, gestão de treasury, etc.).
3. **Neon DB + Neon Auth + Cloudflare Workers/Hyperdrive** ainda não aparecem como base funcional no repo (estão como objetivo do seu stack). O caminho recomendado pela própria Cloudflare para Neon é via Hyperdrive. ([Cloudflare Docs][5])

---

## 2) “Fit” com o seu pré‑rascunho: onde encaixa e onde conflita

### Encaixa muito bem

* Você quer **experiências (mini games)**, **coins internas (vaultcoins)** e **prêmios em USDT (Polygon)**. O repo já tem *DNA* de “market + experiências + inventário”, inclusive com store global e controllers. ([GitHub][3])
* Você quer **arquitetura modular e extensível** (plugins/adapters) — e o repo já começa com **Hexagonal + SCS** no front. ([GitHub][1])

### Conflitos/riscos que precisam ser endereçados cedo

* O seu rascunho diz **“usuário jamais pode depositar USDT para jogar”** e “não é cassino”. No código atual da landing marketplace, já existe mensagem de erro sugerindo **depósito** quando saldo é insuficiente. Isso precisa ser alinhado semanticamente e no produto. ([GitHub][3])
* O seu modelo “**compra NFT → recebe coins no mesmo valor → usa coins para ganhar USDT**” tem **alto risco regulatório** em várias jurisdições (parece “consideration → chance → prize”, ainda que indireto via NFT). Não é um blocker técnico, mas é um risco de negócio/compliance que vale tratar como **épico** (regras do jogo, elegibilidade, KYC/AML opcional, limites, auditoria, termos).

---

## 3) Recomendação arquitetural: Hexagonal + SCS + (microserviços depois)

Você perguntou se “Hexagonal + micro serviços + self‑contained features” é o melhor combo.

Minha recomendação objetiva:

1. **Sim para Hexagonal + SCS como padrão de modularidade** (você já está colhendo benefícios no front).
2. **Não começar com microserviços “de verdade”** agora. Começar com microserviços cedo costuma custar:

   * observabilidade distribuída,
   * versionamento/contratos,
   * consistência de dados,
   * latência,
   * overhead de deploy e operações.

O melhor “meio termo” para seu contexto:

* **Monólito modular (modular monolith)** com **fronteiras hexagonais** e **features self‑contained**.
* Implantação pode ser **1 Worker (API)** inicialmente, com rotas bem separadas por módulo.
* Quando algum módulo “pedir” extração (ex.: payouts/withdrawals, games engine, antifraud), você separa para **Workers distintos**, mantendo **ports/adapters** já definidos.

Isso preserva seu objetivo de *plugins/adapters* e te dá uma trilha segura para virar microserviços quando fizer sentido.

---

## 4) Arquitetura alvo sugerida com seu stack (Cloudflare + Neon)

### 4.1 Componentes principais

**Frontend (React + Vite + Tailwind)**

* Permanece como SPA.
* Deve parar de “simular” compra/recompensa no client e passar a consumir API.

**API (Cloudflare Workers + Hono)**

* Hono é explicitamente recomendado/compatível com Workers e é uma opção “leve e rápida”. ([Cloudflare Docs][6])
* Rotas: `/auth`, `/catalog`, `/orders`, `/ledger`, `/games`, `/rewards`, `/withdrawals`, `/affiliates`, `/admin`.

**Auth (Neon Auth)**

* Neon Auth é um serviço gerenciado que **armazena users/sessions/config diretamente no Neon Postgres**. ([Neon][7])
* Você substitui o auth mock do front por **sessões reais** e passa a ter RBAC/roles (admin, affiliate, user) e trilha para antifraude.

**Database (Neon Postgres)**

* Fonte de verdade para: usuários, carteira associada, catálogo NFT off-chain, pedidos, ledger de coins, ledger de prêmios, withdrawals, afiliados, auditoria.

**DB Connectivity (Cloudflare Hyperdrive)**

* Hyperdrive mantém **pool de conexões**, otimizado por região, reduzindo custo de handshake/round-trips e compartilhando pool entre invocações. ([Cloudflare Docs][8])
* A própria Cloudflare documenta Neon como integração e recomenda Hyperdrive (ou o driver serverless da Neon). ([Cloudflare Docs][5])

**Blockchain Polygon**

* Dois blocos:

  1. **Indexação/observação** (ler eventos de contratos: compras, transferências, etc.)
  2. **Execução de payout** (transferência USDT do treasury para wallet do usuário)

> Nota de segurança: payout exige gestão segura de chaves (idealmente multi-sig/serviço de custódia), além de trilhas de auditoria.

---

## 5) Modelo de domínio mínimo (MVP) para “vault market”

Abaixo uma proposta “MVP consistente” com seu rascunho, separando **coins** (utilidade) de **prêmios** (USDT).

### Entidades centrais

1. **User**

   * id, email, status, flags antifraude, roles
2. **Wallet**

   * user_id, chain, address, verificada?, created_at
3. **NFTProduct (Catálogo)**

   * id, name, description, image, price_usdt, bonus_vaultcoins, supply, contract_address/token_id (ou “mint rules”)
4. **Order**

   * id, user_id, product_id, amount_usdt, status (CREATED|PAID|MINTED|FAILED), tx_hash, timestamps
5. **VaultCoinLedger (contábil/imutável)**

   * id, user_id, type (CREDIT|DEBIT|ADJUSTMENT), source (NFT_PURCHASE|GAME_SPEND|AFFILIATE|ADMIN), amount, ref_id, created_at
   * Regra: saldo = soma(credits) - soma(debits) (nada de “update saldo” sem ledger)
6. **GameSession**

   * id, user_id, game_type, wager_vaultcoins, outcome, fairness_proof, created_at
7. **PrizeLedger (USDT)**

   * id, user_id, source (GAME_WIN|AFFILIATE|MANUAL), amount_usdt, status (EARNED|LOCKED|AVAILABLE|PAID|REJECTED), ref_id
8. **WithdrawalRequest**

   * id, user_id, amount_usdt, target_wallet, status (REQUESTED|REVIEW|APPROVED|SENT|FAILED), tx_hash, risk_score

### Invariantes importantes (para evitar fraude e “conta negativa”)

* **VaultCoins**:

  * só podem ser **creditadas** por compra de NFT (ou promo/afiliado/admin)
  * só podem ser **debitadas** por consumo em experiências
  * nunca viram USDT diretamente (só dão “direito de jogar”)
* **USDT**:

  * usuário **nunca deposita para jogar**
  * usuário só **saca** o que ganhou (PrizeLedger → Withdrawal)

---

## 6) O que eu mudaria no repo agora (sem reescrever tudo)

### 6.1 Manter e fortalecer o que já está bom

* Manter o padrão atual de features:

  * `features/<feature>/{domain,infrastructure,presentation}` no front. ([GitHub][2])
* Manter um `_infrastructure` compartilhado (mas com disciplina: só cross‑cutting real). ([GitHub][9])

### 6.2 Tirar lógica “crítica” do client

Hoje o client:

* define catálogo estático no hook/controller, e
* gera “recompensa” com aleatoriedade (`Math.random()`), e
* debita saldo localmente. ([GitHub][3])

Para virar produto real:

* client vira “casca” de UI:

  * `GET /catalog`
  * `POST /orders`
  * `POST /games/:type/play`
  * `GET /me/balance`
  * `POST /withdrawals`

### 6.3 Estrutura de monorepo (recomendada)

Sem quebrar o que você já tem, eu sugiro evoluir para algo assim:

```
/apps
  /web          # seu Vite+React atual
  /api          # Cloudflare Worker + Hono
/packages
  /shared       # tipos, zod schemas, utilitários, contracts de API
  /domain       # (opcional) modelos de domínio compartilhados
/docs           # PRD, ADRs, diagramas, runbooks
```

Isso mantém sua base e destrava “full-stack”.

---

## 7) Stack alvo: como encaixar Neon Auth + Hyperdrive + Hono do jeito certo

### Neon Auth

* Neon Auth “guarda users/sessions/config no Postgres”, o que simplifica seu backend e reduz integrações externas para autenticação. ([Neon][7])
* Existe guia de migração (legado/Stack Auth → Better Auth) bem recente; bom sinal de maturidade/documentação ativa. ([Neon][10])

### Hyperdrive + Neon

* Cloudflare recomenda conectar Neon via **Hyperdrive** (ou driver serverless da Neon), e reforça que ambos ajudam em pooling/latência. ([Cloudflare Docs][5])
* Hyperdrive realmente foi desenhado para resolver o problema clássico de conexão DB em Workers (handshake/TLS/auth). ([Cloudflare Docs][11])
* Hyperdrive mantém pool compartilhado e configurável. ([Cloudflare Docs][12])

### Hono

* Hono é documentado pela Cloudflare como framework que “funciona fantasticamente” com Workers e pode ser combinado com SPA. ([Cloudflare Docs][6])

---

## 8) Plano de documentação (PRD + arquitetura) que eu iniciaria já

A ideia aqui é te dar uma “coluna vertebral” de docs para guiar o time e evitar rework.

### 8.1 `/docs/PRD.md` (v0.1)

1. **Visão**

   * marketplace de NFTs + experiências
2. **Objetivos**

   * compra NFT → vaultcoins
   * vaultcoins → experiências
   * experiências → prêmios USDT (Polygon)
   * saque USDT
3. **Não-objetivos**

   * depósito de USDT para jogar
   * “cassino” (definir rigorosamente o que isso significa operacionalmente)
4. **Personas**

   * comprador/colecionador
   * jogador casual
   * afiliado selecionado
   * admin/operador (risk ops)
5. **Jornadas**

   * compra NFT
   * uso vaultcoins
   * jogar e ganhar
   * saque
   * P2P venda de NFT
6. **Requisitos**

   * funcionais e não funcionais
7. **Riscos**

   * compliance/regulação
   * fraude/bots
   * custódia/treasury
8. **Métricas**

   * conversão compra→uso
   * retenção
   * taxa de fraude
   * tempo de saque

### 8.2 `/docs/ARCHITECTURE.md` (v0.1)

* Diagrama de contexto (C4 L1)
* Componentes (C4 L2)
* Contratos de API (OpenAPI)
* Modelo de dados (ERD)
* Fluxos críticos:

  * compra NFT (on-chain) → crédito coins (ledger)
  * jogo → prêmio (ledger) → disponibilidade → saque (tx)
* Estratégia de segurança:

  * gestão de segredos, chaves, rate limit, auditoria

### 8.3 ADRs (Architecture Decision Records)

Criaria um `/docs/adr/` com decisões fechadas, por exemplo:

* ADR-0001: Modular monolith + Hex + SCS (agora), extração progressiva para Workers separados (depois)
* ADR-0002: Neon Auth para autenticação
* ADR-0003: Hyperdrive para pooling Neon Postgres
* ADR-0004: Ledger imutável para vaultcoins e prêmios
* ADR-0005: Estratégia de payout USDT (treasury + signing + filas/retry)

---

## 9) Backlog recomendado (por fases, sem chute de prazo)

### Fase A — Fundacional (destravar produto real)

* [ ] Monorepo (web/api/shared/docs)
* [ ] API Worker (Hono) com healthcheck + versionamento
* [ ] Neon DB + schema inicial (users, wallets, orders, ledgers)
* [ ] Neon Auth integrado (sessions reais)
* [ ] Hyperdrive conectando Worker ao Neon

### Fase B — Compra NFT → Coins (core loop 1)

* [ ] Catálogo de NFTs (admin seed)
* [ ] Criação de order + estado
* [ ] Confirmação on-chain (indexador/event watcher)
* [ ] Crédito de vaultcoins via ledger (amount = preço)

### Fase C — Experiências (core loop 2)

* [ ] “Spend vaultcoins” (debit ledger)
* [ ] GameSession + fairness/anti-fraude básico
* [ ] PrizeLedger (USDT) com regras de disponibilidade

### Fase D — Saque USDT (core loop 3)

* [ ] WithdrawalRequest + risk scoring
* [ ] Execução de transfer USDT (Polygon) + retries
* [ ] Auditoria e trilhas

### Fase E — P2P NFTs + Afiliados

* [ ] Listagem e compra P2P em USDT
* [ ] Afiliados allowlist + tracking + payouts

---

## 10) Próximos passos imediatos (o que eu faria no “primeiro ciclo”)

1. **Renomear e alinhar terminologia**

   * “Vault Market” vs “VaultNet Protocol” (hoje o README descreve “VaultNet Protocol” e uma suíte de marketplace/jogos). ([GitHub][1])
2. **Parar de simular lógica econômica no client**

   * especialmente `Math.random()` para recompensas e alterações de saldo no client. ([GitHub][3])
3. **Criar esqueleto do backend (Workers + Hono) e contratos de API**

   * mesmo que inicialmente retorne mock, mas vindo da API (não do front)
4. **Definir o ledger como regra de ouro**

   * sem “balance mutável” sem trilha
5. **Abrir um épico de compliance/antifraude**

   * não é detalhe: vai influenciar design de games, elegibilidade de saque, limites e logs

---

## Observação importante sobre a análise “completa” do repo

Consegui analisar:

* a **README** e estrutura geral do repositório, ([GitHub][1])
* e **trechos bem representativos do código** via diffs de commits (auth, landing marketplace, gift cards). ([GitHub][2])

Por limitações de renderização do GitHub na visualização direta de arquivos nesta sessão, eu **não consegui navegar por todos os arquivos linha a linha** fora dos diffs — mas já dá para montar um plano arquitetural confiável e alinhado com as decisões que você quer tomar agora.

---

Se você quiser, no próximo passo eu já avanço diretamente com:

* um **PRD v0.1 completo** (em `/docs/PRD.md`),
* um **ARCHITECTURE v0.1** com diagrama textual C4 + modelo de dados + fluxos,
* e uma **proposta de estrutura do monorepo** com contratos de API (tipos + schemas) para amarrar web↔api.

[1]: https://github.com/rpironato1/vault-market/ "https://github.com/rpironato1/vault-market/"
[2]: https://github.com/rpironato1/vault-market/commit/4f2be02321e2e5f00aec36a7dcedc06fc5d8f913 "https://github.com/rpironato1/vault-market/commit/4f2be02321e2e5f00aec36a7dcedc06fc5d8f913"
[3]: https://github.com/rpironato1/vault-market/commit/f141b5d1a5b60633fb570d06e22e20f3f8bad461 "https://github.com/rpironato1/vault-market/commit/f141b5d1a5b60633fb570d06e22e20f3f8bad461"
[4]: https://github.com/rpironato1/vault-market/commit/3bd8017c089aa82e565874638449f168a9df4cae "https://github.com/rpironato1/vault-market/commit/3bd8017c089aa82e565874638449f168a9df4cae"
[5]: https://developers.cloudflare.com/workers/databases/third-party-integrations/neon/ "https://developers.cloudflare.com/workers/databases/third-party-integrations/neon/"
[6]: https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/hono/ "https://developers.cloudflare.com/workers/framework-guides/web-apps/more-web-frameworks/hono/"
[7]: https://neon.tech/docs/guides/neon-auth-api "https://neon.tech/docs/guides/neon-auth-api"
[8]: https://developers.cloudflare.com/hyperdrive/concepts/connection-pooling/ "https://developers.cloudflare.com/hyperdrive/concepts/connection-pooling/"
[9]: https://github.com/rpironato1/vault-market/commit/92bc53905706304493ff34d782e77c437ea24b26 "https://github.com/rpironato1/vault-market/commit/92bc53905706304493ff34d782e77c437ea24b26"
[10]: https://neon.tech/docs/guides/neon-auth "https://neon.tech/docs/guides/neon-auth"
[11]: https://developers.cloudflare.com/hyperdrive/concepts/connection-lifecycle/ "https://developers.cloudflare.com/hyperdrive/concepts/connection-lifecycle/"
[12]: https://developers.cloudflare.com/hyperdrive/configuration/tune-connection-pool/ "https://developers.cloudflare.com/hyperdrive/configuration/tune-connection-pool/"
