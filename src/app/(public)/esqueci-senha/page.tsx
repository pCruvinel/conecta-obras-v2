import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Recuperar Senha | Conecta Obras',
    description: 'Recupere o acesso à sua conta.',
};

export default function PaginaEsqueciSenha() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] text-center">
                <h1 className="text-2xl font-bold tracking-tight">Recuperar Senha</h1>
                <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento. Por favor, entre em contato com o suporte para redefinir sua senha.
                </p>
                <Link href="/login" className="text-primary hover:underline">
                    Voltar para Login
                </Link>
            </div>
        </div>
    );
}
