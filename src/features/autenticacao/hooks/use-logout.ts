import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useLogout() {
    const [estaDeslogando, setEstaDeslogando] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const logout = async () => {
        setEstaDeslogando(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            router.push('/login');
            router.refresh();
            toast.success('Logout realizado com sucesso.');
        } catch (error: any) {
            console.error('Erro ao fazer logout:', error);
            toast.error('Erro ao sair do sistema.');
        } finally {
            setEstaDeslogando(false);
        }
    };

    return {
        logout,
        estaDeslogando,
    };
}
