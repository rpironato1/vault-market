# Vault Market — PRD (v0.1)

**Documento:** Product Requirements Document  
**Última atualização:** 2026-01-16  
**Status:** Draft operacional (pronto para guiar execução)

---

## 1. Visão do Produto

O **Vault Market** é uma plataforma de comércio de NFTs (com expansão futura para outros itens) que integra:
- **Marketplace de NFTs**
- **Moeda interna (VaultCoins)** creditada ao usuário após compra de NFT (1:1 com o valor do NFT, regra de negócio principal)
- **Experiências / mini-games** onde o usuário utiliza VaultCoins
- **Prêmios em USDT (Polygon)** obtidos via experiências
- **Saque** de prêmios em USDT (Polygon) para carteira do usuário

### Princípios inegociáveis
1. O usuário **não deposita USDT para jogar** (não é casa de apostas/cassino).
2. VaultCoins são **moeda utilitária interna**, não “cash in”.
3. Prêmios são **sempre USDT (Polygon)** e são sacáveis.
4. Segurança e anti-fraude são requisitos de primeira classe (inclusive trilha de auditoria).

---

## 2. Objetivos

### Objetivos de negócio (MVP)
- Permitir compra de NFT via crypto na Polygon.
- Creditar VaultCoins automaticamente com base em compra confirmada.
- Permitir gastar VaultCoins em experiências e gerar prêmios em USDT.
- Permitir saque de USDT para carteira (Polygon).

### Objetivos de produto (MVP)
- UX “enterprise fintech”: confiança, clareza, rastreabilidade de transações.
- Transparência: usuário entende o saldo de VaultCoins, a origem e consumo.
- Transparência: usuário entende prêmios (USDT), status e saques.

### Não-objetivos (neste ciclo)
- Pagamentos PIX/cartão (futuro).
- Multi-chain.
- Trading avançado.
- Depósito de stablecoin para jogos.

---

## 3. Escopo: MVP vs Futuro

### MVP (agora)
- Catálogo de NFTs e checkout crypto (Polygon).
- Cadastro/login (Neon Auth).
- Dashboard do usuário.
- VaultCoins (ledger + saldo).
- Experiências/mini-games usando VaultCoins.
- Prêmios USDT (Polygon) e saque.
- Afiliados (somente selecionados; fluxo controlado).
- P2P venda de NFTs por USDT (fase posterior do MVP, opcional dependendo do risco).

### Futuro
- PIX/cartão.
- Compra de NFTs com VaultCoins (e outros itens).
- Programas de fidelidade, tiers, assinaturas.
- Features sociais.

---

## 4. Personas

1) **Comprador (Collector/Buyer)**
- Compra NFTs e quer utilidade (VaultCoins + experiências).
- Valoriza estética, exclusividade e segurança.

2) **Jogador (Casual Gamer)**
- Quer experiências rápidas com chance de prêmio.
- Valoriza UX simples e feedback rápido.

3) **Afiliado (Selecionado)**
- Indica usuários e recebe recompensa (VaultCoins ou USDT, conforme política).
- Exige painel e tracking confiável.

4) **Operador/Admin (Risk Ops)**
- Precisa monitorar pedidos, crédito de coins, saques, fraude, afiliados.
- Requer trilhas, logs e aprovação manual quando necessário.

---

## 5. Jornadas do Usuário (MVP)

### 5.1 Compra de NFT → VaultCoins
1. Usuário acessa landing.
2. Navega no catálogo e escolhe NFT.
3. Vê detalhes (preço, bônus VaultCoins, supply/regras, termos).
4. Compra (wallet / crypto).
5. Após confirmação on-chain:
   - NFT aparece no vault/inventário
   - VaultCoins são creditadas

### 5.2 Uso das VaultCoins → Experiências
1. Usuário abre “Experiências”.
2. Seleciona mini-game.
3. Define quanto de VaultCoins deseja usar.
4. Sistema debita VaultCoins e cria sessão.
5. Resultado do jogo:
   - ou não gera prêmio
   - ou gera prêmio em USDT (Polygon) em estado “Earned/Locked/Available”

