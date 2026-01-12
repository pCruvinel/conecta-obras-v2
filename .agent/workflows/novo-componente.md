---
description: Cria um componente seguindo os padrões do projeto
---

# Criar Novo Componente

Este workflow cria um componente React seguindo as convenções do projeto.

## Passos

1. **Definir tipo e nome do componente**:

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Página | `Pagina[Nome]` | `PaginaListaObras` |
| Formulário | `Formulario[Nome]` | `FormularioCadastroCliente` |
| Modal | `Modal[Nome]` | `ModalConfirmacaoExclusao` |
| Tabela | `Tabela[Nome]` | `TabelaOrdensServico` |
| Card | `Card[Nome]` | `CardResumoObra` |
| Lista | `Lista[Nome]` | `ListaClientes` |
| Seletor | `Seletor[Nome]` | `SeletorCliente` |

2. **Definir localização**:
   - Componente específico de feature → `src/features/[feature]/components/`
   - Componente reutilizável → `src/components/compartilhados/`
   - Componente UI base → `src/components/ui/`

3. **Criar arquivo** (kebab-case):
```
[tipo]-[nome].tsx
# Exemplo: formulario-cadastro-cliente.tsx
```

4. **Estrutura do componente**:
```tsx
'use client'; // Se usar hooks

import { useState } from 'react';
// imports organizados: react, next, libs externas, internos

interface [NomeComponente]Props {
  // props com JSDoc quando necessário
}

export function [NomeComponente]({ prop1, prop2 }: [NomeComponente]Props) {
  // Estados com prefixos pt-BR
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [temErro, setTemErro] = useState(false);
  
  // Handlers
  const aoClicar = () => {
    // lógica
  };
  
  // Early returns
  if (estaCarregando) return <div>Carregando...</div>;
  if (temErro) return <div>Erro ao carregar</div>;
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

5. **Exportar no barrel** (`index.ts` da feature)

## Convenções de Nomenclatura

### Variáveis Booleanas
```tsx
const estaCarregando = true;  // estado atual
const temErro = false;        // existência
const podeEditar = true;      // permissão
const deveMostrar = true;     // obrigação
const foiSalvo = false;       // ação passada
```

### Handlers
```tsx
const aoClicar = () => {};
const aoSubmeter = () => {};
const aoSelecionar = () => {};
const aoFechar = () => {};
```

### Props de Callback
```tsx
interface Props {
  aoSalvar?: (dados: Dados) => void;
  aoExcluir?: (id: string) => void;
  aoFechar?: () => void;
}
```
