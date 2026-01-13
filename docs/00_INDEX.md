# 📚 Índice da Documentação

> **Ponto de entrada para a memória de longo prazo do projeto Conecta Obras.**  
> Use este documento como mapa para navegar pela documentação.

---

## 🗂️ Estrutura

| Pasta | Descrição |
|-------|-----------|
| [RULES.md](./RULES.md) | **🔒 Regras imutáveis do projeto** ⭐ |
| [01_PROJECT_MEMORY.md](./01_PROJECT_MEMORY.md) | Diário de bordo — contexto, decisões e próximos passos |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | **Sistema de Design completo** ⭐ |
| [PRD.md](./PRD.md) | **Product Requirements Document** ⭐ |
| [10_PRODUCT/](./10_PRODUCT/) | Requisitos, PRDs, personas e regras de negócio |
| [20_ARCH/](./20_ARCH/) | Arquitetura, ADRs, diagramas e padrões técnicos |
| [30_MODULES/](./30_MODULES/) | Documentação por módulo/feature do sistema |

---

## 📖 Documentos Principais

### Produto (`10_PRODUCT/`)

| Documento | Descrição |
|-----------|-----------|
| [PRD.md](./PRD.md) | **📋 Product Requirements Document** ⭐ |
| [10_regras_globais.md](./10_PRODUCT/10_regras_globais.md) | Visão do produto, personas e mandamentos |
| [11_requisitos_funcionais.md](./10_PRODUCT/11_requisitos_funcionais.md) | **Requisitos por módulo** ⭐ |
| [12_historias_usuario.md](./10_PRODUCT/12_historias_usuario.md) | User stories por persona |
| [13_hierarquia_usuarios.md](./10_PRODUCT/13_hierarquia_usuarios.md) | **Roles e permissões** ⭐ |
| [15_action_items.md](./10_PRODUCT/15_action_items.md) | Action items da reunião |
| [16_backlog_desenvolvimento.md](./10_PRODUCT/16_backlog_desenvolvimento.md) | **Backlog (Pedro & Kassio)** 🚀 |

### Arquitetura (`20_ARCH/`)

| Documento | Descrição |
|-----------|-----------|
| [20_tech_stack.md](./20_ARCH/20_tech_stack.md) | Stack tecnológica (Next.js, Supabase, Tailwind) |
| [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) | **Guia Clean Code pt-BR** ⭐ |
| [22_estrutura_projeto.md](./20_ARCH/22_estrutura_projeto.md) | Estrutura de pastas do projeto |
| [database_schema.md](./20_ARCH/database_schema.md) | **Schema do Banco de Dados** ⭐ |
| [23_adr_template.md](./20_ARCH/23_adr_template.md) | Template para decisões arquiteturais |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | **Sistema de Design (UI/UX)** ⭐ |

### Módulos (`30_MODULES/`)

| Documento | Status | Descrição |
|-----------|--------|-----------|
| [31_leads.md](./30_MODULES/31_leads.md) | `Dev` | **Pesquisa de Obras/Empresas** ⭐ |
| [32_dashboard.md](./30_MODULES/32_dashboard.md) | `Dev` | Visão panorâmica de métricas |
| [33_crm.md](./30_MODULES/33_crm.md) | `Dev` | **Gestão de relacionamento** ⭐ |
| [34_consulta_plus.md](./30_MODULES/34_consulta_plus.md) | `Dev` | Busca livre CPF/CNPJ |
| [35_chat_ia.md](./30_MODULES/35_chat_ia.md) | `Dev` | Assistente de IA |
| [36_painel_adm.md](./30_MODULES/36_painel_adm.md) | `Dev` | **Gestão de usuários/orgs** ⭐ |
| [37_sdr.md](./30_MODULES/37_sdr.md) | `Draft` | Prospecção automatizada |
| [38_autenticacao.md](./30_MODULES/38_autenticacao.md) | `Dev` | **Login, registro, sessão** ⭐ |
| [_TEMPLATE_MODULO.md](./30_MODULES/_TEMPLATE_MODULO.md) | — | Template para documentar módulos |

---

## ⚡ Workflows do Time

Para iniciar sua sessão e carregar seu contexto:

- **Pedro**: Digite `/fluxo-pedro` (Carrega contexto de CRM, SDR, IA)
- **Kassio**: Digite `/fluxo-kassio` (Carrega contexto de Auth, Leads, Admin)

---

## 🚀 Comandos Úteis do Projeto

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build de produção
pnpm lint             # Verifica linting

# Testes
pnpm test             # Executa testes unitários
pnpm test:e2e         # Executa testes end-to-end

# Database (Supabase)
npx supabase start    # Inicia Supabase local
npx supabase db push  # Aplica migrations
npx supabase gen types typescript --local > src/types/supabase.ts
```

---

## 📖 Como Usar Esta Documentação

0. **🔒 Regras Imutáveis** → Leia `RULES.md` (resumo consolidado)
1. **Contexto Rápido** → Leia `01_PROJECT_MEMORY.md` primeiro
2. **Visão do Produto** → Consulte `PRD.md`
3. **Regras de Negócio** → Veja `10_regras_globais.md`
4. **O que fazer** → Veja `11_requisitos_funcionais.md`
5. **Quem faz o quê** → Veja `16_backlog_desenvolvimento.md`
6. **Quem pode o quê** → Consulte `13_hierarquia_usuarios.md`
7. **Como codificar** → Siga `21_convencoes_nomenclatura.md`
7. **Onde colocar** → Veja `22_estrutura_projeto.md`
8. **Como estilizar** → Consulte `DESIGN_SYSTEM.md`
9. **Detalhes de módulo** → Veja `30_MODULES/[modulo].md`

---

## 🎯 Visão Rápida do Sistema

**Conecta Obras** é uma plataforma de mapeamento de obras para geração de leads.

| Módulo | Descrição | Prioridade |
|--------|-----------|------------|
| **Autenticação** | Login, registro, sessão | P0 |
| **Painel ADM** | Gestão de usuários e organizações | P0 |
| **Dashboard** | Panorama geral das obras | P1 |
| **Leads** | Pesquisa de Obras, Empresas, Imóveis | P0 |
| **CRM** | Gestão de relacionamento com leads | P0 |
| **Consulta Plus** | Busca livre por CNPJ/CPF | P1 |
| **Chat IA** | Assistente de IA para pesquisas | P1 |
| **SDR** | Prospecção automatizada (futuro) | P2 |

---

<sub>Última atualização: 2026-01-12</sub>
