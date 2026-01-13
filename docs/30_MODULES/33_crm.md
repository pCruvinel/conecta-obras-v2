<!-- AI_CONTEXT: Módulo CRM completo com Kanban, Calendário, Chat WhatsApp e funcionalidades inovadoras. -->

# 📦 Módulo: CRM

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @pedro |
| **Prioridade** | P0 |

---

## 📝 Resumo Executivo

> Este módulo **gerencia o relacionamento com leads** salvos, permitindo **acompanhamento, agendamentos, comunicação via WhatsApp e histórico de interações** para converter oportunidades em vendas.

É o **coração comercial** do sistema onde o vendedor passa a maior parte do tempo gerenciando suas oportunidades.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição | Prioridade |
|----|---------|--------|-----------|------------|
| F01 | **Kanban Board** | ⏳ | Arrastar e soltar entre etapas do funil | P0 |
| F02 | **Calendário Completo** | ⏳ | Agendamentos, follow-ups, visitas | P0 |
| F03 | **Chat WhatsApp** | ⏳ | Integração Evolution API (mesmo do SDR) | P0 |
| F04 | CRM Obras/Empresas | ⏳ | Duas visões distintas com filtros | P0 |
| F05 | Timeline de Atividades | ⏳ | Histórico cronológico visual | P1 |
| F06 | Favoritos e Tags | ⏳ | Organização personalizada | P1 |
| F07 | Mapa de Leads | ⏳ | Visualização geográfica | P1 |
| F08 | Dashboard de Indicadores | ⏳ | Métricas e conversão | P1 |
| F09 | Automações | ⏳ | Regras de notificação | P2 |
| F10 | Sugestões IA | ⏳ | Próximas ações inteligentes | P2 |
| F11 | Upload de Arquivos | ⏳ | Propostas, orçamentos | P1 |
| F12 | Exportação Excel/PDF | ⏳ | Download de dados | P1 |

---

## 🏗️ Arquitetura de Telas

### Navegação Principal

```
/crm
├── /obras           → CRM de Obras (Kanban + Lista)
├── /empresas        → CRM de Empresas (Kanban + Lista)
├── /calendario      → Calendário Mensal/Semanal/Diário
├── /whatsapp        → Chat Integrado (Evolution API)
├── /favoritos       → Leads marcados
├── /mapa            → Visualização geográfica
└── /indicadores     → Dashboard de métricas
```

---

## 📊 F01: Painel Kanban

### Etapas do Funil (Customizáveis)

| Ordem | Etapa | Cor | Ícone | Descrição |
|-------|-------|-----|-------|-----------|
| 1 | **Seleção** | `slate` | 📋 | Lead capturado, sem contato |
| 2 | **Primeiro Contato** | `blue` | 📞 | Tentativa de contato inicial |
| 3 | **Não Respondeu** | `orange` | ⏰ | Aguardando retorno |
| 4 | **Em Negociação** | `amber` | 💬 | Conversando ativamente |
| 5 | **Proposta Enviada** | `violet` | 📩 | Orçamento/proposta entregue |
| 6 | **Fechado Ganho** | `emerald` | ✅ | Venda concluída |
| 7 | **Fechado Perdido** | `red` | ❌ | Lead descartado |

### Card do Lead

```
┌─────────────────────────────────────────┐
│ 🔴 Construtora ABC                      │ ← Temperatura (quente/morno/frio)
│ 📍 Campinas, SP                         │
│ 🏗️ Construção Residencial - 1.500m²    │
├─────────────────────────────────────────┤
│ 📅 Follow-up: 15/01 às 14h              │
│ 💰 R$ 50.000 (80% probabilidade)        │
│ 📝 "Aguardando aprovação do orçamento"  │
├─────────────────────────────────────────┤
│ 🏷️ #construtora #grande #urgente       │
├─────────────────────────────────────────┤
│ [👁️ Ver] [📱 WhatsApp] [📝 Nota] [⭐]  │
└─────────────────────────────────────────┘
```

### Componentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `KanbanBoard` | `kanban-board.tsx` | Container principal drag-and-drop |
| `KanbanColuna` | `kanban-coluna.tsx` | Uma etapa do funil |
| `KanbanCard` | `kanban-card.tsx` | Card do lead com ações rápidas |
| `ModalDetalhesCRM` | `modal-detalhes-crm.tsx` | Detalhes expandidos do lead |
| `FiltrosKanban` | `filtros-kanban.tsx` | Filtros (temperatura, tags, data) |

### Bibliotecas

```bash
# Drag and Drop
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 📅 F02: Calendário Completo

### Visões

| Visão | Descrição |
|-------|-----------|
| **Mensal** | Grade tradicional de calendário |
| **Semanal** | Timeline por hora (08:00-20:00) |
| **Diário** | Agenda do dia detalhada |
| **Agenda** | Lista cronológica próximos 30 dias |

### Tipos de Evento

| Tipo | Cor | Ícone | Descrição |
|------|-----|-------|-----------|
| Follow-up | `blue` | 📞 | Ligação de acompanhamento |
| Reunião | `violet` | 👥 | Reunião presencial/online |
| Visita | `emerald` | 🏗️ | Visita à obra |
| Proposta | `amber` | 📩 | Prazo para enviar proposta |
| Lembrete | `slate` | ⏰ | Lembrete genérico |

### Componentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `CalendarioCRM` | `calendario-crm.tsx` | Container principal |
| `CalendarioMensal` | `calendario-mensal.tsx` | Visão grade mensal |
| `CalendarioSemanal` | `calendario-semanal.tsx` | Visão timeline |
| `ModalNovoEvento` | `modal-novo-evento.tsx` | Criar/editar agendamento |
| `CardEvento` | `card-evento.tsx` | Evento no calendário |

### Bibliotecas

```bash
# Calendário
pnpm add react-big-calendar date-fns
# OU alternativa mais leve:
pnpm add @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
```

---

## 💬 F03: Chat WhatsApp Integrado

### Arquitetura

> **Mesma instância do SDR IA**: O chat usa a conexão Evolution API já configurada no módulo SDR, garantindo continuidade nas conversas.

```
┌─────────────────────────────────────────────────────────────┐
│ Chat WhatsApp                                    [🔍] [⚙️]  │
├────────────────────┬────────────────────────────────────────┤
│                    │                                        │
│  Lista de          │  Conversa                              │
│  Conversas         │                                        │
│                    │  ┌────────────────────────────────────┐│
│  ┌──────────────┐  │  │ João Silva (Construtora ABC)       ││
│  │ 🟢 João      │  │  │ Lead: Obra Campinas                ││
│  │ "Ok, aguard" │  │  └────────────────────────────────────┘│
│  └──────────────┘  │                                        │
│  ┌──────────────┐  │  ┌─────────────────────────┐           │
│  │ ⚪ Maria     │  │  │ Olá! Vi sua obra...    │ 14:30     │
│  │ "Obrigado"   │  │  └─────────────────────────┘           │
│  └──────────────┘  │          ┌─────────────────────────┐   │
│                    │          │ Sim, pode enviar        │   │
│  [+ Novo Chat]     │          │ o orçamento             │   │
│                    │          └─────────────────────────┘   │
│                    │                                        │
│                    │  ┌────────────────────────────────────┐│
│                    │  │ [📎] [Msg aqui...] [▶️ Enviar]     ││
│                    │  └────────────────────────────────────┘│
└────────────────────┴────────────────────────────────────────┘
```

### Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Lista de Conversas** | Ordenada por última mensagem, busca por nome |
| **Vinculação a Lead** | Cada chat vinculado a lead do CRM |
| **Histórico Completo** | Mensagens sincronizadas da Evolution API |
| **Templates** | Mensagens pré-definidas (saudação, follow-up) |
| **Anexos** | Enviar PDF, imagens, documentos |
| **Status Online** | Indicador se contato está online |
| **Notificações** | Badge com mensagens não lidas |

### Componentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `ChatWhatsApp` | `chat-whatsapp.tsx` | Container principal |
| `ListaConversas` | `lista-conversas.tsx` | Sidebar de conversas |
| `JanelaChat` | `janela-chat.tsx` | Área de mensagens |
| `InputMensagem` | `input-mensagem.tsx` | Campo de envio |
| `BolhaMensagem` | `bolha-mensagem.tsx` | Mensagem individual |
| `ModalTemplates` | `modal-templates.tsx` | Escolher template |

### Integração Evolution API

```typescript
// hooks/use-whatsapp.ts
export interface ConfiguracaoEvolution {
  baseUrl: string;       // URL da instância Evolution
  apiKey: string;        // API Key
  instanceName: string;  // Nome da instância (compartilhada com SDR)
}

