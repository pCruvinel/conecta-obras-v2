"use client";

import { Suspense } from "react";
import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { ListaObras } from "@/features/leads/components/lista-obras";
import { FiltrosObras } from "@/features/leads/components/filtros-obras";

export default function PaginaLeadsObras() {
    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Leads' },
                    { label: 'Obras' }
                ]}
            />

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads de Obras</h1>
                    <p className="text-muted-foreground">
                        Gerencie e acompanhe as obras disponíveis para prospecção.
                    </p>
                </div>

                {/* Área de Filtros no Topo */}
                <div className="bg-muted/10 p-4 rounded-lg border">
                    <Suspense fallback={<div>Carregando filtros...</div>}>
                        <FiltrosObras />
                    </Suspense>
                </div>

                {/* Lista de Leads */}
                <Suspense fallback={<div>Carregando obras...</div>}>
                    <ListaObras />
                </Suspense>
            </div>
        </div>
    );
}
