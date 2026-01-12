<!-- AI_CONTEXT: Este arquivo define a stack tecnológica e os padrões de código. Leia-o para entender COMO o sistema é construído e quais convenções seguir. -->

# 🛠️ Tech Stack & Padrões

> Definição da stack tecnológica e convenções de código do projeto **conectaObras**.

---

## 🎨 Frontend

### Core

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | `^14.x` | Framework React (App Router) |
| **React** | `^18.x` | UI Library |
| **TypeScript** | `^5.x` | Type Safety |

### UI & Styling

| Tecnologia | Propósito |
|------------|-----------|
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **Radix UI** | Primitivos acessíveis |
| **Lucide Icons** | Iconografia |

### State & Data

| Tecnologia | Propósito |
|------------|-----------|
| **TanStack Query** | Server state / caching |
| **Zustand** | Client state (quando necessário) |
| **React Hook Form** | Formulários |
| **Zod** | Validação de schemas |

---

## ⚙️ Backend

### Core

| Tecnologia | Propósito |
|------------|-----------|
| **Supabase** | BaaS (Auth, DB, Storage, Edge Functions) |
| **PostgreSQL** | Banco de dados relacional |
| **Deno** | Runtime para Edge Functions |

### Serviços Supabase

| Serviço | Uso |
|---------|-----|
| **Auth** | Autenticação e autorização |
| **Database** | Dados principais + RLS |
| **Storage** | Arquivos e documentos |
| **Edge Functions** | Lógica serverless |
| **Realtime** | Subscriptions (quando necessário) |

---

## 🗃️ Banco de Dados

### Especificações

| Aspecto | Valor |
|---------|-------|
| **Tipo** | PostgreSQL 15+ |
| **ORM/Client** | Supabase JS Client |
| **Migrations** | Supabase Migrations |
| **RLS** | Ativo em todas as tabelas |

### Convenções de Tabelas

```sql
-- Padrão de nomenclatura
tabela_nome          -- snake_case, plural
coluna_nome          -- snake_case
fk_tabela_id         -- foreign keys com prefixo

-- Colunas obrigatórias
id                   -- UUID, PK
created_at           -- TIMESTAMPTZ, default now()
updated_at           -- TIMESTAMPTZ, trigger
deleted_at           -- TIMESTAMPTZ, nullable (soft-delete)
```

> 📖 Consulte [21_convencoes_nomenclatura.md](./21_convencoes_nomenclatura.md) para convenções detalhadas.

---

## 📐 Padrões de Código

### Paradigma

| Aspecto | Padrão |
|---------|--------|
| **Paradigma** | Functional Programming (preferencial) |
| **Componentes** | Function Components + Hooks |
| **Imutabilidade** | Sempre (spread, map, filter) |

### Nomenclatura (Resumo)

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| **Variáveis** | camelCase, descritivo | `clienteSelecionado` |
| **Funções** | camelCase, verbo | `calcularTotal()` |
| **Componentes** | PascalCase, tipo+nome | `FormularioCliente` |
| **Arquivos** | kebab-case | `formulario-cliente.tsx` |
| **Hooks** | use + descrição | `useCriarObra` |
| **Types/Interfaces** | PascalCase | `TiposObra` |
| **Constantes** | UPPER_SNAKE | `LIMITE_ITENS_PAGINA` |
| **Booleanos** | prefixo descritivo | `estaCarregando`, `temErro` |

> 📖 Guia completo em [21_convencoes_nomenclatura.md](./21_convencoes_nomenclatura.md)

### Estrutura de Arquivos (Resumo)

```
src/
├── app/              # App Router (páginas)
├── components/
│   ├── ui/           # shadcn/ui components
│   └── compartilhados/
├── features/         # Módulos por domínio
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
├── hooks/            # Hooks globais
├── lib/              # Configurações (supabase, etc)
├── types/            # Types globais
└── utils/            # Funções utilitárias
```

> 📖 Estrutura detalhada em [22_estrutura_projeto.md](./22_estrutura_projeto.md)

### Regras de Linting

```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

## 🔒 Segurança

| Prática | Implementação |
|---------|---------------|
| **Auth** | Supabase Auth + JWT |
| **RLS** | Row Level Security em todas as tabelas |
| **Validação** | Zod no frontend, constraints no DB |
| **Secrets** | Variáveis de ambiente, nunca no código |

---

## 📦 Deploy & Infra

| Aspecto | Ferramenta |
|---------|------------|
| **Hosting Frontend** | Vercel |
| **Backend** | Supabase Cloud |
| **CI/CD** | GitHub Actions |
| **Monitoramento** | Supabase Dashboard + Vercel Analytics |

---

## 🔗 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [21_convencoes_nomenclatura.md](./21_convencoes_nomenclatura.md) | Guia completo de nomenclatura |
| [22_estrutura_projeto.md](./22_estrutura_projeto.md) | Estrutura de pastas detalhada |
| [23_adr_template.md](./23_adr_template.md) | Template para decisões arquiteturais |

---

<sub>Última atualização: 2026-01-12</sub>
