'use client';

import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { FormularioLoja } from "@/features/admin/components/formulario-loja";

export default function PaginaNovaLoja() {
    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Lojas', href: '/admin/lojas' },
                    { label: 'Nova Loja' }
                ]}
            />

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <div className="max-w-3xl">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium">Cadastro de Loja</h2>
                        <p className="text-sm text-muted-foreground">
                            Cadastre uma nova loja vinculada a uma franquia existente.
                        </p>
                    </div>

                    <FormularioLoja />
                </div>
            </div>
        </div>
    );
}
