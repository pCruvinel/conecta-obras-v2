<!-- AI_CONTEXT: Este arquivo define a stack tecnológica e os padrões de código. Leia-o para entender COMO o sistema é construído e quais convenções seguir. -->

# 🛠️ Tech Stack & Padrões

> Definição da stack tecnológica e convenções de código do projeto.

---

## 🎨 Frontend

### Core

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | `^18.x` | UI Library |
| **TypeScript** | `^5.x` | Type Safety |
| **Vite** | `^5.x` | Build Tool |

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

---

## 📐 Padrões de Código

### Paradigma

| Aspecto | Padrão |
|---------|--------|
| **Paradigma** | Functional Programming (preferencial) |
| **Componentes** | Function Components + Hooks |
| **Imutabilidade** | Sempre (spread, map, filter) |

### Nomenclatura

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| **Variáveis** | camelCase, inglês | `const userName` |
| **Funções** | camelCase, verbo | `getUserById()` |
| **Componentes** | PascalCase | `UserProfile` |
| **Arquivos componentes** | kebab-case | `user-profile.tsx` |
| **Hooks** | use + PascalCase | `useUserData` |
| **Types/Interfaces** | PascalCase | `UserProfile` |
| **Constantes** | UPPER_SNAKE | `MAX_RETRY_COUNT` |

### Estrutura de Arquivos

```
src/
├── components/       # Componentes reutilizáveis
│   └── ui/          # shadcn/ui components
├── features/        # Módulos por domínio
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
├── hooks/           # Hooks globais
├── lib/             # Configurações (supabase, etc)
├── pages/           # Rotas/páginas
├── types/           # Types globais
└── utils/           # Funções utilitárias
```

### Regras de Linting

```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-any": "warn"
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
| **Monitoramento** | Supabase Dashboard |

---

<sub>Última atualização: 2026-01-12</sub>
