# 📚 Índice da Documentação

> **Ponto de entrada para a memória de longo prazo do projeto conectaObras.**  
> Use este documento como mapa para navegar pela documentação.

---

## 🗂️ Estrutura

| Pasta | Descrição |
|-------|-----------|
| [01_PROJECT_MEMORY.md](./01_PROJECT_MEMORY.md) | Diário de bordo — contexto, decisões e próximos passos |
| [10_PRODUCT/](./10_PRODUCT/) | Requisitos, PRDs, personas e jornadas de usuário |
| [20_ARCH/](./20_ARCH/) | Arquitetura, ADRs, diagramas e padrões técnicos |
| [30_MODULES/](./30_MODULES/) | Documentação por módulo/feature do sistema |

---

## 📖 Documentos Principais

### Arquitetura (`20_ARCH/`)

| Documento | Descrição |
|-----------|-----------|
| [20_tech_stack.md](./20_ARCH/20_tech_stack.md) | Stack tecnológica (Next.js, Supabase, Tailwind) |
| [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) | **Guia Clean Code pt-BR** ⭐ |
| [22_estrutura_projeto.md](./20_ARCH/22_estrutura_projeto.md) | Estrutura de pastas do projeto |
| [23_adr_template.md](./20_ARCH/23_adr_template.md) | Template para decisões arquiteturais |

### Produto (`10_PRODUCT/`)

| Documento | Descrição |
|-----------|-----------|
| [10_regras_globais.md](./10_PRODUCT/10_regras_globais.md) | Visão do produto, personas e mandamentos |

### Módulos (`30_MODULES/`)

| Documento | Descrição |
|-----------|-----------|
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
2. **Convenções de Código** → Consulte `21_convencoes_nomenclatura.md` ⭐
3. **Entender o Produto** → Explore `10_PRODUCT/`
4. **Arquitetura** → Consulte `20_ARCH/` para decisões técnicas
5. **Detalhes de Módulos** → Navegue em `30_MODULES/`

---

<sub>Última atualização: 2026-01-12</sub>
