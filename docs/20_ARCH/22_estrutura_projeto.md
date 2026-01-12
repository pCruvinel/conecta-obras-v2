<!-- AI_CONTEXT: Este arquivo define a estrutura de pastas do projeto Next.js. Consulte-o para entender ONDE cada tipo de arquivo deve ser criado. -->

# 📂 Estrutura do Projeto

> Organização de pastas e arquivos do projeto Next.js com App Router.

---

## 🏗️ Visão Geral

```
conectaObras/
├── docs/                    # Documentação do projeto
├── public/                  # Assets estáticos
├── src/
│   ├── app/                 # App Router (páginas e rotas)
│   ├── components/          # Componentes reutilizáveis
│   ├── features/            # Módulos por domínio
│   ├── hooks/               # Hooks globais
│   ├── lib/                 # Configurações e clients
│   ├── types/               # Tipagens globais
│   └── utils/               # Funções utilitárias globais
├── supabase/                # Migrations e Edge Functions
└── [arquivos de config]     # next.config, tailwind, etc
```

---

## 📱 App Router (`src/app/`)

### Estrutura de Rotas

```
src/app/
├── (auth)/                  # Grupo: páginas autenticadas
│   ├── layout.tsx           # Layout com sidebar/header
│   ├── dashboard/
│   │   └── page.tsx
│   ├── obras/
│   │   ├── page.tsx         # Lista de obras
│   │   ├── nova/
│   │   │   └── page.tsx     # Criar nova obra
│   │   └── [id]/
│   │       ├── page.tsx     # Detalhes da obra
│   │       └── editar/
│   │           └── page.tsx # Editar obra
│   ├── clientes/
│   │   └── ...
│   └── configuracoes/
│       └── ...
│
├── (public)/                # Grupo: páginas públicas
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── recuperar-senha/
│       └── page.tsx
│
├── api/                     # API Routes
│   ├── auth/
│   │   └── [...supabase]/
│   │       └── route.ts
│   └── webhooks/
│       └── route.ts
│
├── layout.tsx               # Root layout
├── page.tsx                 # Página inicial (redirect)
├── loading.tsx              # Loading global
├── error.tsx                # Error boundary global
└── not-found.tsx            # Página 404
```

### Convenções de Arquivos

| Arquivo | Propósito |
|---------|-----------|
| `page.tsx` | Componente da página (renderiza a rota) |
| `layout.tsx` | Layout compartilhado entre páginas |
| `loading.tsx` | UI de loading (Suspense automático) |
| `error.tsx` | Error boundary da rota |
| `not-found.tsx` | Página 404 do segmento |

---

## 🧩 Componentes (`src/components/`)

### Organização

```
src/components/
├── ui/                      # Componentes Shadcn/UI
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   └── ...
│
├── compartilhados/          # Componentes globais customizados
│   ├── cabecalho-pagina.tsx
│   ├── navegacao-lateral.tsx
│   ├── seletor-data.tsx
│   ├── paginacao.tsx
│   ├── campo-busca.tsx
│   └── indicador-carregamento.tsx
│
└── layouts/                 # Layouts reutilizáveis
    ├── layout-autenticado.tsx
    └── layout-publico.tsx
```

### Quando usar cada pasta

| Pasta | Usar quando |
|-------|-------------|
| `ui/` | Componentes Shadcn (gerenciados pelo CLI) |
| `compartilhados/` | Componentes usados em 2+ features |
| `layouts/` | Estruturas de página reutilizáveis |

---

## 📦 Features (`src/features/`)

### Estrutura por Domínio

