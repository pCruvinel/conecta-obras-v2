import { Metadata } from 'next';
import Image from 'next/image';
import { FormularioLogin } from '@/features/autenticacao/components/formulario-login';

export const metadata: Metadata = {
    title: 'Login | Conecta Obras',
    description: 'Acesse sua conta para gerenciar obras e leads.',
};

export default function PaginaLogin() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-primary" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <span className="mr-2">🏗️</span> Conecta Obras
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;A plataforma transformou a maneira como identificamos oportunidades na construção civil. Simplificou nosso processo de vendas.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Andrade</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <FormularioLogin />
                </div>
            </div>
        </div>
    );
}
