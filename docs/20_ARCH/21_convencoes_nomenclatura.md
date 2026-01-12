<!-- AI_CONTEXT: Este arquivo define as convenções de nomenclatura Clean Code em pt-BR. Consulte-o para entender COMO nomear componentes, funções, variáveis e arquivos. -->

# 📝 Convenções de Nomenclatura

> Guia de Clean Code em pt-BR para padronização do código-fonte.

---

## 🎯 Filosofia Clean Code

> "O único comentário verdadeiramente bom é aquele que você encontrou uma forma de não escrever." — Uncle Bob

### Princípios Base

| Princípio | Descrição |
|-----------|-----------|
| **Nomes expressivos** | O nome deve revelar a intenção |
| **Evitar abreviações** | `cliente` ao invés de `cli` |
| **Contexto claro** | `enderecoEntrega` ao invés de `endereco2` |
| **Consistência** | Mesma convenção em todo o projeto |

---

## 🧩 Componentes React

### Nomenclatura de Componentes

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Páginas** | `PaginaNome` | `PaginaListaObras`, `PaginaDetalhesCliente` |
| **Layouts** | `LayoutNome` | `LayoutPrincipal`, `LayoutAutenticacao` |
| **Formulários** | `FormularioNome` | `FormularioCadastroCliente`, `FormularioNovaOS` |
| **Modais** | `ModalNome` | `ModalConfirmacaoExclusao`, `ModalNovoContato` |
| **Tabelas** | `TabelaNome` | `TabelaOrdensServico`, `TabelaColaboradores` |
| **Cards** | `CardNome` | `CardResumoObra`, `CardKPI` |
| **Listas** | `ListaNome` | `ListaClientes`, `ListaNotificacoes` |
| **Botões específicos** | `BotaoNome` | `BotaoSalvar`, `BotaoExcluir`, `BotaoVoltar` |
| **Ícones wrapper** | `IconeNome` | `IconeStatus`, `IconeUsuario` |
| **Seletores** | `SeletorNome` | `SeletorCliente`, `SeletorCentroCusto` |
| **Campos** | `CampoNome` | `CampoData`, `CampoBusca` |

### Arquivos de Componentes

```
# Padrão: kebab-case
formulario-cadastro-cliente.tsx
modal-confirmacao-exclusao.tsx
tabela-ordens-servico.tsx
card-resumo-obra.tsx
```

---

## 🪝 Hooks

### Padrões de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| **Data fetching** | `use[Entidade]` | `useObras`, `useClientes`, `useUsuario` |
| **Fetch único** | `use[Entidade]PorId` | `useObraPorId`, `useClientePorId` |
| **Fetch com filtros** | `use[Entidade]Filtrados` | `useObrasFiltradas` |
| **Mutations criar** | `useCriar[Entidade]` | `useCriarObra`, `useCriarCliente` |
| **Mutations atualizar** | `useAtualizar[Entidade]` | `useAtualizarObra` |
| **Mutations excluir** | `useExcluir[Entidade]` | `useExcluirCliente` |
| **Estado local** | `use[Contexto]Estado` | `useFiltrosEstado`, `useModalEstado` |
| **Contexto** | `use[Contexto]` | `useAutenticacao`, `useOrganizacao` |
| **Funcionalidade** | `use[Acao]` | `useDebounce`, `useClipboard` |

### Arquivos de Hooks

```
# Padrão: kebab-case com prefixo use-
use-obras.ts
use-criar-obra.ts
use-autenticacao.ts
use-debounce.ts
```

---

## ⚡ Funções Utilitárias

### Padrões por Categoria

| Categoria | Padrão | Exemplos |
|-----------|--------|----------|
| **Formatação** | `formatar[Tipo]` | `formatarData`, `formatarMoeda`, `formatarCPF` |
| **Validação** | `validar[Campo]` | `validarCPF`, `validarEmail`, `validarCNPJ` |
| **Verificação** | `verificar[Condicao]` | `verificarPermissao`, `verificarSessao` |
| **Cálculos** | `calcular[Resultado]` | `calcularTotal`, `calcularDesconto` |
| **Transformação** | `transformar[Para]` | `transformarParaFormulario`, `transformarParaApi` |
| **Obter** | `obter[Dado]` | `obterUsuarioAtual`, `obterDataAtual` |
| **Gerar** | `gerar[Resultado]` | `gerarRelatorio`, `gerarCodigo` |
| **Filtrar** | `filtrar[Entidade]` | `filtrarAtivos`, `filtrarPorStatus` |
| **Ordenar** | `ordenar[Entidade]` | `ordenarPorData`, `ordenarPorNome` |

### Arquivos de Utilitários

```
# Padrão: kebab-case descritivo
formatadores.ts       # Agrupa formatações relacionadas
validadores.ts        # Agrupa validações
calculadora-valores.ts
transformadores-api.ts
```

---

## 📊 Variáveis

### Variáveis Booleanas

