<!-- AI_CONTEXT: Este arquivo documenta o módulo Painel ADM. Consulte-o para gestão de usuários e organizações. -->

# 📦 Módulo: Painel Administrativo

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P0 |

---

## 📝 Resumo Executivo

> Este módulo permite **gestão de usuários, franquias, lojas, créditos e configurações** do sistema para **administradores e gestores**.

É o "backoffice" do sistema, acessível apenas para roles de gestão.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | Cadastro de Franquias | ⏳ | CRUD de franquias |
| F02 | Cadastro de Lojas | ⏳ | CRUD de lojas (vinculada à franquia) |
| F03 | Cadastro de Vendedores | ⏳ | CRUD de usuários |
| F04 | Distribuição de créditos | ⏳ | ADM → Franquia → Loja |
| F05 | Gestão de territórios | ⏳ | Definir estados/cidades |
| F06 | Configuração de APIs | ⏳ | Chaves PH3/Azulx |
| F07 | Logs de auditoria | ⏳ | Histórico de ações |
| F08 | Relatórios de faturamento | ⏳ | Consumo por organização |
| F09 | Convites por e-mail | ⏳ | Enviar convite de cadastro |

### Requisitos Relacionados

| ID | Requisito |
|----|-----------|
| ADM-01 a ADM-10 | Todos os requisitos do painel administrativo |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/admin` | `src/app/(auth)/admin/page.tsx` | Dashboard ADM |
| `/admin/franquias` | `src/app/(auth)/admin/franquias/page.tsx` | Listar franquias |
| `/admin/franquias/nova` | `src/app/(auth)/admin/franquias/nova/page.tsx` | Criar franquia |
| `/admin/lojas` | `src/app/(auth)/admin/lojas/page.tsx` | Listar lojas |
| `/admin/usuarios` | `src/app/(auth)/admin/usuarios/page.tsx` | Listar usuários |
| `/admin/creditos` | `src/app/(auth)/admin/creditos/page.tsx` | Gestão de créditos |
| `/admin/apis` | `src/app/(auth)/admin/apis/page.tsx` | Configurar APIs |
| `/admin/logs` | `src/app/(auth)/admin/logs/page.tsx` | Auditoria |
| `/admin/faturamento` | `src/app/(auth)/admin/faturamento/page.tsx` | Relatórios |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/admin/components/tabela-franquias.tsx` | Tabela | Listar franquias |
| `src/features/admin/components/formulario-franquia.tsx` | Form | Criar/editar franquia |
| `src/features/admin/components/tabela-lojas.tsx` | Tabela | Listar lojas |
| `src/features/admin/components/formulario-loja.tsx` | Form | Criar/editar loja |
| `src/features/admin/components/tabela-usuarios.tsx` | Tabela | Listar usuários |
| `src/features/admin/components/formulario-usuario.tsx` | Form | Criar/editar usuário |
| `src/features/admin/components/modal-distribuir-creditos.tsx` | Modal | Transferir créditos |
| `src/features/admin/components/seletor-territorios.tsx` | Select | Estados/cidades |
| `src/features/admin/components/tabela-logs.tsx` | Tabela | Auditoria |
| `src/features/admin/components/graficos-faturamento.tsx` | Charts | Relatórios |
| `src/features/admin/components/modal-convite.tsx` | Modal | Enviar convite |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/admin/hooks/use-franquias.ts` | Query | Listar franquias |
| `src/features/admin/hooks/use-criar-franquia.ts` | Mutation | Criar franquia |
| `src/features/admin/hooks/use-lojas.ts` | Query | Listar lojas |
| `src/features/admin/hooks/use-criar-loja.ts` | Mutation | Criar loja |
| `src/features/admin/hooks/use-usuarios.ts` | Query | Listar usuários |
| `src/features/admin/hooks/use-convidar-usuario.ts` | Mutation | Enviar convite |
| `src/features/admin/hooks/use-distribuir-creditos.ts` | Mutation | Transferir créditos |
| `src/features/admin/hooks/use-logs.ts` | Query | Auditoria |
| `src/features/admin/hooks/use-faturamento.ts` | Query | Relatórios |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/admin/types/tipos-franquia.ts` | Interface Franquia |
| `src/features/admin/types/tipos-loja.ts` | Interface Loja |
| `src/features/admin/types/tipos-usuario.ts` | Interface Usuario |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `franquias` | Franquias |
| **Tabelas** | `lojas` | Lojas |
| **Tabelas** | `usuarios` | Usuários (public) |
| **Tabelas** | `log_auditoria` | Ações do sistema |
| **Tabelas** | `creditos_organizacao` | Saldo de créditos |
| **RPC Functions** | `fn_distribuir_creditos()` | Transferência |
| **Edge Functions** | `supabase/functions/enviar-convite` | E-mail de convite |

---

## 📊 Estruturas de Dados

### Franquia

```typescript
export interface Franquia {
  id: string;
  nome: string;
  cnpj: string;
  responsavel_nome: string;
  responsavel_email: string;
  responsavel_telefone: string;
  territorios: string[]; // ['SP', 'RJ'] ou ['SP:Campinas', 'SP:Sorocaba']
  creditos_disponiveis: number;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}
```

### Loja

```typescript
export interface Loja {
  id: string;
  franquia_id: string;
  nome: string;
  cnpj?: string;
  endereco: string;
  cidade: string;
  estado: string;
  territorios: string[]; // Subconjunto da franquia
  creditos_disponiveis: number;
  ativa: boolean;
  created_at: string;
}
```

