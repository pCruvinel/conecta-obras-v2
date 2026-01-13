import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { EtapaLead } from '../types/tipos-crm';
import { toast } from 'sonner';

export function useAtualizarEtapa() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, etapa }: { id: string; etapa: EtapaLead }) => {
      const { error } = await supabase
        .from('leads_crm')
        .update({ etapa, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalida cache para atualizar lista
      queryClient.invalidateQueries({ queryKey: ['leads-crm'] });
      // Opcional: toast
    },
    onError: (error) => {
      toast.error('Erro ao atualizar etapa: ' + error.message);
    }
  });

  return mutation;
}
