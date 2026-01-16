'use client';

import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { FormularioUsuario } from "@/features/admin/components/formulario-usuario";

export default function PaginaNovoUsuario() {
    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Usuários', href: '/admin/usuarios' },
                    { label: 'Novo Usuário' }
                ]}
            />

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <div className="max-w-3xl">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium">Convidar Usuário</h2>
                        <p className="text-sm text-muted-foreground">
                            Envie um convite para um novo usuário acessar o sistema. Eles definirão sua senha ao aceitar.
                        </p>
                    </div>

                    <FormularioUsuario />
                </div>
            </div>
        </div>
    );
}
