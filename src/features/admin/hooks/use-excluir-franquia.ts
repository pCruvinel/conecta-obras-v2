import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useExcluirFranquia() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            // 1. Buscar todas as lojas desta franquia
            const { data: lojas, error: lojasError } = await supabase
                .from('lojas')
                .select('id')
                .eq('franquia_id', id);

            if (lojasError) {
                throw new Error(`Erro ao buscar lojas: ${lojasError.message}`);
            }

            const lojaIds = lojas?.map(l => l.id) || [];

            // 2. Excluir usuários vinculados às lojas (vendedores)
            if (lojaIds.length > 0) {
                const { error: vendedoresError } = await supabase
                    .from('usuarios')
                    .delete()
                    .in('loja_id', lojaIds);

                if (vendedoresError) {
                    throw new Error(`Erro ao excluir vendedores: ${vendedoresError.message}`);
                }
            }

            // 3. Excluir usuários vinculados diretamente à franquia
            const { error: usuariosFranquiaError } = await supabase
                .from('usuarios')
                .delete()
                .eq('franquia_id', id);

            if (usuariosFranquiaError) {
                throw new Error(`Erro ao excluir usuários da franquia: ${usuariosFranquiaError.message}`);
            }

            // 4. Excluir todas as lojas da franquia
            if (lojaIds.length > 0) {
                const { error: deleteLojasError } = await supabase
                    .from('lojas')
                    .delete()
                    .eq('franquia_id', id);

                if (deleteLojasError) {
                    throw new Error(`Erro ao excluir lojas: ${deleteLojasError.message}`);
                }
            }

            // 5. Finalmente, excluir a franquia
            const { error } = await supabase
                .from('franquias')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(`Erro ao excluir franquia: ${error.message}`);
            }

            return id;
        },
        onSuccess: () => {
            toast.success('Franquia e todos os dados associados foram excluídos com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['franquias'] });
            queryClient.invalidateQueries({ queryKey: ['lojas'] });
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        },
        onError: (error) => {
            console.error('Erro ao excluir franquia:', error);
            toast.error(error.message);
        },
    });

    return {
        excluirFranquia: mutation.mutateAsync,
        estaExcluindo: mutation.isPending,
    };
}
