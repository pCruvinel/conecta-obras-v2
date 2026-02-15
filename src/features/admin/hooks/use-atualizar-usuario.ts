import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { AtualizarUsuario } from '../types/tipos-usuario';

export function useAtualizarUsuario() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ id, dados }: { id: string; dados: AtualizarUsuario }) => {
            const { data, error } = await supabase
                .from('usuarios')
                .update(dados)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: () => {
            toast.success('Usuário atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        },
        onError: (error) => {
            console.error('Erro ao atualizar usuário:', error);
            toast.error(`Erro ao atualizar usuário: ${error.message}`);
        },
    });

    return {
        atualizarUsuario: mutation.mutateAsync,
        estaAtualizando: mutation.isPending,
    };
}
