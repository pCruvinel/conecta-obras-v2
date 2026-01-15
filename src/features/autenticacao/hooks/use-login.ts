import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type DadosLogin } from '../types/tipos-auth';
import { toast } from 'sonner';

export function useLogin() {
    const [estaCarregando, setEstaCarregando] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const login = async (dados: DadosLogin) => {
        setEstaCarregando(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: dados.email,
                password: dados.senha,
            });

            if (error) {
                throw error;
            }

            toast.success('Login realizado com sucesso!');
            router.push('/dashboard');
            router.refresh(); // Atualiza server components
        } catch (error: any) {
            console.error('Erro no login:', error);
            toast.error(error.message || 'Erro ao realizar login. Verifique suas credenciais.');
        } finally {
            setEstaCarregando(false);
        }
    };

    return {
        login,
        estaCarregando,
    };
}
