import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Usuario } from '../types/tipos-usuario';

export function useUsuarioAtual() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['usuario-atual'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return null;

            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Erro ao buscar usuário atual:', error);
                throw error;
            }

            return data as Usuario;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