### Usuario (Completo)

```typescript
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  role: 'admin' | 'franquia' | 'lojista' | 'vendedor' | 'convidado';
  franquia_id?: string;
  loja_id?: string;
  territorios: string[];
  ativo: boolean;
  ultimo_acesso?: string;
  created_at: string;
}
```

### Schema do Banco

```sql
-- Hierarquia
CREATE TABLE franquias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  responsavel_nome TEXT NOT NULL,
  responsavel_email TEXT NOT NULL,
  territorios TEXT[] DEFAULT '{}',
  creditos_disponiveis INTEGER DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE lojas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franquia_id UUID REFERENCES franquias(id) NOT NULL,
  nome TEXT NOT NULL,
  cnpj TEXT,
  endereco TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  territorios TEXT[] DEFAULT '{}',
  creditos_disponiveis INTEGER DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Função: Distribuir créditos
CREATE OR REPLACE FUNCTION fn_distribuir_creditos(
  p_origem_tipo TEXT, -- 'admin' | 'franquia'
  p_origem_id UUID,
  p_destino_tipo TEXT, -- 'franquia' | 'loja'
  p_destino_id UUID,
  p_quantidade INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_saldo_origem INTEGER;
BEGIN
  -- Verificar saldo
  IF p_origem_tipo = 'admin' THEN
    -- Admin tem saldo infinito
    v_saldo_origem := p_quantidade;
  ELSIF p_origem_tipo = 'franquia' THEN
    SELECT creditos_disponiveis INTO v_saldo_origem
    FROM franquias WHERE id = p_origem_id;
  END IF;
  
  IF v_saldo_origem < p_quantidade THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;
  
  -- Debitar origem
  IF p_origem_tipo = 'franquia' THEN
    UPDATE franquias 
    SET creditos_disponiveis = creditos_disponiveis - p_quantidade
    WHERE id = p_origem_id;
  END IF;
  
  -- Creditar destino
  IF p_destino_tipo = 'franquia' THEN
    UPDATE franquias 
    SET creditos_disponiveis = creditos_disponiveis + p_quantidade
    WHERE id = p_destino_id;
  ELSIF p_destino_tipo = 'loja' THEN
    UPDATE lojas 
    SET creditos_disponiveis = creditos_disponiveis + p_quantidade
    WHERE id = p_destino_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔄 Fluxos de Dados

### Fluxo: Criar Novo Usuário (Convite)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Admin    │ ──▶ │  Preenche   │ ──▶ │   Chama     │
│   (Form)    │     │   Dados     │     │  Edge Func  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                          ┌────────────────────┼────────────────────┐
                          ▼                    ▼                    ▼
                 ┌───────────────┐   ┌───────────────┐    ┌───────────────┐
                 │ Cria registro │   │ Envia e-mail  │    │ Log auditoria │
                 │ pending_invite│   │ com link      │    │               │
                 └───────────────┘   └───────────────┘    └───────────────┘
                                            │
                                            ▼
                                  User clica no link
                                            │
                                            ▼
                                  ┌───────────────┐
                                  │ Completa      │
                                  │ cadastro      │
                                  └───────┬───────┘
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                 ┌───────────────┐┌───────────────┐┌───────────────┐
                 │ auth.users    ││ public.usuarios││ Ativa conta  │
                 │ (trigger)     ││ (com dados)   ││               │
                 └───────────────┘└───────────────┘└───────────────┘
```

---

## ⚠️ Regras de Negócio

### Hierarquia Obrigatória

| ❌ Nunca | ✅ Sempre | Motivo |
|----------|----------|--------|
| Loja sem Franquia | Vincular a uma Franquia | Hierarquia |
| Vendedor sem Loja | Vincular a uma Loja | Hierarquia |
| Território maior que pai | Subconjunto do pai | Controle |

### Permissões por Role

| Role | Franquias | Lojas | Usuários | Créditos | APIs |
|------|-----------|-------|----------|----------|------|
| ADM | CRUD | CRUD | CRUD | Distribuir | Config |
| Franquia | Ver própria | CRUD | Ver | Distribuir | — |
| Lojista | — | Ver própria | CRUD | Ver | — |
| Vendedor | — | — | — | Ver | — |

### Validação de Territórios

```typescript
// Território da Loja deve ser subconjunto da Franquia
const validarTerritorio = (lojaTerritorios: string[], franquiaTerritorios: string[]) => {
  return lojaTerritorios.every(t => franquiaTerritorios.includes(t));
};
```

---

## 🎨 UI/UX

### Dashboard Admin

```
┌────────────────────────────────────────────────────────────────┐
│ Painel Administrativo                                          │
├────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │Franquias │ │  Lojas   │ │ Usuários │ │ Créditos │           │
│ │    12    │ │    47    │ │   234    │ │ 45.000   │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├────────────────────────────────────────────────────────────────┤
│ Menu:                                                          │
│ [👥 Franquias] [🏪 Lojas] [👤 Usuários]                        │
│ [💳 Créditos] [🔑 APIs] [📊 Logs] [📈 Faturamento]             │
└────────────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| Importação em massa (Excel) | P2 | Cadastrar múltiplos usuários |
| Alertas de crédito baixo | P1 | Evitar interrupção de serviço |
| Relatório automatizado por e-mail | P2 | Gestão proativa |
| Dashboard personalizado por role | P1 | Informação relevante |

---

<sub>Módulo Painel ADM v1.0 | Última atualização: 2026-01-12</sub>
