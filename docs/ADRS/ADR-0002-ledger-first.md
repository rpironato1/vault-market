# ADR-0002 — Ledger-first para VaultCoins e Prêmios

**Status:** Aceito (v0.1)  
**Data:** 2026-01-16

## Contexto
Fluxos econômicos são alvo natural de fraude e inconsistência, especialmente em sistemas com eventos on-chain e reprocessamento.

## Decisão
Implementar:
- VaultCoins via ledger imutável (append-only)
- Prêmios USDT via ledger imutável
- Idempotência para eventos de crédito e payout

## Consequências
- Auditoria e rastreabilidade melhores
- Menos bugs de concorrência e reprocessamento
- Implementação um pouco mais detalhada (mas reduz risco total)
