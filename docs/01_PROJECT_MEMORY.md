# 🧠 Project Memory

> **Diário de bordo do projeto Conecta Obras.**  
> Este documento é a fonte de verdade para o contexto atual, decisões recentes e próximos passos.

---

## 📍 Contexto Atual

| Campo | Valor |
|-------|-------|
| **Fase** | `Estruturação / Pré-MVP` |
| **Sprint** | `Documentação + Setup` |
| **Foco Principal** | Documentar sistema e preparar desenvolvimento |

### Stack Tecnológica

```
Frontend: Next.js 16.0.10+ (App Router) + React 19.2.0+ + TypeScript 5+
UI:       Tailwind CSS 4.1.9+ + shadcn/ui + Radix UI
Backend:  Supabase (Auth, Database, Storage, Edge Functions)
Database: PostgreSQL 15+
Deploy:   Vercel (Frontend) + Supabase Cloud (Backend)
APIs:     PH3 (pessoa física) + Azulx (CNPJ)
```

### Resumo do Produto

**Conecta Obras** é uma plataforma de mapeamento de obras para geração de leads, com:
- Pesquisa e filtragem de obras/empresas
- Enriquecimento de contatos via APIs
- CRM integrado para acompanhamento
- Hierarquia multi-tenant (ADM → Franquia → Loja → Vendedor)

---

## 🔧 Últimas Decisões Técnicas

| Data | Decisão | Justificativa |
|------|---------|---------------|
| 2026-01-12 | Nomenclatura Clean Code pt-BR | Padronização e legibilidade |
| 2026-01-12 | Vendedor só vê próprio CRM | Organização e privacidade |
| 2026-01-12 | Loja obrigatoriamente vinculada a Franquia | Hierarquia consistente |
| 2026-01-12 | Cache de consultas + cobrança | Economia + modelo de negócio |
| 2026-01-12 | CRM separado Obras/Empresas | Clareza na organização |
| 2026-01-12 | Chat IA flutuante em todas as telas | Acessibilidade |

> 💡 **Dica:** Para decisões complexas, crie um ADR usando `20_ARCH/23_adr_template.md`.

---

## 📋 Próximos Passos (Backlog Prioritário)

### MVP - Prioridade Alta

- [ ] `[P0]` Configurar projeto Next.js com estrutura documentada
- [ ] `[P0]` Criar conta Supabase e schema inicial
- [ ] `[P0]` Implementar autenticação (login, registro, recuperação)
- [ ] `[P0]` Criar trigger auth → public.usuarios
- [ ] `[P0]` Desenvolver Painel de cadastro (Franquia → Loja → Vendedor)
- [ ] `[P0]` Desenvolver página de Leads Obras com filtros

### Funcionalidades - Prioridade Média

- [ ] `[P1]` Integrar APIs PH3 e Azulx
- [ ] `[P1]` Modal de créditos antes de consulta
- [ ] `[P1]` CRM com Kanban, tags e histórico
- [ ] `[P1]` Dashboard com métricas e gráficos
- [ ] `[P1]` Relatórios automatizados por e-mail

### Roadmap - Prioridade Baixa

- [ ] `[P2]` Mapa de leads no CRM
- [ ] `[P2]` Deep Search com IA
- [ ] `[P2]` Módulo SDR

> **Legenda:**  
> `P0` = Crítico/Bloqueante | `P1` = Alta prioridade | `P2` = Média | `P3` = Baixa

---

## 🐛 Bugs Conhecidos

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| — | Projeto em fase de documentação | — | — |

---

## 📝 Notas de Sessão

### 2026-01-12

- ✅ Estrutura de documentação criada
- ✅ Guia de convenções de nomenclatura Clean Code pt-BR
- ✅ Estrutura de pastas Next.js documentada
- ✅ Template ADR criado
- ✅ Tech stack atualizado para Next.js
- ✅ **PRD completo documentado a partir da reunião**:
  - Visão do produto e personas
  - 80+ requisitos funcionais por módulo
  - 40+ user stories
  - Hierarquia de 5 tipos de usuários
  - Regras de negócio e permissões
  - Módulo de Leads documentado
  - Action items da reunião

---

## 📚 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [00_INDEX.md](./00_INDEX.md) | Índice geral da documentação |
| [11_requisitos_funcionais.md](./10_PRODUCT/11_requisitos_funcionais.md) | Lista de requisitos |
| [13_hierarquia_usuarios.md](./10_PRODUCT/13_hierarquia_usuarios.md) | Roles e permissões |
| [15_action_items.md](./10_PRODUCT/15_action_items.md) | Tarefas da reunião |
| [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) | Guia de nomenclatura |

---

<sub>Última atualização: 2026-01-12</sub>
