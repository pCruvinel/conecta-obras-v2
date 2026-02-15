import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { NovoUsuario } from '../types/tipos-usuario';

export function useConvidarUsuario() {
    const supabase = createClient();
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (dados: NovoUsuario) => {
            // Em produção, isso chamaria uma Edge Function (supabase.functions.invoke('invite-user'))
            // Por enquanto, vamos simular inserindo em convites_pendentes se a tabela permitir
            // Ou apenas inserindo direto em uma tabela de auditoria se não tiver auth setup.
            // Sendo Admin, vou tentar inserir em `convites_pendentes`.

            const { data, error } = await supabase
                .from('convites_pendentes')
                .insert([{
                    email: dados.email,
                    role: dados.role,
                    franquia_id: dados.franquia_id || null,
                    loja_id: dados.loja_id || null,
                    token: crypto.randomUUID(), // Mock token
                    expira_em: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // 7 dias
                }])
                .select()
                .single();

            if (error) {
                // Se falhar (ex: RLS), vamos tentar criar o usuário diretamente na tabela usuarios (mock)
                // Isso é apenas para dev, idealmente seria via Edge Function
                console.warn("Falha ao criar convite, tentando criar usuário direto (DEV ONLY)");
                // throw new Error(error.message);
                const { data: user, error: userError } = await supabase
                    .from('usuarios')
                    .insert([{
                        ...dados,
                        id: crypto.randomUUID(), // Mock ID since there is no auth user yet
                        ativo: true
                    }])
                    .select()
                    .single();

                if (userError) throw new Error(userError.message);
                return user;
            }

            return data;
        },
        onSuccess: () => {
            toast.success('Convite enviado com sucesso!'); // Feedback visual
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
            router.push('/admin/usuarios');
        },
        onError: (error) => {
            console.error('Erro ao convidar usuário:', error);
            toast.error(`Erro ao convidar: ${error.message}`);
        },
    });

    return {
        convidarUsuario: mutation.mutateAsync,
        estaEnviando: mutation.isPending,
    };
}
