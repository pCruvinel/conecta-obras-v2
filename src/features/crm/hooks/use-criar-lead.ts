import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { NovoLeadFormValues } from '../schemas/schema-novo-lead';
import { toast } from 'sonner';

export function useCriarLead() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: NovoLeadFormValues) => {
      // Obter sessão atual para user_id (poderia vir de um hook de auth context também)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('leads_crm')
        .insert({
          titulo: dados.titulo, // Nota: Schema precisa suportar título se não for link com obra
          tipo: dados.tipo,
          temperatura: dados.temperatura,
          valor_estimado: dados.valor_estimado,
          contato_nome: dados.contato_nome,
          contato_telefone: dados.contato_telefone,
          contato_email: dados.contato_email,
          etapa: 'selecao', // Default stage
          usuario_id: user.id,
          // loja_id seria necessário se houver multitenancy de loja, assumindo null ou tratado via RLS/Trigger por enquanto ou pegando do metadata
          // Para MVP, vamos deixar o banco tratar ou inserir se tivermos o contexto da loja
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads-crm'] });
      toast.success('Negócio criado com sucesso!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erro ao criar negócio: ' + error.message);
    }
  });
}