```
src/features/
├── autenticacao/            # Auth, login, recuperação
│   ├── components/
│   │   ├── formulario-login.tsx
│   │   └── formulario-recuperar-senha.tsx
│   ├── hooks/
│   │   ├── use-autenticacao.ts
│   │   └── use-logout.ts
│   ├── types/
│   │   └── tipos-autenticacao.ts
│   └── index.ts
│
├── obras/                   # Gestão de obras
│   ├── components/
│   │   ├── formulario-obra.tsx
│   │   ├── tabela-obras.tsx
│   │   ├── card-obra.tsx
│   │   └── modal-detalhes-obra.tsx
│   ├── hooks/
│   │   ├── use-obras.ts
│   │   ├── use-obra-por-id.ts
│   │   ├── use-criar-obra.ts
│   │   └── use-atualizar-obra.ts
│   ├── types/
│   │   └── tipos-obra.ts
│   ├── utils/
│   │   └── validadores-obra.ts
│   └── index.ts
│
├── clientes/                # Gestão de clientes
│   └── ...
│
├── ordens-servico/          # OS's
│   └── ...
│
└── financeiro/              # Módulo financeiro
    └── ...
```

### Regras de Features

1. **Isolamento**: Feature não importa de outra feature diretamente
2. **Barrel export**: Todo export passa pelo `index.ts`
3. **Completude**: Components, hooks, types e utils juntos

---

## 🪝 Hooks Globais (`src/hooks/`)

```
src/hooks/
├── use-debounce.ts          # Debounce genérico
├── use-media-query.ts       # Responsividade
├── use-local-storage.ts     # Persistência local
├── use-clipboard.ts         # Copiar para clipboard
└── use-toast.ts             # Notificações
```

> **Regra**: Hooks específicos de domínio ficam em `features/[dominio]/hooks/`

---

## 📚 Lib (`src/lib/`)

### Configurações e Clients

```
src/lib/
├── supabase/
│   ├── client.ts            # Cliente browser
│   ├── server.ts            # Cliente server-side
│   └── middleware.ts        # Auth middleware
├── utils.ts                 # cn() e utilidades base
└── constantes.ts            # Constantes globais da app
```

---

## 🔤 Types (`src/types/`)

```
src/types/
├── supabase.ts              # Types gerados do Supabase
├── globais.ts               # Types compartilhados
└── api.ts                   # Types de responses/requests
```

---

## ⚡ Utils (`src/utils/`)

```
src/utils/
├── formatadores.ts          # formatarData, formatarMoeda, etc
├── validadores.ts           # validarCPF, validarEmail, etc
├── helpers.ts               # Funções auxiliares gerais
└── calculadora.ts           # Funções de cálculo
```

---

## 🗄️ Supabase (`supabase/`)

```
supabase/
├── config.toml              # Configuração local
├── migrations/              # Migrations SQL
│   ├── 20240101000000_create_clientes.sql
│   ├── 20240102000000_create_obras.sql
│   └── ...
├── functions/               # Edge Functions
│   ├── enviar-email/
│   │   └── index.ts
│   └── gerar-relatorio/
│       └── index.ts
└── seed.sql                 # Dados iniciais
```

---

## 📋 Arquivos de Configuração (Raiz)

| Arquivo | Propósito |
|---------|-----------|
| `next.config.ts` | Configuração do Next.js |
| `tailwind.config.ts` | Configuração do Tailwind |
| `tsconfig.json` | Configuração TypeScript |
| `components.json` | Configuração Shadcn/UI |
| `.env.local` | Variáveis de ambiente locais |
| `.env.example` | Template de variáveis |

---

## ✅ Checklist de Organização

Ao criar novos arquivos:

- [ ] Componente específico de feature → `features/[dominio]/components/`
- [ ] Componente usado em 2+ features → `components/compartilhados/`
- [ ] Hook específico de feature → `features/[dominio]/hooks/`
- [ ] Hook genérico → `hooks/`
- [ ] Type específico de feature → `features/[dominio]/types/`
- [ ] Type global → `types/`
- [ ] Utilitário específico → `features/[dominio]/utils/`
- [ ] Utilitário global → `utils/`

---

<sub>Última atualização: 2026-01-12</sub>
