<!-- AI_CONTEXT: Este arquivo documenta o módulo SDR (Sales Development). Consulte-o para prospecção automatizada. -->

# 📦 Módulo: SDR (Sales Development Representative)

| Metadata | Valor |
|----------|-------|
| **Status** | `Draft` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P2 (Roadmap) |

---

## 📝 Resumo Executivo

> Este módulo automatiza a **prospecção de leads via WhatsApp**, permitindo **campanhas de disparo, sequências e tracking de respostas**.

Reduz trabalho manual do vendedor e aumenta conversão.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | Criar campanha | ⏳ | Definir nome, objetivo, período |
| F02 | Selecionar leads | ⏳ | Filtrar do CRM por tags/status |
| F03 | Templates de mensagem | ⏳ | Mensagens com variáveis |
| F04 | Agendamento de envios | ⏳ | Programar data/hora |
| F05 | Sequências multi-etapa | ⏳ | Follow-up automático |
| F06 | Tracking de respostas | ⏳ | Monitorar conversas |
| F07 | Métricas de campanha | ⏳ | Taxa de resposta, conversão |
| F08 | Integração CRM | ⏳ | Atualizar status automaticamente |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/sdr` | `src/app/(auth)/sdr/page.tsx` | Lista campanhas |
| `/sdr/nova` | `src/app/(auth)/sdr/nova/page.tsx` | Criar campanha |
| `/sdr/[id]` | `src/app/(auth)/sdr/[id]/page.tsx` | Detalhes/métricas |
| `/sdr/templates` | `src/app/(auth)/sdr/templates/page.tsx` | Gerenciar templates |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/sdr/components/tabela-campanhas.tsx` | Tabela | Listar campanhas |
| `src/features/sdr/components/formulario-campanha.tsx` | Form | Criar campanha |
| `src/features/sdr/components/seletor-leads.tsx` | Select | Escolher leads |
| `src/features/sdr/components/editor-template.tsx` | Editor | Criar template |
| `src/features/sdr/components/preview-mensagem.tsx` | Preview | Visualizar com variáveis |
| `src/features/sdr/components/timeline-sequencia.tsx` | Timeline | Etapas da sequência |
| `src/features/sdr/components/dashboard-campanha.tsx` | Charts | Métricas |
| `src/features/sdr/components/inbox-respostas.tsx` | Lista | Respostas recebidas |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/sdr/hooks/use-campanhas.ts` | Query | Listar campanhas |
| `src/features/sdr/hooks/use-criar-campanha.ts` | Mutation | Nova campanha |
| `src/features/sdr/hooks/use-templates.ts` | Query | Listar templates |
| `src/features/sdr/hooks/use-metricas-campanha.ts` | Query | Estatísticas |
| `src/features/sdr/hooks/use-respostas.ts` | Query | Inbox |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `campanhas_sdr` | Campanhas |
| **Tabelas** | `templates_mensagem` | Templates |
| **Tabelas** | `disparos_sdr` | Mensagens enviadas |
| **Tabelas** | `respostas_sdr` | Respostas recebidas |
| **Edge Functions** | `supabase/functions/disparar-whatsapp` | Envio via Evolution API |
| **Edge Functions** | `supabase/functions/webhook-evolution` | Receber respostas |

---

## 📊 Estruturas de Dados

### Campanha

```typescript
export interface Campanha {
  id: string;
  nome: string;
  descricao?: string;
  status: 'rascunho' | 'agendada' | 'em_andamento' | 'pausada' | 'concluida';
  tipo: 'disparo_unico' | 'sequencia';
  
  // Seleção de leads
  filtros_leads: FiltrosCRM;
  leads_selecionados: string[];
  
  // Agendamento
  data_inicio: string;
  data_fim?: string;
  horario_envio: string; // "09:00-18:00"
  dias_semana: number[]; // [1,2,3,4,5] = seg-sex
  
  // Métricas
  total_leads: number;
  enviados: number;
  entregues: number;
  lidos: number;
  respondidos: number;
  
  created_at: string;
  updated_at: string;
}

export interface TemplateMensagem {
  id: string;
  nome: string;
  conteudo: string; // "Olá {{nome}}, vi que você está construindo..."
  variaveis: string[]; // ['nome', 'obra_endereco']
  categoria: 'primeiro_contato' | 'follow_up' | 'proposta' | 'fechamento';
  created_at: string;
}

export interface Disparo {
  id: string;
  campanha_id: string;
  lead_id: string;
  template_id: string;
  etapa: number; // 1, 2, 3... para sequências
  
  mensagem_enviada: string; // Mensagem final com variáveis substituídas
  telefone_destino: string;
  
  status: 'pendente' | 'enviado' | 'entregue' | 'lido' | 'respondido' | 'erro';
  evolution_id?: string; // ID na Evolution API
  erro_mensagem?: string;
  
