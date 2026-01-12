<!-- AI_CONTEXT: Este é o template padrão para documentar módulos/features. Duplique este arquivo e renomeie para o nome do módulo (ex: 31_auth.md, 32_checkout.md). -->

# 📦 [Nome do Módulo]

| Metadata | Valor |
|----------|-------|
| **Status** | `Draft` / `Dev` / `Stable` |
| **Última Atualização** | YYYY-MM-DD |
| **Owner** | @nome-do-responsavel |

---

## 📝 Resumo Executivo

<!-- Uma frase. O que este módulo faz? -->

> Este módulo [VERBO] [O QUÊ] para [QUEM/PROPÓSITO].

**Exemplo:** *Este módulo gerencia o fluxo de autenticação e controle de sessão do usuário.*

---

## 🗂️ Mapeamento de Arquivos

<!-- Liste TODOS os arquivos principais. A IA usará isso para navegar. -->

### Componentes/Views

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/features/[modulo]/components/...` | ... |
| `src/features/[modulo]/pages/...` | ... |

### Lógica/Hooks

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/features/[modulo]/hooks/use-...` | ... |
| `src/features/[modulo]/utils/...` | ... |

### Types

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/features/[modulo]/types/...` | ... |

### Backend (Supabase)

| Recurso | Localização |
|---------|-------------|
| **Tabelas** | `tabela_1`, `tabela_2` |
| **RPC Functions** | `fn_nome_da_funcao` |
| **Edge Functions** | `supabase/functions/[nome]` |
| **Policies (RLS)** | Ver migration `YYYYMMDD_...` |

---

## 🔄 Fluxo de Dados

<!-- Descreva a lógica sequencial. Seja específico. -->

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Trigger   │ ──▶ │   Process   │ ──▶ │   Result    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Step-by-Step

1. **[Input]** Usuário faz X na UI
2. **[Validação]** Hook `useX` valida com Zod schema
3. **[Mutation]** Chama `supabase.from('tabela').insert(...)`
4. **[Side Effect]** Trigger no DB executa Y
5. **[Response]** UI atualiza via TanStack Query invalidation

---

## 📊 Estruturas de Dados

<!-- JSONs de exemplo e schemas relevantes -->

### Input (Request)

```typescript
interface CreateXInput {
  campo1: string;
  campo2: number;
  campoOpcional?: boolean;
}
```

### Output (Response)

```typescript
interface XResponse {
  id: string;
  created_at: string;
  // ...
}
```

### Schema do Banco

```sql
CREATE TABLE nome_tabela (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo1 TEXT NOT NULL,
  campo2 INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ -- soft-delete
);
```

---

## 🔗 Dependências e Integrações

<!-- O que este módulo consome? O que ele expõe? -->

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/features/auth` | Módulo interno | Verificar sessão |
| `@/lib/supabase` | Lib | Cliente DB |
| `external-api.com` | API externa | Enviar notificação |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `useX()` | Hook | Páginas X, Y |
| `XProvider` | Context | App root |

---

## ⚠️ Regras de Ouro

<!-- O que NÃO fazer. Casos de borda. Validações críticas. -->

> **NUNCA:**

| ❌ Não Fazer | ✅ Fazer Isto | Motivo |
|-------------|---------------|--------|
| Deletar registro direto | Usar soft-delete (`deleted_at`) | Auditoria |
| Confiar em input do client | Validar no backend + RLS | Segurança |
| [Adicionar regra específica] | ... | ... |

### Casos de Borda

- **Caso 1:** Se X acontecer, o sistema deve Y
- **Caso 2:** Quando Z for null, assumir valor default W

### Validações Críticas

```typescript
// Exemplo: nunca permitir valor negativo
if (valor < 0) throw new Error('Valor não pode ser negativo');
```

---

## 🧪 Como Testar

<!-- Comandos ou passos para validar este módulo -->

```bash
# Testes unitários deste módulo
npm run test -- --grep="[NomeModulo]"

# Testar manualmente
1. Acessar /rota-do-modulo
2. Executar ação X
3. Verificar resultado Y
```

---

## 📌 Notas de Manutenção

<!-- Armadilhas conhecidas, dívidas técnicas, TODOs -->

- [ ] TODO: Implementar cache para query X
- [ ] DEBT: Refatorar componente Y (muito grande)
- ⚠️ CUIDADO: Não alterar ordem dos campos no schema Z

---

<sub>Template v1.0 | Última atualização do template: 2026-01-12</sub>
