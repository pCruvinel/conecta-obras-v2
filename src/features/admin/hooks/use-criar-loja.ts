import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Endereco, Geofencing } from '../types/tipos-franquia';

interface NovaLojaComSenha {
    nome: string;
    franquia_id: string;
    tipo_documento?: 'cpf' | 'cnpj';
    documento?: string;
    responsavel_nome: string;
    responsavel_email: string;
    responsavel_telefone?: string;
    cidade: string;
    estado: string;
    permissoes?: object;
    creditos_quota_mensal?: number;
    ativa: boolean;
    territorios: string[];
    senha: string;
    endereco: Endereco;
    geofencing?: Geofencing;
}

export function useCriarLoja() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (dados: NovaLojaComSenha) => {
            // Get session for auth header
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Sessão não encontrada');

            // 1. Create user via Edge Function
            const userResponse = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-create-user`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    },
                    body: JSON.stringify({
                        email: dados.responsavel_email,
                        password: dados.senha,
                        nome: dados.responsavel_nome,
                        role: 'loja',
                    }),
                }
            );

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Erro ao criar usuário');
            }

            const { user } = await userResponse.json();

            // 2. Create store via RPC to handle credit deduction
            const { data: loja, error: lojaError } = await supabase.rpc('criar_loja_com_creditos', {
                p_nome: dados.nome,
                p_franquia_id: dados.franquia_id,
                p_tipo_documento: dados.tipo_documento || 'cnpj',
                p_documento: dados.documento || '',
                p_responsavel_nome: dados.responsavel_nome,
                p_responsavel_email: dados.responsavel_email,
                p_responsavel_telefone: dados.responsavel_telefone || '',
                p_cidade: dados.endereco.cidade,
                p_estado: dados.endereco.estado,
                p_endereco: dados.endereco,
                p_permissoes: dados.permissoes || {},
                p_creditos_quota_mensal: dados.creditos_quota_mensal || 0,
                p_geofencing: dados.geofencing || { obras: [], empresas: [] },
                p_territorios: dados.territorios || [],
                p_ativa: dados.ativa
            });

            if (lojaError) throw new Error(lojaError.message);
            if (!loja) throw new Error("Erro ao criar loja: dados não retornados.");

            // 3. Update user with loja_id
            // The RPC returns { id: uuid, nome: string }
            // We need to cast loja to any or specific shape
            const lojaId = (loja as any).id;

            const { error: updateError } = await supabase
                .from('usuarios')
                .update({ loja_id: lojaId, franquia_id: dados.franquia_id })
                .eq('id', user.id);

            if (updateError) {
                console.error('Erro ao vincular usuário à loja:', updateError);
            }

            return loja;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lojas'] });
            queryClient.invalidateQueries({ queryKey: ['franquias'] }); // Invalidate franchises to update credit balance
        },
        onError: (error) => {
            console.error('Erro ao criar loja:', error);
        },
    });

    return {
        criarLoja: mutation.mutateAsync,
        isPending: mutation.isPending,
    };
}