### 5.3 Saque de USDT (Polygon)
1. Usuário abre “Prêmios/Saques”.
2. Informa/seleciona carteira Polygon.
3. Solicita saque.
4. Sistema aplica verificações anti-fraude e regras.
5. Sistema envia USDT e registra tx.

---

## 6. Requisitos Funcionais (FR)

### 6.1 Identidade e Acesso
- **FR-001**: Cadastro/Login via Neon Auth.
- **FR-002**: Sessão persistente (lembrar login) com expiração e logout.
- **FR-003**: Controle de papéis (user/admin/affiliate).
- **FR-004**: “Invite-only / allowlist” para afiliados selecionados.
- **FR-005**: Vincular carteira Polygon ao usuário (com verificação de posse).

### 6.2 Marketplace (NFTs)
- **FR-101**: Landing pública com proposta de valor e CTA para catálogo.
- **FR-102**: Catálogo (lista) com filtros/pesquisa e paginação.
- **FR-103**: Página de detalhe do NFT (metadados, preço, bônus VaultCoins, termos).
- **FR-104**: Carrinho (opcional no MVP) e checkout (compra direta no MVP).
- **FR-105**: Criar pedido (order) no backend antes do pagamento on-chain.
- **FR-106**: Confirmar pagamento on-chain e marcar pedido como “PAID/CONFIRMED”.
- **FR-107**: Entregar NFT ao usuário (mint/transfer, dependendo do modelo).
- **FR-108**: Histórico de compras.

### 6.3 VaultCoins (moeda interna)
- **FR-201**: Creditar VaultCoins no mesmo valor do NFT comprado (regra 1:1).
- **FR-202**: Saldo calculado via **ledger** (não via saldo mutável).
- **FR-203**: Tela de extrato (entrada/saída) com filtros.
- **FR-204**: Debitar VaultCoins ao iniciar experiências.
- **FR-205**: Permitir uso futuro das VaultCoins para comprar itens (feature flag).

### 6.4 Experiências / Mini-games
- **FR-301**: Hub de experiências (lista de jogos/experiências).
- **FR-302**: Cada experiência deve:
  - aceitar VaultCoins como “custo”
  - executar resultado
  - produzir prêmio em USDT (Polygon) quando aplicável
- **FR-303**: A “verdade do resultado” deve ser server-side (ou verificável) para reduzir fraude.
- **FR-304**: Telemetria do jogo (sessões, spend, outcome, erros).
- **FR-305**: Bloqueios básicos anti-bot (rate limit, padrões de abuso).

### 6.5 Prêmios (USDT) e Saque
- **FR-401**: Registrar prêmios em ledger próprio (USDT).
- **FR-402**: Prêmios têm estados:
  - EARNED (gerado)
  - LOCKED (aguardando validações/limites)
  - AVAILABLE (apto a saque)
  - PAID (pago on-chain)
  - REJECTED/REVERSED (quando aplicável)
- **FR-403**: Usuário solicita saque (somente USDT Polygon).
- **FR-404**: Anti-fraude e limites (por usuário, por dia, por device).
- **FR-405**: Backoffice pode aprovar/reprovar/inspecionar saques.
- **FR-406**: Registrar tx hash e reconciliar status.

### 6.6 Afiliados
- **FR-501**: Afiliados selecionados possuem link/código de indicação.
- **FR-502**: Tracking de conversão (cadastro e/ou compra).
- **FR-503**: Regras: afiliado pode ganhar VaultCoins ou USDT (configurável).
- **FR-504**: Painel do afiliado (indicados, ganhos, status).

### 6.7 Venda P2P de NFTs (opcional no MVP / fase seguinte)
- **FR-601**: Usuário lista NFT para venda a outro usuário.
- **FR-602**: Venda somente por USDT (Polygon).
- **FR-603**: Transferência por ID do usuário (com personalização/alias).
- **FR-604**: Registro auditável de transferências.

---

## 7. Requisitos Não Funcionais (NFR)

