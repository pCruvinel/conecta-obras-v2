<!-- AI_CONTEXT: Este arquivo documenta o módulo de Autenticação. Consulte-o para login, registro e gestão de sessão. -->

# 📦 Módulo: Autenticação

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P0 |

---

## 📝 Resumo Executivo

> Este módulo gerencia **login, registro, recuperação de senha e sessão** do usuário usando **Supabase Auth**.

É o primeiro módulo a ser implementado - base para todo o sistema.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | Login e-mail/senha | ✅ | Autenticação básica |
| F02 | Registro externo | ✅ | Cadastro público (mockado/desabilitado) |
| F03 | Convite interno | ⏳ | Cadastro via link de convite |
| F04 | Recuperação de senha | ✅ | E-mail de reset (mockado) |
| F05 | Reset de senha | ⏳ | Formulário de nova senha |
| F06 | E-mails personalizados | ⏳ | Templates customizados |
| F07 | Modo convidado | ⏳ | Acesso limitado sem compra |
| F08 | Trigger auth → public | ✅ | Sincronizar usuários |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/login` | `src/app/(public)/login/page.tsx` | Página de login |
| `/registro` | `src/app/(public)/registro/page.tsx` | Registro público |
| `/convite/[token]` | `src/app/(public)/convite/[token]/page.tsx` | Aceitar convite |
| `/esqueci-senha` | `src/app/(public)/esqueci-senha/page.tsx` | Solicitar reset |
| `/resetar-senha` | `src/app/(public)/resetar-senha/page.tsx` | Nova senha |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/autenticacao/components/formulario-login.tsx` | Form | Login |
| `src/features/autenticacao/components/formulario-registro.tsx` | Form | Registro |
| `src/features/autenticacao/components/formulario-esqueci-senha.tsx` | Form | Solicitar reset |
| `src/features/autenticacao/components/formulario-reset-senha.tsx` | Form | Nova senha |
| `src/features/autenticacao/components/formulario-convite.tsx` | Form | Completar convite |
| `src/features/autenticacao/components/botao-logout.tsx` | Button | Sair |
| `src/features/autenticacao/components/provedor-auth.tsx` | Provider | Context de auth |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/autenticacao/hooks/use-auth.ts` | Context | Estado de autenticação |
| `src/features/autenticacao/hooks/use-login.ts` | Mutation | Fazer login |
| `src/features/autenticacao/hooks/use-logout.ts` | Mutation | Fazer logout |
| `src/features/autenticacao/hooks/use-registro.ts` | Mutation | Registrar |
| `src/features/autenticacao/hooks/use-reset-senha.ts` | Mutation | Resetar senha |
| `src/features/autenticacao/hooks/use-usuario-atual.ts` | Query | Dados do usuário |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/autenticacao/types/tipos-auth.ts` | Interfaces de auth |
| `src/features/autenticacao/types/tipos-usuario.ts` | Interface Usuario |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `auth.users` | Usuários (Supabase) |
| **Tabelas** | `public.usuarios` | Dados complementares |
| **Tabelas** | `convites_pendentes` | Convites não aceitos |
| **Triggers** | `trg_criar_usuario_publico` | Sincroniza auth → public |
| **Edge Functions** | `supabase/functions/enviar-convite` | E-mail de convite |

---

## 📊 Estruturas de Dados

### Usuario (Supabase Auth + Public)

```typescript
export interface Usuario {
  // De auth.users
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  
  // De public.usuarios
  nome: string;
  telefone?: string;
  avatar_url?: string;
  role: Role;
  franquia_id?: string;
  loja_id?: string;
  territorios: string[];
  ativo: boolean;
}

export type Role = 'admin' | 'franquia' | 'lojista' | 'vendedor' | 'convidado';
```

### Convite Pendente

```typescript
export interface ConvitePendente {
  id: string;
  email: string;
  nome: string;
  role: Role;
  franquia_id?: string;
  loja_id?: string;
  territorios: string[];
  convidado_por: string;
  token: string;
  expira_em: string;
  created_at: string;
}
```

### Schema do Banco