export function useWhatsApp() {
  // Hooks para:
  // - Listar conversas
  // - Buscar mensagens
  // - Enviar mensagem
  // - Status da conexão
}
```

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/crm` | `page.tsx` | Redirect para obras |
| `/crm/obras` | `obras/page.tsx` | CRM de obras |
| `/crm/empresas` | `empresas/page.tsx` | CRM de empresas |
| `/crm/calendario` | `calendario/page.tsx` | Calendário |
| `/crm/whatsapp` | `whatsapp/page.tsx` | Chat integrado |
| `/crm/favoritos` | `favoritos/page.tsx` | Favoritos |
| `/crm/mapa` | `mapa/page.tsx` | Visualização geográfica |
| `/crm/indicadores` | `indicadores/page.tsx` | Métricas |

### Estrutura de Arquivos

```
src/features/crm/
├── components/
│   ├── kanban/
│   │   ├── kanban-board.tsx
│   │   ├── kanban-coluna.tsx
│   │   ├── kanban-card.tsx
│   │   └── filtros-kanban.tsx
│   ├── calendario/
│   │   ├── calendario-crm.tsx
│   │   ├── calendario-mensal.tsx
│   │   ├── calendario-semanal.tsx
│   │   ├── modal-novo-evento.tsx
│   │   └── card-evento.tsx
│   ├── whatsapp/
│   │   ├── chat-whatsapp.tsx
│   │   ├── lista-conversas.tsx
│   │   ├── janela-chat.tsx
│   │   ├── input-mensagem.tsx
│   │   ├── bolha-mensagem.tsx
│   │   └── modal-templates.tsx
│   ├── modal-detalhes-crm.tsx
│   ├── timeline-atividades.tsx
│   ├── painel-favoritos.tsx
│   ├── mapa-leads.tsx
│   ├── seletor-tags.tsx
│   └── upload-arquivos.tsx
├── hooks/
│   ├── use-leads-crm.ts
│   ├── use-lead-por-id.ts
│   ├── use-atualizar-etapa.ts
│   ├── use-criar-anotacao.ts
│   ├── use-agendamentos.ts
│   ├── use-criar-agendamento.ts
│   ├── use-favoritos.ts
│   ├── use-toggle-favorito.ts
│   ├── use-tags.ts
│   ├── use-whatsapp.ts
│   ├── use-conversas.ts
│   ├── use-enviar-mensagem.ts
│   └── use-indicadores.ts
├── types/
│   ├── tipos-crm.ts
│   ├── tipos-agendamento.ts
│   ├── tipos-atividade.ts
│   └── tipos-whatsapp.ts
├── utils/
│   ├── constantes-etapas.ts
│   └── formatadores.ts
└── index.ts
```

---

## 📊 Estruturas de Dados

### Lead no CRM

