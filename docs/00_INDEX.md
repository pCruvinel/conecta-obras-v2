# 📚 Índice da Documentação

> **Ponto de entrada para a memória de longo prazo do projeto Conecta Obras.**  
> Use este documento como mapa para navegar pela documentação.

---

## 🗂️ Estrutura

| Pasta | Descrição |
|-------|-----------|
| [01_PROJECT_MEMORY.md](./01_PROJECT_MEMORY.md) | Diário de bordo — contexto, decisões e próximos passos |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | **Sistema de Design completo** ⭐ |
| [10_PRODUCT/](./10_PRODUCT/) | Requisitos, PRDs, personas e regras de negócio |
| [20_ARCH/](./20_ARCH/) | Arquitetura, ADRs, diagramas e padrões técnicos |
| [30_MODULES/](./30_MODULES/) | Documentação por módulo/feature do sistema |

---

## 📖 Documentos Principais

### Produto (`10_PRODUCT/`)

| Documento | Descrição |
|-----------|-----------|
| [10_regras_globais.md](./10_PRODUCT/10_regras_globais.md) | Visão do produto, personas e mandamentos |
| [11_requisitos_funcionais.md](./10_PRODUCT/11_requisitos_funcionais.md) | **Requisitos por módulo** ⭐ |
| [12_historias_usuario.md](./10_PRODUCT/12_historias_usuario.md) | User stories por persona |
| [13_hierarquia_usuarios.md](./10_PRODUCT/13_hierarquia_usuarios.md) | **Roles e permissões** ⭐ |
| [15_action_items.md](./10_PRODUCT/15_action_items.md) | Action items da reunião |

### Arquitetura (`20_ARCH/`)

| Documento | Descrição |
|-----------|-----------|
| [20_tech_stack.md](./20_ARCH/20_tech_stack.md) | Stack tecnológica (Next.js, Supabase, Tailwind) |
| [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) | **Guia Clean Code pt-BR** ⭐ |
| [22_estrutura_projeto.md](./20_ARCH/22_estrutura_projeto.md) | Estrutura de pastas do projeto |
| [23_adr_template.md](./20_ARCH/23_adr_template.md) | Template para decisões arquiteturais |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | **Sistema de Design (UI/UX)** ⭐ |

### Módulos (`30_MODULES/`)

| Documento | Descrição |
|-----------|-----------|
| [31_leads.md](./30_MODULES/31_leads.md) | **Módulo de Leads (Obras/Empresas)** ⭐ |
| [_TEMPLATE_MODULO.md](./30_MODULES/_TEMPLATE_MODULO.md) | Template para documentar módulos |

---

## 🚀 Comandos Úteis do Projeto

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)
npm run build        # Build de produção
npm run lint         # Verifica linting

# Testes
npm run test         # Executa testes unitários
npm run test:e2e     # Executa testes end-to-end

# Database (Supabase)
npx supabase start   # Inicia Supabase local
npx supabase db push # Aplica migrations
npx supabase gen types typescript --local > src/types/supabase.ts
```

---

## 📖 Como Usar Esta Documentação

1. **Contexto Rápido** → Leia `01_PROJECT_MEMORY.md` primeiro
2. **Regras de Negócio** → Consulte `10_regras_globais.md`
3. **O que fazer** → Veja `11_requisitos_funcionais.md`
4. **Quem pode o quê** → Consulte `13_hierarquia_usuarios.md`
5. **Como codificar** → Siga `21_convencoes_nomenclatura.md`
6. **Onde colocar** → Veja `22_estrutura_projeto.md`
7. **Como estilizar** → Consulte `DESIGN_SYSTEM.md`

---

## 🎯 Visão Rápida do Sistema

**Conecta Obras** é uma plataforma de mapeamento de obras para geração de leads.

| Módulo | Descrição |
|--------|-----------|
| **Dashboard** | Panorama geral das obras |
| **Leads** | Pesquisa de Obras, Empresas, Imóveis |
| **CRM** | Gestão de relacionamento com leads |
| **Consulta Plus** | Busca livre por CNPJ/CPF |
| **Chat IA** | Assistente de IA para pesquisas |
| **Painel ADM** | Gestão de usuários e APIs |
| **SDR** | Prospecção automatizada (futuro) |

---

<sub>Última atualização: 2026-01-12</sub>
