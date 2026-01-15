import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Registro | Conecta Obras',
    description: 'Crie sua conta no Conecta Obras.',
};

export default function PaginaRegistro() {
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
                            &ldquo;Comece hoje mesmo a encontrar as melhores obras para o seu negócio.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Criar Conta</h1>
                    <p className="text-muted-foreground">
                        O registro público está temporariamente desabilitado. Entre em contato com o administrador para solicitar acesso.
                    </p>
                    <Link href="/login" className="text-primary hover:underline">
                        Voltar para Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
