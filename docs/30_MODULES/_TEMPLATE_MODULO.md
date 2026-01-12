<!-- AI_CONTEXT: Este é o template padrão para documentar módulos/features. Duplique este arquivo e renomeie para o nome do módulo (ex: 32_dashboard.md, 33_crm.md). -->

# 📦 [Nome do Módulo]

| Metadata | Valor |
|----------|-------|
| **Status** | `Draft` / `Dev` / `Stable` |
| **Última Atualização** | YYYY-MM-DD |
| **Owner** | @nome-do-responsavel |
| **Prioridade** | P0 / P1 / P2 / P3 |

---

## 📝 Resumo Executivo

> Este módulo [VERBO] [O QUÊ] para [QUEM/PROPÓSITO].

**Exemplo:** *Este módulo gerencia o fluxo de autenticação e controle de sessão do usuário.*

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | [Nome] | ⏳/🔄/✅ | Descrição breve |
| F02 | [Nome] | ⏳/🔄/✅ | Descrição breve |

### Requisitos Relacionados

> Referência: [11_requisitos_funcionais.md](../10_PRODUCT/11_requisitos_funcionais.md)

| ID | Requisito |
|----|-----------|
| XXX-01 | Descrição do requisito |
| XXX-02 | Descrição do requisito |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/[modulo]` | `src/app/(auth)/[modulo]/page.tsx` | Página principal |
| `/[modulo]/novo` | `src/app/(auth)/[modulo]/novo/page.tsx` | Criar novo |
| `/[modulo]/[id]` | `src/app/(auth)/[modulo]/[id]/page.tsx` | Detalhes |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/[modulo]/components/tabela-[entidade].tsx` | Tabela | Listagem de dados |
| `src/features/[modulo]/components/formulario-[entidade].tsx` | Form | Criar/editar |
| `src/features/[modulo]/components/card-[entidade].tsx` | Card | Exibição resumida |
| `src/features/[modulo]/components/modal-[acao].tsx` | Modal | Ações específicas |
| `src/features/[modulo]/components/filtros-[entidade].tsx` | Filtros | Painel de filtros |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/[modulo]/hooks/use-[entidade]s.ts` | Query | Listagem |
| `src/features/[modulo]/hooks/use-[entidade]-por-id.ts` | Query | Fetch único |
| `src/features/[modulo]/hooks/use-criar-[entidade].ts` | Mutation | Criar registro |
| `src/features/[modulo]/hooks/use-atualizar-[entidade].ts` | Mutation | Atualizar registro |
| `src/features/[modulo]/hooks/use-excluir-[entidade].ts` | Mutation | Soft delete |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/[modulo]/types/tipos-[entidade].ts` | Interfaces, types, schemas Zod |

