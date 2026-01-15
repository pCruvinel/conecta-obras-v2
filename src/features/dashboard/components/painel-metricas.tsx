"use client";

import { Building2, Activity, CheckCircle2, Ban, PlusCircle } from "lucide-react";
import { CardMetrica } from "./card-metrica";
import { useMetricasObras } from "../hooks/use-metricas-obras";

export function PainelMetricas() {
    const { data: metricas, isLoading } = useMetricasObras();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <CardMetrica
                titulo="Total de Obras"
                valor={metricas?.total || 0}
                descricao="No banco de dados"
                icone={Building2}
            />
            <CardMetrica
                titulo="Obras Ativas"
                valor={metricas?.ativas || 0}
                descricao="Em andamento"
                icone={Activity}
                className="border-l-4 border-l-blue-500"
            />
            <CardMetrica
                titulo="Novas na Semana"
                valor={metricas?.semanal.quantidade || 0}
                tendencia={metricas?.semanal.variacao}
                descricao="desde a última semana"
                icone={PlusCircle}
            />
            <CardMetrica
                titulo="Obras Encerradas"
                valor={metricas?.encerradas || 0}
                descricao="Concluídas"
                icone={CheckCircle2}
            />
        </div>
    );
}
