import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface DadosCriarFranquia {
    nome: string;
    cnpj?: string;
    responsavel_nome: string;
    responsavel_email: string;
    responsavel_telefone?: string;
    senha?: string;
    endereco: {
        cep: string;
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
    };
    permissoes: {
        dashboard: boolean;
        leads_obras: boolean;
        leads_empresas: boolean;
        crm: boolean;
        consulta_plus: boolean;
        chat_ia: boolean;
    };
    geofencing: {
        obras: { estado: string; cidades: string[] }[];
        empresas: { estado: string; cidades: string[] }[];
    };
    creditos_disponiveis?: number;
    ativa: boolean;
}

export function useCriarFranquia() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (dados: DadosCriarFranquia) => {
            // Excluir campos que não existem no banco (senha e confirmar_senha são para auth apenas)
            const { senha, confirmar_senha, ...dadosFranquia } = dados as DadosCriarFranquia & { confirmar_senha?: string };

            // 1. Criar a franquia primeiro
            const { data: franquia, error: franquiaError } = await supabase
                .from('franquias')
                .insert([{
                    ...dadosFranquia,
                    creditos_disponiveis: dadosFranquia.creditos_disponiveis || 0,
                }])
                .select()
                .single();

            if (franquiaError) {
                throw new Error(`Erro ao criar franquia: ${franquiaError.message}`);
            }

            // 2. Criar usuário via Edge Function (com email auto-confirmado)
            if (senha && senha.length >= 6) {
                // Get current session token
                const { data: { session } } = await supabase.auth.getSession();

                if (!session?.access_token) {
                    // Rollback: deletar franquia criada
                    await supabase.from('franquias').delete().eq('id', franquia.id);
                    throw new Error('Sessão não encontrada. Faça login novamente.');
                }

                // Chamar Edge Function para criar usuário
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-create-user`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.access_token}`,
                            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                        },
                        body: JSON.stringify({
                            email: dados.responsavel_email,
                            password: senha,
                            nome: dados.responsavel_nome,
                            role: 'franquia',
                            franquiaId: franquia.id,
                            telefone: dados.responsavel_telefone || null,
                        }),
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    // Rollback: deletar franquia criada
                    await supabase.from('franquias').delete().eq('id', franquia.id);
                    throw new Error(`Erro ao criar usuário: ${result.error}`);
                }
            }

            return franquia;
        },
        onSuccess: () => {
            toast.success('Franquia criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['franquias'] });
        },
        onError: (error) => {
            console.error('Erro ao criar franquia:', error);
            toast.error(error.message);
        },
    });

    return {
        criarFranquia: mutation.mutateAsync,
        estaCriando: mutation.isPending,
    };
}
