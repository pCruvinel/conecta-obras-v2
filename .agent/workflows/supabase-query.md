---
description: Ajuda a construir queries complexas do Supabase
---

# Queries Supabase

Este workflow ajuda a construir queries complexas no Supabase.

## Queries Básicas

### Select com Filtros

```typescript
const { data, error } = await supabase
  .from('obras')
  .select('*')
  .eq('estado', 'SP')
  .eq('cidade', 'São Paulo')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })
  .limit(20);
```

### Select com Joins

```typescript
// Join implícito (foreign key)
const { data } = await supabase
  .from('obras')
  .select(`
    *,
    cliente:clientes (id, nome, email),
    responsavel:usuarios (id, nome)
  `);

// Múltiplos níveis
const { data } = await supabase
  .from('obras')
  .select(`
    *,
    cliente:clientes (
      id,
      nome,
      loja:lojas (id, nome)
    )
  `);
```

### Filtros Avançados

```typescript
// OR
const { data } = await supabase
  .from('obras')
  .select('*')
  .or('status.eq.ativo,status.eq.pendente');

// IN
const { data } = await supabase
  .from('obras')
  .select('*')
  .in('status', ['ativo', 'pendente', 'analise']);

// BETWEEN (datas)
const { data } = await supabase
  .from('obras')
  .select('*')
  .gte('data_inicio', '2026-01-01')
  .lte('data_inicio', '2026-12-31');

// LIKE (busca parcial)
const { data } = await supabase
  .from('obras')
  .select('*')
  .ilike('nome', '%construtora%');

// NOT NULL
const { data } = await supabase
  .from('obras')
  .select('*')
  .not('telefone', 'is', null);
```

### Paginação

```typescript
const ITENS_POR_PAGINA = 20;
const pagina = 1;

const { data, count } = await supabase
  .from('obras')
  .select('*', { count: 'exact' })
  .range(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA - 1
  );

const totalPaginas = Math.ceil((count ?? 0) / ITENS_POR_PAGINA);
```

## Mutations

### Insert

```typescript
const { data, error } = await supabase
  .from('obras')
  .insert({
    nome: 'Nova Obra',
    status: 'rascunho',
  })
  .select()
  .single();
```

### Update

```typescript
const { data, error } = await supabase
  .from('obras')
  .update({
    status: 'ativo',
    updated_at: new Date().toISOString(),
  })
  .eq('id', id)
  .select()
  .single();
```

### Soft Delete (OBRIGATÓRIO!)

```typescript
// NUNCA usar .delete()!
const { error } = await supabase
  .from('obras')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', id);
```

### Upsert

```typescript
const { data, error } = await supabase
  .from('configuracoes')
  .upsert({
    usuario_id: userId,
    chave: 'tema',
    valor: 'dark',
  })
  .select()
  .single();
```

## RPC Functions

```typescript
// Chamar função do banco
const { data, error } = await supabase
  .rpc('fn_buscar_obras_proximas', {
    lat: -23.5505,
    lng: -46.6333,
    raio_km: 10,
  });
```

## Real-time

```typescript
// Subscribe a mudanças
const subscription = supabase
  .channel('obras-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'obras',
      filter: `loja_id=eq.${lojaId}`,
    },
    (payload) => {
      console.log('Mudança:', payload);
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(subscription);
};
```

## Regras Importantes

> [!CAUTION]
> Sempre incluir `.is('deleted_at', null)` em queries de listagem!

> [!WARNING]
> Nunca usar `.delete()` - sempre soft delete!

> [!TIP]
> Use `.select()` após insert/update para retornar o registro atualizado.