### Performance e UX
- **NFR-001**: Páginas críticas (landing, catálogo) devem carregar rapidamente (otimização de assets).
- **NFR-002**: P95 do backend (endpoints principais) otimizado para edge.
- **NFR-003**: UI responsiva (mobile-first), sem layout shift relevante.
- **NFR-004**: Estados de loading/erro/empty sempre presentes.

### Escalabilidade e Manutenibilidade
- **NFR-101**: Arquitetura modular (Hexagonal + Self-Contained Features).
- **NFR-102**: Contratos de API versionados e documentados (OpenAPI).
- **NFR-103**: Evolução paralela (fronteiras por módulo e contratos).

### Segurança
- **NFR-201**: Logs e auditoria para fluxos econômicos (coins, prêmios, saques).
- **NFR-202**: Segredos e chaves nunca no client; rotação e controle de acesso.
- **NFR-203**: Rate limiting e mitigação básica de bots no edge.

---

## 8. Segurança e Anti-fraude (SEC)

> Nota: este documento descreve controles defensivos e de governança — não técnicas ofensivas.

- **SEC-001**: Ledger imutável para VaultCoins e prêmios (USDT).
- **SEC-002**: Idempotência para processar eventos on-chain (evita crédito duplicado).
- **SEC-003**: Regras de saque:
  - cooldown pós-compra/jogo
  - limites diários
  - score de risco
  - revisão manual quando necessário
- **SEC-004**: Sinais de fraude:
  - múltiplas contas/dispositivos
  - padrões de jogo anormais
  - tentativas repetidas de saque
- **SEC-005**: Logs de auditoria (quem, quando, o quê, antes/depois).
- **SEC-006**: Pentest e revisão de segurança como gate antes de produção.

---

## 9. Observabilidade (OBS)

- **OBS-001**: Correlation IDs por requisição.
- **OBS-002**: Logs estruturados (JSON) no backend.
- **OBS-003**: Métricas de funil:
  - landing → catálogo → compra
  - compra → crédito coins
  - coins → jogo
  - jogo → prêmio
  - prêmio → saque
- **OBS-004**: Alarmes para:
  - falhas de indexação on-chain
  - falhas de payout
  - spikes de fraude (tentativas)

---

## 10. Stack e Frameworks

### Frontend (confirmado no repo e recomendado manter)
- React + TypeScript + Vite
- Tailwind CSS (+ tailwind-merge / clsx)
- Framer Motion (micro-interações)
- Zustand (estado)
- React Router DOM v6 (rotas)
- shadcn/ui (Radix) + ícones

### Backend (alvo do projeto)
- Cloudflare Workers + Hono (API)
- Neon Postgres (DB)
- Neon Auth (Auth)
- Cloudflare Hyperdrive (pooling/rota rápida para Postgres)
- Cloudflare Queues/Cron (tarefas assíncronas e reconciliação)
- Zod + OpenAPI (contratos)

### Blockchain
- Polygon (rede base)
- USDT na Polygon (token de payout)

---

## 11. Estratégia de testes (alinhada com a política do projeto)

- Sempre:
  - lint
  - build
  - typecheck
- E2E “no uso”:
  - uso massivo do **MCP Playwright** em cenários reais (smoke flows)
- Backend:
  - validação de CRUD via chamadas REST (coleções HTTP/cURL)
- Testes massivos (unit/integration/e2e automatizados tradicionais):
  - entram **após** os fluxos funcionarem e antes de produção, para blindar regressões.

---

## 12. Riscos e Mitigações

- **Risco:** fraude em saques e multi-contas  
  **Mitigação:** ledger, idempotência, rate limit, risk scoring, revisão manual.

- **Risco:** complexidade on-chain (indexação, reorgs, duplicidades)  
  **Mitigação:** processador idempotente, reconciliação, filas, “at least once”.

- **Risco:** percepção regulatória (prize-like mechanics)  
  **Mitigação:** termos claros, políticas, geofencing, KYC/limites quando necessário, logs.

---

## 13. Glossário

- **VaultCoins:** moeda interna utilitária usada para experiências.
- **Prêmios:** valores em USDT (Polygon) obtidos nas experiências.
- **Ledger:** registro imutável (append-only) para auditoria e consistência.
