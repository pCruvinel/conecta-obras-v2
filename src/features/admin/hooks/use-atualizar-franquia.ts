import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface DadosAtualizarFranquia {
    nome?: string;
    cnpj?: string;
    responsavel_nome?: string;
    responsavel_email?: string;
    responsavel_telefone?: string;
    senha?: string;
    endereco?: {
        cep: string;
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
    };
    permissoes?: {
        dashboard: boolean;
        leads_obras: boolean;
        leads_empresas: boolean;
        crm: boolean;
        consulta_plus: boolean;
        chat_ia: boolean;
    };
    geofencing?: {
        obras: { estado: string; cidades: string[] }[];
        empresas: { estado: string; cidades: string[] }[];
    };
    creditos_disponiveis?: number;
    ativa?: boolean;
}

export function useAtualizarFranquia() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ id, dados }: { id: string; dados: DadosAtualizarFranquia & { confirmar_senha?: string } }) => {
            // Excluir campos que não existem no banco
            const { senha, confirmar_senha, ...dadosFranquia } = dados;

            // 1. Atualizar franquia
            const { data, error } = await supabase
                .from('franquias')
                .update(dadosFranquia)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            // 2. Se senha foi fornecida, atualizar no auth via Edge Function
            if (senha && senha.length >= 6) {
                // Buscar o usuário vinculado a esta franquia
                const { data: usuarios, error: usuarioError } = await supabase
                    .from('usuarios')
                    .select('id')
                    .eq('franquia_id', id)
                    .eq('role', 'franquia')
                    .limit(1);

                if (usuarioError) {
                    console.error('Erro ao buscar usuário da franquia:', usuarioError);
                    toast.warning('Franquia atualizada, mas não foi possível alterar a senha.');
                    return data;
                }

                if (usuarios && usuarios.length > 0) {
                    const userId = usuarios[0].id;

                    // Get current session token
                    const { data: { session } } = await supabase.auth.getSession();

                    if (!session?.access_token) {
                        toast.warning('Franquia atualizada, mas não foi possível alterar a senha (sessão não encontrada).');
                        return data;
                    }

                    // Chamar Edge Function para alterar senha
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-update-user`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.access_token}`,
                                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                            },
                            body: JSON.stringify({
                                userId,
                                password: senha,
                            }),
                        }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        console.error('Erro ao alterar senha:', result.error);
                        toast.warning(`Franquia atualizada, mas erro ao alterar senha: ${result.error}`);
                    }
                    // Senha alterada com sucesso - toast será mostrado no onSuccess
                } else {
                    toast.warning('Franquia atualizada, mas nenhum usuário vinculado encontrado para alterar senha.');
                }
            }

            return data;
        },
        onSuccess: () => {
            toast.success('Franquia atualizada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['franquias'] });
        },
        onError: (error) => {
            console.error('Erro ao atualizar franquia:', error);
            toast.error(`Erro ao atualizar franquia: ${error.message}`);
        },
    });

    return {
        atualizarFranquia: mutation.mutateAsync,
        estaAtualizando: mutation.isPending,
    };
}