```typescript
// tipos-crm.ts
export interface LeadCRM {
  id: string;
  tipo: 'obra' | 'empresa';
  referencia_id: string;
  usuario_id: string;
  loja_id: string;
  
  // Pipeline
  etapa: EtapaLead;
  temperatura: 'quente' | 'morno' | 'frio';
  probabilidade: number; // 0-100
  valor_estimado?: number;
  
  // Dados da referência (join)
  obra?: Obra;
  empresa?: Empresa;
  
  // Contato principal
  contato_nome?: string;
  contato_telefone?: string;
  contato_email?: string;
  
  // Meta
  favorito: boolean;
  tags: Tag[];
  
  // Próximo agendamento
  proximo_agendamento?: Agendamento;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type EtapaLead = 
  | 'selecao'
  | 'primeiro_contato'
  | 'nao_respondeu'
  | 'negociando'
  | 'proposta_enviada'
  | 'fechado_ganho'
  | 'fechado_perdido';

export const ETAPAS_CONFIG: Record<EtapaLead, EtapaConfig> = {
  selecao: { ordem: 1, label: 'Seleção', cor: 'slate', icone: 'ClipboardList' },
  primeiro_contato: { ordem: 2, label: 'Primeiro Contato', cor: 'blue', icone: 'Phone' },
  nao_respondeu: { ordem: 3, label: 'Não Respondeu', cor: 'orange', icone: 'Clock' },
  negociando: { ordem: 4, label: 'Em Negociação', cor: 'amber', icone: 'MessageSquare' },
  proposta_enviada: { ordem: 5, label: 'Proposta Enviada', cor: 'violet', icone: 'Send' },
  fechado_ganho: { ordem: 6, label: 'Fechado Ganho', cor: 'emerald', icone: 'CheckCircle' },
  fechado_perdido: { ordem: 7, label: 'Fechado Perdido', cor: 'red', icone: 'XCircle' },
};
```

### Agendamento

```typescript
// tipos-agendamento.ts
export interface Agendamento {
  id: string;
  lead_id: string;
  usuario_id: string;
  
  titulo: string;
  descricao?: string;
  tipo: TipoAgendamento;
  
  data_inicio: string;
  data_fim: string;
  dia_inteiro: boolean;
  
  lembrete_minutos?: number; // 15, 30, 60, 1440 (1 dia)
  concluido: boolean;
  
  created_at: string;
}

export type TipoAgendamento = 
  | 'follow_up'
  | 'reuniao'
  | 'visita'
  | 'proposta'
  | 'lembrete';
```

### Conversa WhatsApp

```typescript
// tipos-whatsapp.ts
export interface Conversa {
  id: string;
  lead_id: string;
  telefone: string;
  nome_contato: string;
  foto_url?: string;
  
  ultima_mensagem?: string;
  ultima_mensagem_at?: string;
  nao_lidas: number;
  online: boolean;
  
  mensagens: Mensagem[];
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  
  tipo: 'texto' | 'imagem' | 'documento' | 'audio' | 'video';
  conteudo: string;
  media_url?: string;
  
  enviada: boolean; // true = enviada, false = recebida
  lida: boolean;
  
  created_at: string;
}
```

---

## 💾 Schema do Banco

