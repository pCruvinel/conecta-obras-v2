import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { AtualizarLoja } from '../types/tipos-loja';

interface AtualizarLojaParams {
    id: string;
    dados: AtualizarLoja;
    senha?: string;
}

export function useAtualizarLoja() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ id, dados, senha }: AtualizarLojaParams) => {
            // Update store
            const { data: loja, error } = await supabase
                .from('lojas')
                .update({
                    nome: dados.nome,
                    franquia_id: dados.franquia_id,
                    tipo_documento: dados.tipo_documento,
                    documento: dados.documento,
                    responsavel_nome: dados.responsavel_nome,
                    responsavel_email: dados.responsavel_email,
                    responsavel_telefone: dados.responsavel_telefone,
                    cidade: dados.endereco?.cidade,
                    estado: dados.endereco?.estado,
                    endereco: dados.endereco,
                    permissoes: dados.permissoes,
                    creditos_quota_mensal: dados.creditos_quota_mensal,
                    ativa: dados.ativa,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);

            // Update password if provided
            if (senha && dados.responsavel_email) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    // Find user by email
                    const { data: usuarios } = await supabase
                        .from('usuarios')
                        .select('id')
                        .eq('loja_id', id)
                        .limit(1);

                    if (usuarios && usuarios.length > 0) {
                        await fetch(
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-update-user`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${session.access_token}`,
                                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                                },
                                body: JSON.stringify({
                                    userId: usuarios[0].id,
                                    password: senha,
                                }),
                            }
                        );
                    }
                }
            }

            return loja;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lojas'] });
        },
        onError: (error) => {
            console.error('Erro ao atualizar loja:', error);
        },
    });

    return {
        atualizarLoja: mutation.mutateAsync,
        isPending: mutation.isPending,
    };
}
