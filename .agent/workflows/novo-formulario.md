---
description: Cria um formulário completo com validação Zod e React Hook Form
---

# Criar Novo Formulário

Este workflow cria um formulário completo com validação usando Zod e React Hook Form.

## Passos

1. **Definir o schema de validação** (`types/tipos-[entidade].ts`):

```typescript
import { z } from 'zod';

export const schemaCliente = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z.string()
    .email('E-mail inválido'),
  
  telefone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido')
    .optional(),
  
  cpf: z.string()
    .length(14, 'CPF deve ter 14 caracteres')
    .optional(),
  
  ativo: z.boolean().default(true),
});

export type DadosCliente = z.infer<typeof schemaCliente>;
```

2. **Criar o componente de formulário**:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { schemaCliente, type DadosCliente } from '../types/tipos-cliente';
import { useCriarCliente } from '../hooks/use-criar-cliente';

interface FormularioClienteProps {
  dadosIniciais?: Partial<DadosCliente>;
  aoSalvar?: (dados: DadosCliente) => void;
  aoFechar?: () => void;
}

export function FormularioCliente({ 
  dadosIniciais, 
  aoSalvar, 
  aoFechar 
}: FormularioClienteProps) {
  const { mutate: criarCliente, isPending } = useCriarCliente();
  
  const form = useForm<DadosCliente>({
    resolver: zodResolver(schemaCliente),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      ativo: true,
      ...dadosIniciais,
    },
  });
  
  const aoSubmeter = (dados: DadosCliente) => {
    criarCliente(dados, {
      onSuccess: (resultado) => {
        form.reset();
        aoSalvar?.(resultado);
      },
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(aoSubmeter)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 justify-end">
          {aoFechar && (
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

3. **Máscaras de Input** (opcional):

```typescript
// utils/mascaras.ts
export function mascaraTelefone(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}

export function mascaraCPF(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function mascaraCNPJ(valor: string): string {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}
```

## Convenções

- **Schema**: `schema[Entidade]`
- **Type**: `Dados[Entidade]`
- **Componente**: `Formulario[Entidade]`
- **Props de callback**: `aoSalvar`, `aoFechar`, `aoExcluir`
