import { z } from 'zod';

export const novoLeadSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  tipo: z.enum(['obra', 'empresa']),
  temperatura: z.enum(['quente', 'morno', 'frio']),
  valor_estimado: z.coerce.number().min(0, 'O valor não pode ser negativo').default(0),
  
  // Campos de Contato
  contato_nome: z.string().optional(),
  contato_telefone: z.string().optional(),
  contato_email: z.string().optional().or(z.literal('')),
});

export type NovoLeadFormValues = z.infer<typeof novoLeadSchema>;
