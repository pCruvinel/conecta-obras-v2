import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Usuario } from '../types/tipos-usuario';

export interface UsuarioCompleto extends Usuario {
    franquias?: { nome: string };
    lojas?: { nome: string };
}

export function useUsuarios() {
    const supabase = createClient();

    const query = useQuery({
        queryKey: ['usuarios'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('usuarios')
                .select(`
          *,
          franquias(nome),
          lojas(nome)
        `)
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as UsuarioCompleto[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        usuarios: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