### Utils

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/[modulo]/utils/validadores.ts` | Funções de validação |
| `src/features/[modulo]/utils/formatadores.ts` | Funções de formatação |
| `src/features/[modulo]/utils/constantes.ts` | Enums, constantes |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `tabela_1`, `tabela_2` | Tabelas principais |
| **Views** | `vw_nome` | Views para consultas |
| **RPC Functions** | `fn_nome()` | Funções customizadas |
| **Edge Functions** | `supabase/functions/[nome]` | Lógica serverless |
| **Policies (RLS)** | Migration `YYYYMMDD_xxx` | Regras de acesso |
| **Triggers** | `trg_nome` | Automações |

---

## 📊 Estruturas de Dados

### Entidade Principal

```typescript
// tipos-[entidade].ts
export interface [Entidade] {
  id: string;
  // campos
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Criar[Entidade]Input {
  // campos obrigatórios para criação
}

export interface Atualizar[Entidade]Input {
  // campos opcionais para atualização
}
```

### Schema Zod

```typescript
import { z } from 'zod';

export const schema[Entidade] = z.object({
  campo1: z.string().min(1, 'Campo obrigatório'),
  campo2: z.number().positive('Deve ser positivo'),
  campoOpcional: z.string().optional(),
});

export type Dados[Entidade] = z.infer<typeof schema[Entidade]>;
```

### Schema do Banco

```sql
CREATE TABLE nome_tabela (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo1 TEXT NOT NULL,
  campo2 INTEGER,
  
  -- Foreign Keys
  usuario_id UUID REFERENCES public.usuarios(id),
  
  -- Timestamps obrigatórios
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ -- soft-delete
);

-- Índices
CREATE INDEX idx_nome_tabela_campo1 ON nome_tabela(campo1);

-- RLS
ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê apenas seus registros" ON nome_tabela
  FOR SELECT USING (usuario_id = auth.uid());
```

---

## 🔄 Fluxos de Dados

### Fluxo: [Nome do Fluxo Principal]

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │ Componente  │ ──▶ │    Hook     │ ──▶ │  Supabase   │
│   (Ação)    │     │   (Form)    │     │ (Mutation)  │     │   (DB)      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                    ┌─────────────┐     ┌─────────────┐          │
                    │     UI      │ ◀── │   Query     │ ◀────────┘
                    │ (Atualiza)  │     │ (Invalida)  │
                    └─────────────┘     └─────────────┘
```

### Step-by-Step

1. **[Input]** Usuário preenche formulário
2. **[Validação]** Zod schema valida dados
3. **[Mutation]** Hook chama `useCriar[Entidade]`
4. **[Request]** Supabase `.insert()` executa
5. **[Trigger]** Trigger atualiza `updated_at`
6. **[Invalidation]** `queryClient.invalidateQueries`
7. **[Update]** UI recarrega dados automaticamente

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/lib/supabase` | Lib | Cliente do banco |
| `@/features/autenticacao` | Módulo | Verificar sessão, usuário atual |
| `@/components/ui/*` | Componentes | Shadcn UI |
| `@tanstack/react-query` | Lib | Gerenciamento de estado |
| `react-hook-form` | Lib | Formulários |
| `zod` | Lib | Validação |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `use[Entidade]s()` | Hook | Páginas, outros módulos |
| `Tabela[Entidade]` | Componente | Páginas de listagem |
| `Formulario[Entidade]` | Componente | Páginas de criação/edição |
| `tipos*` | Types | Outros módulos |

### APIs Externas

| API | Propósito | Custo |
|-----|-----------|-------|
| [Nome API] | [Descrição] | [Créditos/chamada] |

---

## ⚠️ Regras de Negócio

### Mandamentos do Módulo

| ❌ Nunca | ✅ Sempre | Motivo |
|----------|----------|--------|
| Deletar registro | Usar soft-delete (`deleted_at`) | Auditoria |
| Confiar no client | Validar com RLS | Segurança |
| [Regra específica] | [Ação correta] | [Motivo] |

### Permissões por Role

| Role | Ação | Permitido |
|------|------|-----------|
| ADM | CRUD completo | ✅ |
| Franquia | Read + Create | ✅ |
| Lojista | Read + Create | ✅ |
| Vendedor | Read (próprios) | ✅ |
| Convidado | — | ❌ |

### Casos de Borda

- **Caso 1:** Se X acontecer → Fazer Y
- **Caso 2:** Quando Z for null → Assumir valor W
- **Caso 3:** Registro duplicado → Alert visual + permitir

### Validações Críticas

```typescript
// Validação obrigatória antes de salvar
if (!podeAcessar(usuario, registro)) {
  throw new Error('Acesso negado');
}

// Verificar créditos antes de consulta API
if (creditosDisponiveis < custoConsulta) {
  throw new Error('Créditos insuficientes');
}
```

---

## 🎨 UI/UX

### Telas do Módulo

| Tela | Rota | Layout |
|------|------|--------|
| Listagem | `/[modulo]` | Tabela + filtros |
| Detalhes | `/[modulo]/[id]` | Cards + tabs |
| Criar | `/[modulo]/novo` | Formulário |
| Editar | `/[modulo]/[id]/editar` | Formulário |

### Componentes Visuais

```
┌────────────────────────────────────────────────────────────┐
│ CabecalhoPagina: Título + Botões de Ação                   │
├────────────────────────────────────────────────────────────┤
│ FiltrosPainel (colapsável)                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────────────────┐│
│ │ Estado  │ │ Cidade  │ │ Status  │ │ 🔍 Buscar          ││
│ └─────────┘ └─────────┘ └─────────┘ └────────────────────┘│
├────────────────────────────────────────────────────────────┤
│ TabelaDados ou GridCards                                   │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Card/Linha 1  [Ações: 👁️ ✏️ 🗑️]                      │  │
│ │ Card/Linha 2  [Ações: 👁️ ✏️ 🗑️]                      │  │
│ │ Card/Linha 3  [Ações: 👁️ ✏️ 🗑️]                      │  │
│ └──────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│ Paginação: < 1 2 3 ... 10 >                                │
└────────────────────────────────────────────────────────────┘
```

### Estados de Loading/Error

```typescript
// Padrão obrigatório
if (estaCarregando) return <IndicadorCarregamento />;
if (temErro) return <MensagemErro erro={erro} />;
if (!temDados) return <EstadoVazio mensagem="Nenhum registro encontrado" />;
```

---

## 🧪 Como Testar

### Testes Unitários

```bash
pnpm test -- --grep="[NomeModulo]"
```

### Testes E2E

```bash
pnpm test:e2e -- --spec="[modulo].spec.ts"
```

### Teste Manual

```markdown
1. Acessar /[modulo]
2. Verificar se listagem carrega
3. Aplicar filtros e verificar resultado
4. Criar novo registro
5. Editar registro existente
6. Excluir registro (verificar soft-delete)
7. Verificar permissões por role
```

---

## 📌 Notas de Manutenção

### TODOs

- [ ] TODO: Implementar [funcionalidade]
- [ ] TODO: Adicionar [melhoria]

### Dívidas Técnicas

- [ ] DEBT: Refatorar [componente] (motivo)
- [ ] DEBT: Otimizar [query] (motivo)

### ⚠️ Cuidados

- ⚠️ CUIDADO: Não alterar [campo] sem migração
- ⚠️ CUIDADO: [Outra observação importante]

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| [Melhoria 1] | P1 | [Motivo] |
| [Melhoria 2] | P2 | [Motivo] |

---

<sub>Template v2.0 | Última atualização: 2026-01-12</sub>