```sql
-- =============================================
-- TABELAS PRINCIPAIS DO CRM
-- =============================================

-- Leads salvos no CRM
CREATE TABLE leads_crm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('obra', 'empresa')),
  referencia_id UUID NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  loja_id UUID REFERENCES lojas(id) NOT NULL,
  
  -- Pipeline
  etapa TEXT NOT NULL DEFAULT 'selecao',
  temperatura TEXT NOT NULL DEFAULT 'morno' CHECK (temperatura IN ('quente', 'morno', 'frio')),
  probabilidade INTEGER DEFAULT 50 CHECK (probabilidade BETWEEN 0 AND 100),
  valor_estimado DECIMAL(12,2),
  
  -- Contato
  contato_nome TEXT,
  contato_telefone TEXT,
  contato_email TEXT,
  
  -- Meta
  favorito BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_leads_crm_usuario ON leads_crm(usuario_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_crm_etapa ON leads_crm(etapa) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_crm_loja ON leads_crm(loja_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_leads_crm_unique ON leads_crm(usuario_id, tipo, referencia_id) WHERE deleted_at IS NULL;

-- =============================================
-- ANOTAÇÕES E ATIVIDADES
-- =============================================

CREATE TABLE anotacoes_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_crm(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  
  conteudo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'nota' CHECK (tipo IN ('nota', 'ligacao', 'email', 'visita', 'whatsapp')),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE atividades_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_crm(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  
  acao TEXT NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- AGENDAMENTOS
-- =============================================

CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_crm(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL DEFAULT 'follow_up',
  
  data_inicio TIMESTAMPTZ NOT NULL,
  data_fim TIMESTAMPTZ NOT NULL,
  dia_inteiro BOOLEAN DEFAULT false,
  
  lembrete_minutos INTEGER,
  concluido BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_agendamentos_usuario_data ON agendamentos(usuario_id, data_inicio);

-- =============================================
-- TAGS
-- =============================================

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loja_id UUID REFERENCES lojas(id) NOT NULL,
  
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT 'slate',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leads_tags (
  lead_id UUID REFERENCES leads_crm(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

-- =============================================
-- ARQUIVOS
-- =============================================

CREATE TABLE arquivos_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_crm(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'proposta', 'orcamento', 'contrato', 'outro'
  tamanho INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- CONVERSAS WHATSAPP
-- =============================================

CREATE TABLE conversas_whatsapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_crm(id) ON DELETE CASCADE NOT NULL,
  telefone TEXT NOT NULL,
  
  nome_contato TEXT,
  foto_url TEXT,
  jid TEXT, -- WhatsApp JID
  
  ultima_mensagem TEXT,
  ultima_mensagem_at TIMESTAMPTZ,
  nao_lidas INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mensagens_whatsapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID REFERENCES conversas_whatsapp(id) ON DELETE CASCADE NOT NULL,
  
  tipo TEXT NOT NULL DEFAULT 'texto',
  conteudo TEXT NOT NULL,
  media_url TEXT,
  
  enviada BOOLEAN NOT NULL, -- true = nós enviamos, false = recebemos
  lida BOOLEAN DEFAULT false,
  message_id TEXT, -- ID da Evolution API
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mensagens_conversa ON mensagens_whatsapp(conversa_id, created_at DESC);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE leads_crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE anotacoes_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivos_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_whatsapp ENABLE ROW LEVEL SECURITY;

-- Vendedor vê apenas seus leads
CREATE POLICY "vendedor_seus_leads" ON leads_crm
  FOR ALL USING (usuario_id = auth.uid());

-- Lojista vê todos da loja
CREATE POLICY "lojista_todos_loja" ON leads_crm
  FOR SELECT USING (
    loja_id IN (SELECT loja_id FROM public.usuarios WHERE id = auth.uid())
  );

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER trg_leads_crm_updated
  BEFORE UPDATE ON leads_crm
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_conversas_updated
  BEFORE UPDATE ON conversas_whatsapp
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Log automático de atividades
CREATE OR REPLACE FUNCTION fn_log_atividade_lead()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO atividades_leads (lead_id, usuario_id, acao, dados_anteriores, dados_novos)
  VALUES (
    NEW.id,
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'criou'
      WHEN OLD.etapa != NEW.etapa THEN 'mudou_etapa'
      WHEN OLD.temperatura != NEW.temperatura THEN 'mudou_temperatura'
      WHEN OLD.favorito != NEW.favorito THEN 'favorito'
      ELSE 'atualizou'
    END,
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_lead
  AFTER INSERT OR UPDATE ON leads_crm
  FOR EACH ROW EXECUTE FUNCTION fn_log_atividade_lead();
```

---

## 🔗 Dependências e Integrações

### Bibliotecas Necessárias

```bash
# Drag and Drop
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Calendário
pnpm add react-big-calendar date-fns
# OU
pnpm add @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

# Mapa
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet

# Exportação
pnpm add xlsx jspdf jspdf-autotable

# Gráficos (já instalado: recharts)
```

### Integrações

| Integração | Propósito | Status |
|------------|-----------|--------|
| **Evolution API** | Chat WhatsApp + SDR | Compartilhada |
| **Supabase Storage** | Upload de arquivos | Nativo |
| **Leaflet/OSM** | Mapa de leads | Gratuito |

---

## 📈 F08: Dashboard de Indicadores

### KPIs Principais

