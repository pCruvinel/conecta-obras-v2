'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface Permissoes {
    dashboard: boolean;
    leads_obras: boolean;
    leads_empresas: boolean;
    crm: boolean;
    consulta_plus: boolean;
    chat_ia: boolean;
}

interface UsuarioComPermissoes {
    id: string;
    email: string;
    nome: string;
    role: string;
    franquia_id: string | null;
    permissoes: Permissoes | null;
}

export function usePermissoes() {
    const supabase = createClient();

    const query = useQuery({
        queryKey: ['permissoes-usuario'],
        queryFn: async (): Promise<UsuarioComPermissoes | null> => {
            // 1. Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                return null;
            }

            // 2. Get user data with franquia_id
            const { data: usuario, error: usuarioError } = await supabase
                .from('usuarios')
                .select('id, email, nome, role, franquia_id')
                .eq('id', user.id)
                .single();

            if (usuarioError || !usuario) {
                return null;
            }

            // 3. Admin has all permissions
            if (usuario.role === 'admin') {
                return {
                    ...usuario,
                    permissoes: {
                        dashboard: true,
                        leads_obras: true,
                        leads_empresas: true,
                        crm: true,
                        consulta_plus: true,
                        chat_ia: true,
                    }
                };
            }

            // 4. Get franchise permissions if user has franquia_id
            if (usuario.franquia_id) {
                const { data: franquia, error: franquiaError } = await supabase
                    .from('franquias')
                    .select('permissoes')
                    .eq('id', usuario.franquia_id)
                    .single();

                if (!franquiaError && franquia) {
                    return {
                        ...usuario,
                        permissoes: franquia.permissoes as Permissoes,
                    };
                }
            }

            // 5. Default: no permissions
            return {
                ...usuario,
                permissoes: {
                    dashboard: false,
                    leads_obras: false,
                    leads_empresas: false,
                    crm: false,
                    consulta_plus: false,
                    chat_ia: false,
                }
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const permissoes = query.data?.permissoes;
    const isAdmin = query.data?.role === 'admin';

    return {
        usuario: query.data,
        permissoes,
        isAdmin,
        isLoading: query.isLoading,
        temPermissao: (modulo: keyof Permissoes) => permissoes?.[modulo] ?? false,
    };
}
