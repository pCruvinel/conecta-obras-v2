---
description: Cria a estrutura completa de uma nova feature/módulo
---

# Criar Nova Feature

Este workflow cria toda a estrutura de pastas e arquivos para uma nova feature no projeto.

## Passos

1. **Definir o nome da feature** (kebab-case, ex: `gestao-obras`)

2. **Criar estrutura de pastas**:
```
src/features/[nome-feature]/
├── components/
├── hooks/
├── types/
├── utils/
└── index.ts
```

3. **Criar arquivo de tipos** (`types/tipos-[entidade].ts`):
```typescript
export interface [Entidade] {
  id: string;
  // campos
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Criar[Entidade]Input {
  // campos obrigatórios
}

export interface Atualizar[Entidade]Input {
  // campos opcionais
}
```

4. **Criar hook de listagem** (`hooks/use-[entidade]s.ts`):
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function use[Entidade]s() {
  return useQuery({
    queryKey: ['[entidade]s'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('[tabela]')
        .select('*')
        .is('deleted_at', null);
      
      if (error) throw error;
      return data;
    },
  });
}
```

5. **Criar hook de mutação** (`hooks/use-criar-[entidade].ts`):
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useCriar[Entidade]() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dados: Criar[Entidade]Input) => {
      const { data, error } = await supabase
        .from('[tabela]')
        .insert(dados)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[entidade]s'] });
    },
  });
}
```

6. **Criar barrel export** (`index.ts`):
```typescript
// Components
export * from './components/[componente]';

// Hooks
export * from './hooks/use-[entidade]s';
export * from './hooks/use-criar-[entidade]';

// Types
export * from './types/tipos-[entidade]';
```

7. **Documentar o módulo** em `docs/30_MODULES/`:
   - Copiar template de `_TEMPLATE_MODULO.md`
   - Preencher com informações da feature

## Convenções

- **Componentes**: PascalCase (`FormularioObra`)
- **Hooks**: camelCase com `use` (`useCriarObra`)
- **Arquivos**: kebab-case (`formulario-obra.tsx`)
- **Booleanos**: prefixos pt-BR (`estaCarregando`, `temErro`)
