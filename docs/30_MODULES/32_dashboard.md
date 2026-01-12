<!-- AI_CONTEXT: Este arquivo documenta o módulo Dashboard. Consulte-o para entender a visão panorâmica do sistema. -->

# 📦 Módulo: Dashboard

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P1 |

---

## 📝 Resumo Executivo

> Este módulo **exibe métricas e indicadores** do banco de dados de obras para **dar uma visão panorâmica de oportunidades** aos usuários.

É a **primeira página** que o usuário vê após login, servindo como "termômetro" do mercado.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | Total de obras | ⏳ | Contador geral de obras no sistema |
| F02 | Filtro por estado | ⏳ | Seleção de UF |
| F03 | Filtro por cidade | ⏳ | Seleção de município |
| F04 | Obras por categoria | ⏳ | Ativas, encerradas, nulas |
| F05 | Obras por tipo | ⏳ | Alvenaria, elétrica, etc. |
| F06 | Gráficos dinâmicos | ⏳ | Visualização de distribuição |
| F07 | Contador semanal | ⏳ | "Novas obras esta semana" |
| F08 | Cards clicáveis | ⏳ | Redireciona para Leads filtrado |

### Requisitos Relacionados

> Referência: [11_requisitos_funcionais.md](../10_PRODUCT/11_requisitos_funcionais.md)

| ID | Requisito |
|----|-----------|
| DASH-01 | Exibir total de obras no sistema |
| DASH-02 | Filtrar obras por estado |
| DASH-03 | Filtrar obras por cidade |
| DASH-04 | Exibir obras por categoria |
| DASH-08 | Contador de novas obras na semana |

---

## 🗂️ Mapeamento de Arquivos

### Rotas (App Router)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/dashboard` | `src/app/(auth)/dashboard/page.tsx` | Página principal |

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/dashboard/components/painel-metricas.tsx` | Container | Layout dos cards |
| `src/features/dashboard/components/card-metrica.tsx` | Card | Exibe um indicador |
| `src/features/dashboard/components/grafico-distribuicao.tsx` | Gráfico | Chart de barras/pizza |
| `src/features/dashboard/components/filtros-dashboard.tsx` | Filtros | Estado/cidade |
| `src/features/dashboard/components/contador-semanal.tsx` | Badge | Novas obras |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/dashboard/hooks/use-metricas-obras.ts` | Query | Busca totais agregados |
| `src/features/dashboard/hooks/use-obras-por-categoria.ts` | Query | Obras por categoria |
| `src/features/dashboard/hooks/use-obras-por-tipo.ts` | Query | Obras por tipo |
| `src/features/dashboard/hooks/use-novas-obras-semana.ts` | Query | Contador semanal |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/dashboard/types/tipos-metricas.ts` | Interfaces de métricas |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `obras` | Fonte principal |
| **Views** | `vw_metricas_obras` | Agregações por estado/cidade |
| **RPC Functions** | `fn_contar_obras_semana()` | Contador semanal |

---

## 📊 Estruturas de Dados

### Métricas

```typescript
// tipos-metricas.ts
export interface MetricasObras {
  total: number;
  ativas: number;
  encerradas: number;
  nulas: number;
  porTipo: Record<string, number>;
  porCategoria: Record<string, number>;
}

export interface FiltrosDashboard {
  estado?: string;
  cidade?: string;
}

export interface ContagemSemanal {
  quantidade: number;
  variacao: number; // % vs semana anterior
}
```

### Schema do Banco (View)

```sql
CREATE VIEW vw_metricas_obras AS
SELECT 
  estado,
  cidade,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE situacao = 'ativa') as ativas,
  COUNT(*) FILTER (WHERE situacao = 'encerrada') as encerradas,
  tipo_obra,
  categoria
FROM obras
WHERE deleted_at IS NULL
GROUP BY estado, cidade, tipo_obra, categoria;

-- Função: contar obras da semana
CREATE OR REPLACE FUNCTION fn_contar_obras_semana()
RETURNS TABLE(quantidade BIGINT, variacao NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    ROUND(
      (COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::NUMERIC /
       NULLIF(COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '14 days' 
         AND created_at < CURRENT_DATE - INTERVAL '7 days'), 0) - 1) * 100
    , 1)
  FROM obras
  WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔄 Fluxos de Dados

### Fluxo: Carregar Dashboard

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │  Seleciona  │ ──▶ │   Queries   │
│   Acessa    │     │   Filtros   │     │  Paralelas  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
      ┌────────────────────────────────────────┼────────────────┐
      ▼                    ▼                   ▼                ▼
┌──────────┐      ┌──────────────┐    ┌──────────────┐   ┌──────────┐
│ Métricas │      │ Por Categoria│    │   Por Tipo   │   │ Semanal  │
└──────────┘      └──────────────┘    └──────────────┘   └──────────┘
      │                    │                   │                │
      └────────────────────┴───────────────────┴────────────────┘
                                   │
                                   ▼
                          ┌───────────────┐
                          │  Renderiza    │
                          │  Dashboard    │
                          └───────────────┘
```

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/lib/supabase` | Lib | Cliente do banco |
| `@/features/autenticacao` | Módulo | Usuário atual, território |
| `recharts` ou `chart.js` | Lib | Gráficos |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `useMetricasObras()` | Hook | Página dashboard |
| `CardMetrica` | Componente | Página dashboard |

---

## ⚠️ Regras de Negócio

### Permissões por Role

| Role | Visualização |
|------|--------------|
| ADM | Todas as obras do sistema |
| Franquia | Obras dos territórios da franquia |
| Lojista | Obras do território da loja |
| Vendedor | Obras do seu território |
| Convidado | Nenhum acesso |

### Casos de Borda

- **Sem território:** Usuário sem território definido vê "Configure seu território"
- **Sem dados:** Exibir estado vazio com call-to-action

---

## 🎨 UI/UX

### Layout da Página

```
┌────────────────────────────────────────────────────────────┐
│ Dashboard                          [📊 Período: Semana ▼] │
├────────────────────────────────────────────────────────────┤
│ Filtros: [Estado ▼] [Cidade ▼]      🔄 Nova semana: +5.234 │
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │  TOTAL   │ │  ATIVAS  │ │ENCERRADAS│ │  NULAS   │       │
│ │ 252.431  │ │ 198.234  │ │  45.123  │ │  9.074   │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌─────────────────────────┐  │
│  │   Por Categoria         │ │      Por Tipo           │  │
│  │   [Gráfico Pizza]       │ │   [Gráfico Barras]      │  │
│  └─────────────────────────┘ └─────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| Cards clicáveis → Leads filtrado | P1 | Navegação rápida |
| Mapa de calor geográfico | P2 | Visualização espacial |
| Comparativo temporal (vs mês anterior) | P2 | Tendências |
| Export PDF do dashboard | P2 | Relatórios offline |

---

## 📌 Notas de Manutenção

- [ ] TODO: Implementar cache de métricas (atualização a cada 5min)
- [ ] TODO: Adicionar skeleton loading
- ⚠️ CUIDADO: Queries podem ser pesadas - usar views materializadas

---

<sub>Módulo Dashboard v1.0 | Última atualização: 2026-01-12</sub>
