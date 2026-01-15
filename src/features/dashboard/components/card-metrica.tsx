import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardMetricaProps {
    titulo: string;
    valor: string | number;
    descricao?: string;
    icone: LucideIcon;
    tendencia?: number; // % de variação
    className?: string;
}

export function CardMetrica({
    titulo,
    valor,
    descricao,
    icone: Icone,
    tendencia,
    className,
}: CardMetricaProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {titulo}
                </CardTitle>
                <Icone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{valor}</div>
                {(descricao || tendencia !== undefined) && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {tendencia !== undefined && (
                            <span className={cn(
                                "mr-1 font-medium",
                                tendencia > 0 ? "text-emerald-500" : tendencia < 0 ? "text-red-500" : "text-muted-foreground"
                            )}>
                                {tendencia > 0 ? "+" : ""}{tendencia}%
                            </span>
                        )}
                        {descricao}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
