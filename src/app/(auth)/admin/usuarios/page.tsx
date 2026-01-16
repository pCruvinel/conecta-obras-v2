'use client';

import Link from "next/link";
import { Plus } from "lucide-react";
import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { Button } from "@/components/ui/button";
import { TabelaUsuarios } from "@/features/admin/components/tabela-usuarios";
import { useUsuarios } from "@/features/admin/hooks/use-usuarios";

export default function PaginaUsuarios() {
    const { usuarios, isLoading } = useUsuarios();

    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Usuários', href: '/admin/usuarios' }
                ]}
            >
                <Button asChild>
                    <Link href="/admin/usuarios/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Convidar Usuário
                    </Link>
                </Button>
            </CabecalhoPagina>

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <TabelaUsuarios usuarios={usuarios} isLoading={isLoading} />
            </div>
        </div>
    );
}