| KPI | Descrição | Cálculo |
|-----|-----------|---------|
| **Taxa Conversão** | % que fecha | (fechados ganhos / total) × 100 |
| **Ticket Médio** | Valor médio | Σ valores / nº vendas |
| **Tempo Médio** | Dias até fechar | Média (fechamento - criação) |
| **Leads por Etapa** | Distribuição | COUNT por etapa |
| **Previsão Receita** | Valor ponderado | Σ (valor × probabilidade) |

### Gráficos

| Gráfico | Tipo | Dados |
|---------|------|-------|
| Funil de Vendas | Funnel | Leads por etapa |
| Conversão Mensal | Bar | Ganhos vs Perdidos |
| Timeline | Line | Leads ao longo do tempo |
| Por Temperatura | Pie | Quente/Morno/Frio |

---

## ⚠️ Regras de Negócio

### Mandamentos do Módulo

| ❌ Nunca | ✅ Sempre | Motivo |
|----------|----------|--------|
| Deletar lead | Soft-delete | Histórico |
| Vendedor ver CRM alheio | Só seus leads | Privacidade |
| Ação sem log | Registrar atividade | Auditoria |
| Duplicar lead | Alertar e vincular | Consistência |

### Permissões por Role

| Role | Ver | Criar | Editar | Excluir | WhatsApp |
|------|-----|-------|--------|---------|----------|
| ADM | Todos | ✅ | ✅ | ✅ | ✅ |
| Franquia | Suas lojas | ❌ | ❌ | ❌ | ❌ |
| Lojista | Sua loja | ✅ | ✅ | ✅ | ✅ |
| Vendedor | Seus leads | ✅ | ✅ | ✅ | ✅ |

---

## 🎨 UI/UX - Design System

### Cores por Temperatura

```tsx
const CORES_TEMPERATURA = {
  quente: 'bg-red-500',
  morno: 'bg-amber-500',
  frio: 'bg-blue-500',
} as const;
```

### Componentes shadcn/ui Utilizados

| Componente | Uso |
|------------|-----|
| `Card` | Cards do Kanban, detalhes |
| `Badge` | Temperatura, tags, etapa |
| `Button` | Ações rápidas |
| `Dialog` | Modais de detalhes/edição |
| `Tabs` | Navegação dentro de detalhes |
| `Avatar` | Foto do contato |
| `Tooltip` | Dicas de ações |
| `Calendar` | Seleção de data |
| `Popover` | Seletor de cor/tags |
| `ScrollArea` | Listas longas |
| `Skeleton` | Loading states |

---

## 💡 Diferenciais Inovadores (Roadmap)

| Feature | Prioridade | Descrição |
|---------|------------|-----------|
| **Automações** | P1 | Regras: "Lead sem contato há 7 dias → notificação" |
| **Sugestões IA** | P2 | "Baseado no histórico, sugerimos ligar agora" |
| **Gamificação** | P2 | Rankings, metas, badges para vendedores |
| **Cadências SDR** | P1 | Iniciar sequência automática do SDR IA |
| **Previsão ML** | P3 | Probabilidade de conversão por ML |
| **NPS Integrado** | P2 | Pesquisa de satisfação pós-venda |

---

## 📌 Notas de Manutenção

### TODOs

- [ ] Implementar Kanban com @dnd-kit
- [ ] Integrar Evolution API para WhatsApp
- [ ] Criar calendário com react-big-calendar
- [ ] Adicionar mapa com react-leaflet
- [ ] Implementar exportação Excel/PDF

### Dívidas Técnicas

- [ ] DEBT: Otimizar query de indicadores com View materializada
- [ ] DEBT: Paginar mensagens do WhatsApp

### ⚠️ Cuidados

- ⚠️ CUIDADO: Trigger de log pode impactar performance em bulk updates
- ⚠️ CUIDADO: WhatsApp tem rate limits - implementar fila
- ⚠️ CUIDADO: Não expor API Key da Evolution no client

---

<sub>Módulo CRM v2.0 | Última atualização: 2026-01-12</sub>