```sql
-- Tabela de usuários públicos
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  telefone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'convidado',
  franquia_id UUID REFERENCES franquias(id),
  loja_id UUID REFERENCES lojas(id),
  territorios TEXT[] DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger: criar registro em public.usuarios quando auth.users é criado
CREATE OR REPLACE FUNCTION fn_criar_usuario_publico()
RETURNS TRIGGER AS $$
DECLARE
  v_convite RECORD;
BEGIN
  -- Verificar se existe convite pendente
  SELECT * INTO v_convite
  FROM convites_pendentes
  WHERE email = NEW.email
  AND expira_em > now();
  
  IF FOUND THEN
    -- Criar com dados do convite
    INSERT INTO public.usuarios (id, email, nome, role, franquia_id, loja_id, territorios)
    VALUES (
      NEW.id,
      NEW.email,
      v_convite.nome,
      v_convite.role,
      v_convite.franquia_id,
      v_convite.loja_id,
      v_convite.territorios
    );
    
    -- Apagar convite usado
    DELETE FROM convites_pendentes WHERE id = v_convite.id;
  ELSE
    -- Registro público: role convidado
    INSERT INTO public.usuarios (id, email, nome, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
      'convidado'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_criar_usuario_publico
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_criar_usuario_publico();

-- Convites pendentes
CREATE TABLE convites_pendentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  role TEXT NOT NULL,
  franquia_id UUID REFERENCES franquias(id),
  loja_id UUID REFERENCES lojas(id),
  territorios TEXT[] DEFAULT '{}',
  convidado_por UUID NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
  expira_em TIMESTAMPTZ DEFAULT now() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔄 Fluxos de Dados

### Fluxo: Login

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │  Preenche   │ ──▶ │  Valida     │
│   Acessa    │     │ e-mail/senha│     │   Zod       │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ supabase.auth   │
                                    │ .signInWithPwd  │
                                    └────────┬────────┘
                              ┌──────────────┼──────────────┐
                              ▼ (sucesso)    ▼ (erro)       │
                     ┌───────────────┐ ┌───────────────┐    │
                     │ Busca dados   │ │ Exibe erro    │    │
                     │ public.user   │ │               │    │
                     └───────┬───────┘ └───────────────┘    │
                             │                               │
                             ▼                               │
                   ┌─────────────────┐                       │
                   │ Redirect para   │                       │
                   │ /dashboard      │                       │
                   └─────────────────┘
```

### Fluxo: Convite Interno

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Admin     │ ──▶ │  Preenche   │ ──▶ │  Cria em    │
│ (Form conv.)│     │   dados     │     │ conv_pend.  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ Edge Function   │
                                    │ enviar-convite  │
                                    └────────┬────────┘
                                             │
                                             ▼
                                   E-mail com link
                                   /convite/[token]
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Usuário clica   │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Form: senha +   │
                                    │ dados opcionais │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ supabase.auth   │
                                    │ .signUp()       │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Trigger cria    │
                                    │ public.usuarios │
                                    │ com dados conv. │
                                    └─────────────────┘
```

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@supabase/supabase-js` | SDK | Cliente auth |
| `@supabase/ssr` | Lib | Auth no server |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `useAuth()` | Hook | Todo o sistema |
| `useUsuarioAtual()` | Hook | Headers, sidebars |
| `ProvedorAuth` | Provider | Layout root |

---

## ⚠️ Regras de Negócio

### Fluxos de Registro

| Tipo | Role Inicial | Dados |
|------|--------------|-------|
| Registro público | `convidado` | Só e-mail/senha |
| Convite interno | Definido no convite | Nome, role, franquia, loja |

### Permissões de Convite

| Quem convida | Pode criar |
|--------------|------------|
| ADM | Qualquer role |
| Franquia | Lojista na sua franquia |
| Lojista | Vendedor na sua loja |

### Validações

```typescript
// Schema de login
const schemaLogin = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
});

// Schema de registro
const schemaRegistro = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmarSenha: z.string(),
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'],
});
```

---

## 🎨 UI/UX

### Página de Login

```
┌────────────────────────────────────────────────────────────┐
│                     🏗️ Conecta Obras                       │
│                                                            │
│    ┌──────────────────────────────────────────────────┐   │
│    │              Acesse sua conta                     │   │
│    ├──────────────────────────────────────────────────┤   │
│    │ E-mail:                                          │   │
│    │ [_______________________________________]        │   │
│    │                                                  │   │
│    │ Senha:                                           │   │
│    │ [_______________________________________] 👁️     │   │
│    │                                                  │   │
│    │ [Esqueci minha senha]                            │   │
│    │                                                  │   │
│    │         [       Entrar       ]                   │   │
│    ├──────────────────────────────────────────────────┤   │
│    │ Não tem conta? [Criar conta]                     │   │
│    └──────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| Login social (Google) | P2 | Facilita onboarding |
| 2FA para admins | P2 | Segurança |
| SSO para empresas | P3 | Enterprise |
| Timeout de sessão configurável | P2 | Segurança |

---

## 📌 Notas de Manutenção

- [ ] TODO: Configurar templates de e-mail no Supabase
- [ ] TODO: Implementar refresh token
- [ ] DEBT: Avaliar uso de cookies vs localStorage
- ⚠️ CUIDADO: Trigger deve rodar como SECURITY DEFINER

---

<sub>Módulo Autenticação v1.0 | Última atualização: 2026-01-12</sub>