| Prefixo | Uso | Exemplos |
|---------|-----|----------|
| `esta` | Estado atual | `estaCarregando`, `estaAberto`, `estaSelecionado` |
| `tem` | Existência | `temErro`, `temDados`, `temPermissao` |
| `pode` | Permissão/Capacidade | `podeEditar`, `podeExcluir`, `podeAprovar` |
| `deve` | Obrigação | `deveMostrarModal`, `deveRecarregar` |
| `foi` | Ação passada | `foiSalvo`, `foiEnviado`, `foiValidado` |

### Variáveis de Estado

```typescript
// ✅ Correto
const [estaCarregando, setEstaCarregando] = useState(false);
const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
const [listaObras, setListaObras] = useState<Obra[]>([]);

// ❌ Evitar
const [loading, setLoading] = useState(false);
const [selected, setSelected] = useState(null);
const [data, setData] = useState([]);
```

### Variáveis de Dados

| Tipo | Padrão | Exemplos |
|------|--------|----------|
| **Objeto único** | `[entidade]` | `cliente`, `obra`, `usuario` |
| **Lista/Array** | `lista[Entidade]` | `listaClientes`, `listaObras` |
| **Selecionado** | `[entidade]Selecionado` | `clienteSelecionado` |
| **Atual** | `[entidade]Atual` | `usuarioAtual`, `paginaAtual` |
| **Novo** | `novo[Entidade]` | `novoCliente`, `novaObra` |
| **Filtrado** | `[entidade]Filtrados` | `clientesFiltrados` |

---

## 🗃️ Banco de Dados (PostgreSQL/Supabase)

### Tabelas

| Convenção | Padrão | Exemplo |
|-----------|--------|---------|
| **Nome** | snake_case, plural | `clientes`, `ordens_servico` |
| **Colunas** | snake_case | `nome_completo`, `data_criacao` |
| **Foreign Keys** | `[tabela_singular]_id` | `cliente_id`, `obra_id` |
| **Timestamps** | Padrão fixo | `created_at`, `updated_at`, `deleted_at` |

### Exemplo de Tabela

```sql
CREATE TABLE ordens_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(20) NOT NULL,
  cliente_id UUID REFERENCES clientes(id),
  status VARCHAR(50) NOT NULL DEFAULT 'rascunho',
  valor_total DECIMAL(10,2),
  data_inicio DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ -- soft-delete
);
```

---

## 📁 Estrutura de Arquivos

### Padrões Gerais

| Tipo | Formato | Exemplo |
|------|---------|---------|
| **Componentes** | kebab-case | `formulario-cliente.tsx` |
| **Hooks** | kebab-case + use- | `use-clientes.ts` |
| **Utilitários** | kebab-case | `formatadores.ts` |
| **Types** | kebab-case | `tipos-cliente.ts` |
| **Constantes** | kebab-case | `constantes-status.ts` |
| **Páginas (Next.js)** | kebab-case | `clientes/page.tsx` |

### Estrutura de Feature

```
src/features/obras/
├── components/
│   ├── formulario-obra.tsx
│   ├── tabela-obras.tsx
│   └── card-obra.tsx
├── hooks/
│   ├── use-obras.ts
│   ├── use-criar-obra.ts
│   └── use-atualizar-obra.ts
├── types/
│   └── tipos-obra.ts
├── utils/
│   └── validadores-obra.ts
└── index.ts          # barrel export
```

---

## 🔤 Constantes e Enums

### Constantes

```typescript
// UPPER_SNAKE_CASE para constantes globais
export const LIMITE_ITENS_POR_PAGINA = 20;
export const TEMPO_DEBOUNCE_MS = 300;
export const URL_API_BASE = process.env.NEXT_PUBLIC_API_URL;
```

### Enums/Objetos de Status

```typescript
// PascalCase para o tipo, valores descritivos
export const StatusOS = {
  RASCUNHO: 'rascunho',
  EM_ANDAMENTO: 'em_andamento',
  AGUARDANDO_APROVACAO: 'aguardando_aprovacao',
  APROVADO: 'aprovado',
  RECUSADO: 'recusado',
  CONCLUIDO: 'concluido',
} as const;

export type StatusOS = (typeof StatusOS)[keyof typeof StatusOS];
```

---

## ✅ Checklist de Revisão

Antes de submeter código, verifique:

- [ ] Nomes revelam intenção sem necessidade de comentários
- [ ] Componentes seguem padrão `[Tipo][Nome]`
- [ ] Hooks seguem padrão `use[Acao][Entidade]`
- [ ] Booleanos usam prefixos `esta`, `tem`, `pode`, `deve`, `foi`
- [ ] Arquivos usam kebab-case
- [ ] Tabelas do banco usam snake_case
- [ ] Constantes usam UPPER_SNAKE_CASE
- [ ] Nenhuma abreviação obscura

---

<sub>Última atualização: 2026-01-12</sub>