  enviado_em?: string;
  entregue_em?: string;
  lido_em?: string;
  respondido_em?: string;
}
```

### Schema do Banco

```sql
CREATE TABLE campanhas_sdr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loja_id UUID REFERENCES lojas(id) NOT NULL,
  criado_por UUID REFERENCES public.usuarios(id) NOT NULL,
  
  nome TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'rascunho',
  tipo TEXT DEFAULT 'disparo_unico',
  
  filtros_leads JSONB,
  leads_selecionados UUID[],
  
  data_inicio TIMESTAMPTZ,
  data_fim TIMESTAMPTZ,
  horario_envio TEXT DEFAULT '09:00-18:00',
  dias_semana INTEGER[] DEFAULT '{1,2,3,4,5}',
  
  total_leads INTEGER DEFAULT 0,
  enviados INTEGER DEFAULT 0,
  entregues INTEGER DEFAULT 0,
  lidos INTEGER DEFAULT 0,
  respondidos INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE templates_mensagem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loja_id UUID REFERENCES lojas(id),
  nome TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  variaveis TEXT[] DEFAULT '{}',
  categoria TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE disparos_sdr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas_sdr(id) NOT NULL,
  lead_id UUID REFERENCES leads_crm(id) NOT NULL,
  template_id UUID REFERENCES templates_mensagem(id),
  etapa INTEGER DEFAULT 1,
  
  mensagem_enviada TEXT NOT NULL,
  telefone_destino TEXT NOT NULL,
  
  status TEXT DEFAULT 'pendente',
  evolution_id TEXT,
  erro_mensagem TEXT,
  
  enviado_em TIMESTAMPTZ,
  entregue_em TIMESTAMPTZ,
  lido_em TIMESTAMPTZ,
  respondido_em TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔄 Fluxos de Dados

### Fluxo: Disparo de Campanha

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Cron Job    │ ──▶ │ Busca camp. │ ──▶ │ Busca leads │
│ (1min)      │     │ agendadas   │     │ pendentes   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ Para cada lead  │
                                    └────────┬────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          ▼                  ▼                  ▼
                 ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
                 │ Substitui     │ │ Chama Evol.   │ │ Atualiza      │
                 │ variáveis     │ │  API          │ │ status        │
                 └───────────────┘ └───────────────┘ └───────────────┘
                                          │
                                          ▼
                                ┌─────────────────┐
                                │ Webhook recebe  │
                                │ status/resposta │
                                └────────┬────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                 ┌───────────────┐┌───────────────┐┌───────────────┐
                 │ Atualiza      ││ Se respondeu  ││ Notifica      │
                 │ disparo       ││ → CRM update  ││ vendedor      │
                 └───────────────┘└───────────────┘└───────────────┘
```

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/lib/supabase` | Lib | Cliente do banco |
| `@/features/crm` | Módulo | Leads do CRM |
| Evolution API | API externa | Envio WhatsApp |

### APIs Externas

| API | Propósito | Custo |
|-----|-----------|-------|
| Evolution API | Envio/recebimento WhatsApp | Por mensagem |

---

## ⚠️ Regras de Negócio

### Limites

| Limite | Valor | Motivo |
|--------|-------|--------|
| Mensagens/dia | 100 | Evitar ban WhatsApp |
| Intervalo mínimo | 30s | Rate limit |
| Horário de envio | 09h-18h | Boas práticas |

### Validações

```typescript
// Validar número antes de enviar
const validarTelefone = (telefone: string): boolean => {
  const limpo = telefone.replace(/\D/g, '');
  return limpo.length >= 10 && limpo.length <= 13;
};

// Não enviar para quem já respondeu
const podeEnviar = (lead: Lead, campanha: Campanha): boolean => {
  const jaRespondeu = lead.disparos.some(d => 
    d.campanha_id === campanha.id && d.status === 'respondido'
  );
  return !jaRespondeu;
};
```

---

## 🎨 UI/UX

### Dashboard de Campanha

```
┌────────────────────────────────────────────────────────────┐
│ Campanha: Prospecção Janeiro       [⏸️ Pausar] [📊 Export] │
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ Enviados │ │Entregues │ │  Lidos   │ │Respondeu │       │
│ │   150    │ │   142    │ │    98    │ │    23    │       │
│ │          │ │   95%    │ │   69%    │ │   16%    │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├────────────────────────────────────────────────────────────┤
│ Funil de Conversão:                                        │
│ ████████████████████████░░░░░░░░ 95% Entregues            │
│ █████████████░░░░░░░░░░░░░░░░░░░ 69% Lidos                │
│ █████░░░░░░░░░░░░░░░░░░░░░░░░░░░ 16% Respondidos          │
└────────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| IA para personalizar mensagens | P2 | Melhor conversão |
| A/B Testing de templates | P2 | Otimização |
| Inbox unificado | P1 | Centralizar respostas |
| Integração com CRM automática | P0 | Atualizar status |

---

## 📌 Notas de Manutenção

- [ ] TODO: Implementar integração Evolution API
- [ ] TODO: Configurar webhooks
- [ ] DEBT: Avaliar limites WhatsApp Business
- ⚠️ CUIDADO: Evitar spam - respeitar opt-out

---

<sub>Módulo SDR v1.0 | Última atualização: 2026-01-12</sub>
