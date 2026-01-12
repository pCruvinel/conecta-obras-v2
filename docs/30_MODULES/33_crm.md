<!-- AI_CONTEXT: Este arquivo documenta o módulo CRM. Consulte-o para entender a gestão de relacionamento com leads. -->

# 📦 Módulo: CRM

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P0 |

---

## 📝 Resumo Executivo

> Este módulo **gerencia o relacionamento com leads** salvos, permitindo **acompanhamento, agendamentos e histórico de interações** para converter oportunidades em vendas.

É onde o vendedor passa a maior parte do tempo gerenciando suas oportunidades.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | CRM separado Obras/Empresas | ⏳ | Duas visões distintas |
| F02 | Visualização Kanban | ⏳ | Arrastar e soltar entre etapas |
| F03 | Agendamentos em calendário | ⏳ | Follow-ups programados |
| F04 | Favoritos | ⏳ | Leads marcados como favoritos |
| F05 | Acompanhamentos com status | ⏳ | Temperatura + Probabilidade |
| F06 | Histórico de atividades | ⏳ | Log de todas as ações |
| F07 | Tags personalizadas | ⏳ | Etiquetas customizáveis |
| F08 | Upload de arquivos | ⏳ | Anexar propostas, orçamentos |
| F09 | Mapa de leads | ⏳ | Visualização geográfica |
| F10 | Relatórios e indicadores | ⏳ | Métricas de performance |
| F11 | Exportação Excel/PDF | ⏳ | Download de dados |

### Requisitos Relacionados

> Referência: [11_requisitos_funcionais.md](../10_PRODUCT/11_requisitos_funcionais.md)

| ID | Requisito |
|----|-----------|
| CRM-01 a CRM-63 | Todos os requisitos do módulo CRM |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/crm` | `src/app/(auth)/crm/page.tsx` | Redirect para obras |
| `/crm/obras` | `src/app/(auth)/crm/obras/page.tsx` | CRM de obras |
| `/crm/empresas` | `src/app/(auth)/crm/empresas/page.tsx` | CRM de empresas |
| `/crm/agendamentos` | `src/app/(auth)/crm/agendamentos/page.tsx` | Calendário |
| `/crm/favoritos` | `src/app/(auth)/crm/favoritos/page.tsx` | Favoritos |
| `/crm/indicadores` | `src/app/(auth)/crm/indicadores/page.tsx` | Métricas |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/crm/components/kanban-leads.tsx` | Kanban | Board arrastar/soltar |
| `src/features/crm/components/coluna-kanban.tsx` | Coluna | Uma etapa do funil |
| `src/features/crm/components/card-lead-crm.tsx` | Card | Lead no Kanban |
| `src/features/crm/components/modal-acompanhamento.tsx` | Modal | Editar status/notas |
| `src/features/crm/components/calendario-agendamentos.tsx` | Calendário | Visualização mensal |
| `src/features/crm/components/tabela-leads-crm.tsx` | Tabela | Listagem alternativa |
| `src/features/crm/components/painel-detalhes-lead.tsx` | Painel | Detalhes expandidos |
| `src/features/crm/components/historico-atividades.tsx` | Timeline | Log de ações |
| `src/features/crm/components/formulario-anotacao.tsx` | Form | Adicionar nota |
| `src/features/crm/components/seletor-tags.tsx` | Select | Escolher tags |
| `src/features/crm/components/upload-arquivos.tsx` | Upload | Anexar documentos |
| `src/features/crm/components/mapa-leads.tsx` | Mapa | Visualização geográfica |
| `src/features/crm/components/graficos-relatorios.tsx` | Charts | Métricas visuais |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/crm/hooks/use-leads-crm.ts` | Query | Listar leads do usuário |
| `src/features/crm/hooks/use-lead-por-id.ts` | Query | Detalhes de um lead |
| `src/features/crm/hooks/use-atualizar-status.ts` | Mutation | Mudar etapa/temperatura |
| `src/features/crm/hooks/use-criar-anotacao.ts` | Mutation | Adicionar nota |
| `src/features/crm/hooks/use-agendamentos.ts` | Query | Listar agendamentos |
| `src/features/crm/hooks/use-criar-agendamento.ts` | Mutation | Novo agendamento |
| `src/features/crm/hooks/use-favoritos.ts` | Query | Leads favoritos |
| `src/features/crm/hooks/use-toggle-favorito.ts` | Mutation | Favoritar/desfavoritar |
| `src/features/crm/hooks/use-tags.ts` | Query | Listar tags disponíveis |
| `src/features/crm/hooks/use-atribuir-tag.ts` | Mutation | Adicionar tag a lead |
| `src/features/crm/hooks/use-indicadores.ts` | Query | Métricas agregadas |
| `src/features/crm/hooks/use-historico.ts` | Query | Atividades do lead |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/crm/types/tipos-crm.ts` | Interfaces principais |
| `src/features/crm/types/tipos-acompanhamento.ts` | Status, temperatura, probabilidade |
| `src/features/crm/types/tipos-agendamento.ts` | Agendamentos |
| `src/features/crm/types/tipos-atividade.ts` | Histórico |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `leads_crm` | Lead salvo no CRM |
| **Tabelas** | `anotacoes_leads` | Notas por lead |
| **Tabelas** | `agendamentos` | Agendamentos |
| **Tabelas** | `tags` | Tags disponíveis |
| **Tabelas** | `leads_tags` | Relação N:N |
| **Tabelas** | `arquivos_leads` | Anexos |
| **Tabelas** | `atividades_leads` | Log de ações |
| **RPC Functions** | `fn_indicadores_crm()` | Métricas agregadas |

