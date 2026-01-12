<!-- AI_CONTEXT: Este arquivo documenta o módulo Consulta Plus. Consulte-o para busca livre de CNPJ/CPF. -->

# 📦 Módulo: Consulta Plus

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P1 |

---

## 📝 Resumo Executivo

> Este módulo permite **busca livre de dados por CNPJ ou CPF**, independente de obra específica, para **enriquecer contatos** de leads avulsos.

Útil quando o vendedor tem uma lista externa de contatos e quer enriquecer.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | Busca por CPF | ⏳ | Consulta dados de pessoa física |
| F02 | Busca por CNPJ | ⏳ | Consulta dados de empresa |
| F03 | Histórico de consultas | ⏳ | Ver consultas anteriores |
| F04 | Consulta em lote | ⏳ | Upload de planilha |
| F05 | Exportação de resultados | ⏳ | Download CSV/Excel |
| F06 | Exibição de créditos | ⏳ | Mostrar saldo antes de consultar |

### Requisitos Relacionados

| ID | Requisito |
|----|-----------|
| CPLUS-01 | Buscar dados por CPF |
| CPLUS-03 | Histórico de consultas |
| CPLUS-04 | Exibir créditos antes da consulta |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/consulta-plus` | `src/app/(auth)/consulta-plus/page.tsx` | Página principal |
| `/consulta-plus/historico` | `src/app/(auth)/consulta-plus/historico/page.tsx` | Consultas anteriores |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/consulta-plus/components/formulario-consulta.tsx` | Form | Input CPF/CNPJ |
| `src/features/consulta-plus/components/resultado-consulta.tsx` | Card | Exibe dados retornados |
| `src/features/consulta-plus/components/modal-creditos.tsx` | Modal | Confirmar consumo |
| `src/features/consulta-plus/components/tabela-historico.tsx` | Tabela | Consultas anteriores |
| `src/features/consulta-plus/components/upload-lote.tsx` | Upload | Consulta em massa |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/consulta-plus/hooks/use-consultar-cpf.ts` | Mutation | Busca PH3 |
| `src/features/consulta-plus/hooks/use-consultar-cnpj.ts` | Mutation | Busca Azulx |
| `src/features/consulta-plus/hooks/use-historico-consultas.ts` | Query | Histórico |
| `src/features/consulta-plus/hooks/use-creditos.ts` | Query | Saldo de créditos |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/consulta-plus/types/tipos-consulta.ts` | Interfaces de consulta |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `consultas_ph3` | Cache de consultas PF |
| **Tabelas** | `consultas_azulx` | Cache de consultas PJ |
| **Tabelas** | `log_consumo_creditos` | Auditoria |
| **Edge Functions** | `supabase/functions/consultar-ph3` | Proxy para API |
| **Edge Functions** | `supabase/functions/consultar-azulx` | Proxy para API |

---

## 📊 Estruturas de Dados

### Consulta PH3 (Pessoa Física)

```typescript
export interface ConsultaPH3 {
  id: string;
  cpf: string;
  nome_completo: string;
  data_nascimento: string;
  telefones: string[];
  emails: string[];
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  created_at: string;
}

export interface ConsultaPH3Input {
  cpf?: string;
  nome?: string;
  data_nascimento?: string;
}
```

### Consulta Azulx (Pessoa Jurídica)

```typescript
export interface ConsultaAzulx {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  data_abertura: string;
  cnae_principal: string;
  telefones: string[];
  emails: string[];
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  socios: Array<{
    nome: string;
    cpf: string;
    qualificacao: string;
  }>;
  capital_social: number;
  created_at: string;
}
```

### Schema do Banco

```sql
-- Cache de consultas PH3
CREATE TABLE consultas_ph3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf TEXT NOT NULL,
  dados JSONB NOT NULL,
  consultado_por UUID REFERENCES public.usuarios(id),
  loja_id UUID REFERENCES lojas(id),
  custo_creditos INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_consultas_ph3_cpf ON consultas_ph3(cpf);

-- Log de consumo
CREATE TABLE log_consumo_creditos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  loja_id UUID REFERENCES lojas(id) NOT NULL,
  tipo_consulta TEXT NOT NULL, -- 'ph3', 'azulx'
  referencia_id UUID, -- ID na tabela de consultas
  creditos_consumidos INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔄 Fluxos de Dados

### Fluxo: Consultar CPF

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │   Digita    │ ──▶ │   Valida    │
│   Acessa    │     │    CPF      │     │   Formato   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ Verifica Cache  │
                                    │ (já consultou?) │
                                    └────────┬────────┘
                            ┌────────────────┼────────────────┐
                            ▼ (cache)        ▼ (novo)         │
                   ┌───────────────┐ ┌───────────────┐        │
                   │ Retorna dados │ │ Modal Créditos│        │
                   │    do cache   │ │ (confirmar)   │        │
                   └───────────────┘ └───────┬───────┘        │
                                             ▼                │
                                   ┌─────────────────┐        │
                                   │ Edge Function   │        │
                                   │ consultar-ph3   │        │
                                   └────────┬────────┘        │
                                            │                 │
                          ┌─────────────────┼─────────────────┤
                          ▼                 ▼                 ▼
                 ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
                 │ Salva Cache   │ │ Debita Créd.  │ │  Log Consumo  │
                 └───────────────┘ └───────────────┘ └───────────────┘
                                            │
                                            ▼
                                  ┌───────────────┐
                                  │ Exibe Dados   │
                                  └───────────────┘
```

---

## ⚠️ Regras de Negócio

### Mandamentos do Módulo

| ❌ Nunca | ✅ Sempre | Motivo |
|----------|----------|--------|
| Consultar sem créditos | Verificar saldo antes | Controle financeiro |
| Consultar sem confirmar | Modal de confirmação | Transparência |
| API externa sem log | Registrar consumo | Auditoria |
| Consulta repetida grátis | Cobrar mesmo do cache | Modelo de negócio |

### Custos por Consulta

| Tipo | Créditos |
|------|----------|
| PH3 (CPF simples) | 1 |
| PH3 (CPF completo) | 3 |
| Azulx (CNPJ) | 2 |
| Deep Search (futuro) | 5 |

---

## 🎨 UI/UX

### Layout

```
┌────────────────────────────────────────────────────────────┐
│ Consulta Plus                       💳 Créditos: 1.234     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ┌──────────────────────────────────────────────────┐    │
│   │  [CPF/CNPJ] ___.___.___-__  ou __.___.___/____-__│    │
│   │                                                    │    │
│   │              [🔍 Consultar]                        │    │
│   └──────────────────────────────────────────────────┘    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Resultado (se houver):                                     │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 👤 João Silva                                          ││
│ │ 📞 (11) 99999-9999, (11) 98888-8888                   ││
│ │ 📧 joao@email.com                                      ││
│ │ 📍 Rua das Flores, 123 - Campinas, SP                  ││
│ │                                                         ││
│ │ [📋 Copiar] [💾 Salvar no CRM] [📤 Exportar]           ││
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| Consulta em lote (planilha) | P2 | Produtividade |
| Histórico com busca | P1 | Economia de créditos |
| Pré-visualização antes de pagar | P2 | Evitar consultas inúteis |

---

<sub>Módulo Consulta Plus v1.0 | Última atualização: 2026-01-12</sub>
