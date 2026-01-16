# ADR-0001 — Estratégia de Arquitetura: Modular Monolith + Hex + SCS

**Status:** Aceito (v0.1)  
**Data:** 2026-01-16

## Contexto
O projeto precisa evoluir rápido, com base sólida e suporte a desenvolvimento paralelo, sem assumir o custo operacional de microserviços cedo.

## Decisão
Adotar:
- Monólito modular (no início)
- Hexagonal Architecture (Ports/Adapters)
- Organização por Self-Contained Features (SCS) no frontend
- Contratos contract-first em `packages/contracts`

## Consequências
- Menor custo operacional agora.
- Extração para microserviços/Workers separados permanece possível quando houver drivers reais.