---

## 📊 Estruturas de Dados

### Lead no CRM

```typescript
// tipos-crm.ts
export interface LeadCRM {
  id: string;
  tipo: 'obra' | 'empresa';
  referencia_id: string; // ID da obra ou empresa
  usuario_id: string;
  loja_id: string;
  
  // Status
  etapa: EtapaLead;
  temperatura: TemperaturaLead;
  probabilidade: number; // 10-100
  
  // Dados da referência (join)
  obra?: Obra;
  empresa?: Empresa;
  
  // Meta
  favorito: boolean;
  tags: Tag[];
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type EtapaLead = 
  | 'selecao'
  | 'contato'
  | 'nao_respondeu'
  | 'negociando'
  | 'proposta_enviada'
  | 'fechado_ganho'
  | 'fechado_perdido';

export type TemperaturaLead = 'quente' | 'morno' | 'frio';
```

### Anotação

```typescript
export interface Anotacao {
  id: string;
  lead_id: string;
  usuario_id: string;
  conteudo: string;
  tipo: 'nota' | 'ligacao' | 'email' | 'visita' | 'whatsapp';
  created_at: string;
}
```

### Agendamento

```typescript
export interface Agendamento {
  id: string;
  lead_id: string;
  usuario_id: string;
  titulo: string;
  descricao?: string;
  data_hora: string;
  duracao_minutos: number;
  concluido: boolean;
  created_at: string;
}
```

### Schema do Banco

