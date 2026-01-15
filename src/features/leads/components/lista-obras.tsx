"use client";

import { useObras } from "../hooks/use-obras";
import { FiltrosObra } from "../types/tipos-filtros";
import { CardObra } from "./card-obra";
import { Loader2, FolderSearch } from "lucide-react";

// interface ListaObrasProps {
//     filtros: FiltrosObra;
// }

export function ListaObras() {
    const { obras, total, isLoading, isError } = useObras();

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Buscando obras...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-destructive">
                <p>Erro ao carregar obras.</p>
                <p className="text-sm">Tente novamente mais tarde.</p>
            </div>
        );
    }

    if (!obras || obras.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                <FolderSearch className="h-10 w-10 mb-2 opacity-50" />
                <p className="font-medium">Nenhuma obra encontrada</p>
                <p className="text-sm">Tente ajustar seus filtros de pesquisa.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Encontrados: <strong className="text-foreground">{total}</strong> resultados
                </p>
            </div>

            <div className="flex flex-col space-y-4">
                {obras.map((obra) => (
                    <div key={obra.id} data-slot="card">
                        <CardObra obra={obra} />
                    </div>
                ))}
            </div>
        </div>
    );
}
