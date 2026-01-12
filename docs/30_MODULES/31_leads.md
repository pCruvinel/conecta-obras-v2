<!-- AI_CONTEXT: Este arquivo documenta o módulo de Leads (Obras e Empresas). Consulte-o para entender a funcionalidade principal do sistema. -->

# 📦 Módulo: Leads

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @kassio / @pedro |

---

## 📝 Resumo Executivo

> Este módulo gerencia a pesquisa, filtragem e exibição de leads (Obras, Empresas e Imóveis) para prospecção comercial.

É o **módulo central** do sistema, onde os vendedores passam a maior parte do tempo.

---

## 🗂️ Mapeamento de Arquivos

### Componentes/Views

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/features/leads/components/tabela-leads.tsx` | Listagem de leads em cards |
| `src/features/leads/components/card-lead.tsx` | Card individual com ações |
| `src/features/leads/components/filtros-leads.tsx` | Painel de filtros |
| `src/features/leads/components/icones-acoes.tsx` | Botões de ação do card |
| `src/features/leads/pages/pagina-obras.tsx` | Página de leads Obras |
| `src/features/leads/pages/pagina-empresas.tsx` | Página de leads Empresas |
| `src/features/leads/pages/pagina-imoveis.tsx` | Página de leads Imóveis |

### Lógica/Hooks

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/features/leads/hooks/use-obras.ts` | Fetch de obras com filtros |
| `src/features/leads/hooks/use-empresas.ts` | Fetch de empresas |
| `src/features/leads/hooks/use-consulta-ph3.ts` | Consulta API PH3 |
| `src/features/leads/hooks/use-consulta-azulx.ts` | Consulta API Azulx |

### Types

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/features/leads/types/tipos-obra.ts` | Interface Obra |
| `src/features/leads/types/tipos-empresa.ts` | Interface Empresa |
| `src/features/leads/types/tipos-filtros.ts` | Tipos dos filtros |

### Backend (Supabase)

| Recurso | Localização |
|---------|-------------|
| **Tabelas** | `obras`, `empresas`, `imoveis` |
| **Consultas Salvas** | `consultas_ph3`, `consultas_azulx` |
| **RPC Functions** | `fn_buscar_obras_filtradas` |

---

## 🔄 Fluxo de Dados

### Pesquisa de Leads

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Filtros   │ ──▶ │   Query     │ ──▶ │  Listagem   │
│   (Form)    │     │  Supabase   │     │   Cards     │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Consulta de Contato (PH3/Azulx)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Click no   │ ──▶ │  Verifica   │ ──▶ │  Chama API  │ ──▶ │  Exibe      │
│    Ícone    │     │   Cache     │     │  (se novo)  │     │  Resultado  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                                       │
                           └───────────────────────────────────────┘
                              (salva no cache + cobra crédito)
```

---

## 📊 Estruturas de Dados

### Obra

```typescript
interface Obra {
  id: string;
  numero: string;
  endereco: string;
  cidade: string;
  estado: string;
  categoria: CategoriaObra;
  subcategoria: string;
  tipo_obra: TipoObra;
  situacao: SituacaoObra;
  tipo_area: TipoArea;
  data_inicio: string;
  previsao_termino: string | null;
  metragem: number | null;
  zona: string | null;
  destinacao: string | null;
  responsavel_nome: string | null;
  responsavel_tipo: 'PF' | 'PJ';
  responsavel_cnpj: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}
```

### Filtros de Pesquisa

```typescript
interface FiltrosObra {
  estado: string;
  cidade?: string;
  categoria?: CategoriaObra;
  subcategoria?: string;
  tipo_obra?: TipoObra;
  situacao?: SituacaoObra;
  tipo_area?: TipoArea;
  data_inicio_min?: string;
  data_inicio_max?: string;
  metragem_min?: number;
  metragem_max?: number;
  palavra_chave?: string;
  ordenacao?: 'recente' | 'antiga';
}
```

### Status do Lead no CRM

```typescript
type StatusLead = 
  | 'favorito'
  | 'agendado'
  | 'em_acompanhamento'
  | 'excluido';

interface StatusAcompanhamento {
  etapa: 'selecao' | 'contato' | 'nao_respondeu' | 'negociando' | 'fechado';
  temperatura: 'quente' | 'morno' | 'frio';
  probabilidade: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
}
```

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/lib/supabase` | Lib | Cliente DB |
| `@/features/crm` | Módulo interno | Salvar em favoritos/acompanhamento |
| `API PH3` | API externa | Buscar dados de PF |
| `API Azulx` | API externa | Buscar dados por CNPJ |
| `Google Maps` | API externa | Exibir localização |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `useObras()` | Hook | Páginas de leads |
| `CardLead` | Component | Listagens |
| `FiltrosLeads` | Component | Páginas |

---

## ⚠️ Regras de Ouro

> **NUNCA:**

| ❌ Não Fazer | ✅ Fazer Isto | Motivo |
|-------------|---------------|--------|
| Chamar API sem mostrar créditos | Mostrar modal com saldo antes | Transparência de custos |
| Esconder lead em acompanhamento | Mostrar alerta visual + info do vendedor | Evitar conflito |
| Deletar lead da listagem | Usar soft-delete (marcar excluído) | Auditoria |
| Fazer consulta sem salvar cache | Salvar primeira consulta no banco | Economia |

### Casos de Borda

- **Lead já em acompanhamento:** Mostrar alerta, mas permitir que vendedor adicione também
- **Sem créditos:** Desabilitar botões de consulta + mostrar mensagem
- **Consulta em cache:** Buscar do banco + cobrar crédito normalmente
- **Filtro muda tipo de obra:** Alguns filtros desaparecem (ex: elétrica tem menos opções)

---

## 🧪 Como Testar

```bash
# Testes unitários
npm run test -- --grep="Leads"

# Testar manualmente
1. Acessar /leads/obras
2. Aplicar filtros de estado + cidade
3. Clicar em ícone PH3 de uma obra
4. Verificar se modal de créditos aparece
5. Confirmar e verificar se dados aparecem
6. Adicionar obra aos favoritos
7. Verificar se aparece em /crm/favoritos
```

---

## 📌 Notas de Manutenção

- [ ] TODO: Implementar Deep Search como alternativa ao Google
- [ ] TODO: Salvar contexto da IA por ID da obra
- [ ] DEBT: Card está com muitos ícones, avaliar UX
- ⚠️ CUIDADO: Filtros são condicionais, alterar com cuidado

---

<sub>Última atualização: 2026-01-12</sub>