```sql
-- Tabela principal do CRM
CREATE TABLE leads_crm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('obra', 'empresa')),
  referencia_id UUID NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  loja_id UUID REFERENCES lojas(id) NOT NULL,
  
  etapa TEXT NOT NULL DEFAULT 'selecao',
  temperatura TEXT NOT NULL DEFAULT 'morno',
  probabilidade INTEGER DEFAULT 50 CHECK (probabilidade BETWEEN 0 AND 100),
  favorito BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- RLS: Vendedor vê apenas seus leads
ALTER TABLE leads_crm ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vendedor_ve_seus_leads" ON leads_crm
  FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "vendedor_cria_seus_leads" ON leads_crm
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "vendedor_atualiza_seus_leads" ON leads_crm
  FOR UPDATE USING (usuario_id = auth.uid());

-- Lojista vê todos da loja
CREATE POLICY "lojista_ve_loja" ON leads_crm
  FOR SELECT USING (
    loja_id IN (
      SELECT loja_id FROM public.usuarios WHERE id = auth.uid()
    )
  );

-- Histórico de atividades
CREATE TABLE atividades_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_crm(id) NOT NULL,
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  acao TEXT NOT NULL, -- 'criou', 'mudou_etapa', 'anotou', 'agendou', etc.
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para log automático
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

## 🔄 Fluxos de Dados

### Fluxo: Mover Lead no Kanban

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │   Arrasta   │ ──▶ │ onDragEnd   │
│   (Drag)    │     │    Card     │     │  Handler    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                     ┌─────────────────┐
                                     │ useAtualizarSta │
                                     │  tus.mutate()   │
                                     └────────┬────────┘
                                               │
            ┌──────────────────────────────────┼──────────────┐
            ▼                                  ▼              ▼
    ┌───────────────┐               ┌───────────────┐  ┌────────────┐
    │  UPDATE DB    │               │ Trigger Log   │  │ Invalidate │
    │  leads_crm    │               │  Atividade    │  │   Query    │
    └───────────────┘               └───────────────┘  └────────────┘
                                                              │
                                                              ▼
                                                    ┌───────────────┐
                                                    │ UI Atualiza   │
                                                    │ Automaticam.  │
                                                    └───────────────┘
```

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/lib/supabase` | Lib | Cliente do banco |
| `@/features/autenticacao` | Módulo | Usuário, loja |
| `@/features/leads` | Módulo | Dados de obras/empresas |
| `@dnd-kit/core` | Lib | Drag and drop |
| `react-big-calendar` | Lib | Calendário |
| `leaflet` / `react-leaflet` | Lib | Mapa |
| `xlsx` / `jspdf` | Lib | Exportação |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `useLeadsCRM()` | Hook | Páginas CRM |
| `KanbanLeads` | Componente | Página obras/empresas |
| `useCriarLeadCRM()` | Hook | Módulo Leads |

---

## ⚠️ Regras de Negócio

### Mandamentos do Módulo

| ❌ Nunca | ✅ Sempre | Motivo |
|----------|----------|--------|
| Deletar lead do CRM | Soft-delete | Histórico |
| Vendedor ver CRM alheio | Mostrar só seus leads | Privacidade |
| Ação sem log | Registrar atividade | Auditoria |

### Permissões por Role

| Role | Ver | Criar | Editar | Excluir |
|------|-----|-------|--------|---------|
| ADM | Todos | ✅ | ✅ | ✅ |
| Franquia | Suas lojas | ❌ | ❌ | ❌ |
| Lojista | Sua loja | ✅ | ✅ | ✅ |
| Vendedor | Seus leads | ✅ | ✅ | ✅ |

### Casos de Borda

- **Lead já existe:** Se obra/empresa já está no CRM do mesmo usuário → não duplicar
- **Lead de outro vendedor:** Mostrar alerta com info, mas permitir adicionar
- **Sem leads:** Estado vazio com call-to-action para pesquisar

---

## 🎨 UI/UX

### Layout Kanban

```
┌────────────────────────────────────────────────────────────────────┐
│ CRM Obras          [📊 Visão: Kanban ▼] [📤 Exportar] [🔍 Buscar]  │
├────────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ Seleção  │ │ Contato  │ │Negociando│ │ Proposta │ │ Fechado  │  │
│ │   (12)   │ │   (8)    │ │   (5)    │ │   (3)    │ │   (2)    │  │
│ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤  │
│ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │  │
│ │ │Card 1│ │ │ │Card 1│ │ │ │Card 1│ │ │ │Card 1│ │ │ │Card 1│ │  │
│ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │  │
│ │ ┌──────┐ │ │ ┌──────┐ │ │ ┌──────┐ │ │          │ │          │  │
│ │ │Card 2│ │ │ │Card 2│ │ │ │Card 2│ │ │          │ │          │  │
│ │ └──────┘ │ │ └──────┘ │ │ └──────┘ │ │          │ │          │  │
│ │   ...    │ │   ...    │ │   ...    │ │          │ │          │  │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### Card no Kanban

```
┌──────────────────────────────────┐
│ 🔴 Construtora ABC               │  ← Temperatura (cor)
│ 📍 Campinas, SP                  │
│ 🏗️ Construção - 1.500m²          │
├──────────────────────────────────┤
│ 📅 Follow-up: 15/01              │
│ 📝 "Aguardando orçamento"        │
│ 🏷️ #construtora #grande          │
├──────────────────────────────────┤
│ [👁️] [📞] [📝] [⭐] [🗑️]          │
└──────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| Automações (regras) | P1 | Lead sem contato há 7 dias → notificação |
| Integração WhatsApp | P0 | Botão para abrir conversa |
| Timeline visual | P1 | Histórico mais visual |
| Métricas de conversão | P1 | Taxa por etapa |
| Previsão de receita | P2 | Soma das probabilidades |

---

## 📌 Notas de Manutenção

- [ ] TODO: Implementar drag-and-drop com @dnd-kit
- [ ] TODO: Adicionar notificações de agendamento
- [ ] DEBT: Otimizar query de indicadores
- ⚠️ CUIDADO: Trigger de log pode impactar performance em bulk updates

---

<sub>Módulo CRM v1.0 | Última atualização: 2026-01-12</sub>
