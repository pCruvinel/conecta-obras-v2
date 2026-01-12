---
description: Cria um hook de data fetching com React Query
---

# Criar Novo Hook

Este workflow cria um hook de data fetching usando TanStack Query e Supabase.

## Tipos de Hook

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Listagem | `use[Entidade]s` | `useObras`, `useClientes` |
| Fetch único | `use[Entidade]PorId` | `useObraPorId` |
| Com filtros | `use[Entidade]Filtrados` | `useObrasFiltradas` |
| Criar | `useCriar[Entidade]` | `useCriarObra` |
| Atualizar | `useAtualizar[Entidade]` | `useAtualizarObra` |
| Excluir | `useExcluir[Entidade]` | `useExcluirObra` |

## Passos

1. **Definir tipo e nome do hook**

2. **Criar arquivo** em `src/features/[feature]/hooks/`:
```
use-[nome].ts
# Exemplo: use-obras.ts
```

3. **Template: Hook de Listagem**
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Obra } from '../types/tipos-obra';

export function useObras() {
  return useQuery({
    queryKey: ['obras'],
    queryFn: async (): Promise<Obra[]> => {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data ?? [];
    },
  });
}
```

4. **Template: Hook de Fetch por ID**
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Obra } from '../types/tipos-obra';

export function useObraPorId(id: string | undefined) {
  return useQuery({
    queryKey: ['obra', id],
    queryFn: async (): Promise<Obra | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
```

5. **Template: Hook de Mutação (Criar)**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { CriarObraInput, Obra } from '../types/tipos-obra';

export function useCriarObra() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dados: CriarObraInput): Promise<Obra> => {
      const { data, error } = await supabase
        .from('obras')
        .insert(dados)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
    },
  });
}
```

6. **Template: Hook de Mutação (Soft Delete)**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useExcluirObra() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Soft delete - nunca deletar dados!
      const { error } = await supabase
        .from('obras')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
    },
  });
}
```

7. **Exportar no barrel** (`index.ts`)

## Regras Importantes

> [!CAUTION]
> **Nunca deletar dados!** Sempre usar soft-delete com `deleted_at`.

> [!TIP]
> Sempre incluir `.is('deleted_at', null)` nas queries de listagem.
