"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Obra } from "../types/tipos-obra";
import { DetalhesObraDialog } from "./detalhes-obra-dialog";
import { Calendar, MapPin, Eye } from "lucide-react";

interface CardObraProps {
    obra: Obra;
}

export function CardObra({ obra }: CardObraProps) {



    return (
        <Card className="group rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-card text-card-foreground">
            <CardContent className="p-4 flex flex-col gap-4">

                {/* --- HEADER: Proprietário/Responsável e Ações --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/50 border-dashed">
                    <div className="space-y-1.5 overflow-hidden flex-1 min-w-0">
                        {/* Título: Proprietário e Responsável */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 max-w-full">
                                <span className="text-xs font-bold uppercase text-muted-foreground shrink-0 w-20">Proprietário:</span>
                                <h3 className="font-semibold text-base text-foreground truncate" title={obra.proprietario || ''}>
                                    {obra.proprietario || 'Não informado'}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 max-w-full">
                                <span className="text-xs font-bold uppercase text-muted-foreground shrink-0 w-20">Responsável:</span>
                                <h3 className="font-medium text-sm text-foreground/80 truncate" title={obra.responsavel_nome || ''}>
                                    {obra.responsavel_nome || 'Não informado'}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                        <span className="text-xs font-medium text-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/50">
                            <span className="text-muted-foreground font-normal mr-1.5 hidden sm:inline">Situação:</span>
                            <span className="capitalize">{obra.situacao.replace('_', ' ')}</span>
                        </span>

                        <DetalhesObraDialog obra={obra}>
                            <Button variant="outline" size="sm" className="h-7 text-xs font-medium gap-1.5 shadow-sm border-border hover:bg-muted/50">
                                <Eye className="h-3 w-3" />
                                Detalhes
                            </Button>
                        </DetalhesObraDialog>
                    </div>
                </div>

                {/* --- BODY: Grid de Informações (2 Colunas no Desktop) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Coluna 1: Localização */}
                    <div className="space-y-2 lg:col-span-1">
                        <div className="flex items-start gap-2.5 text-sm text-foreground/80">
                            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                            <div className="flex flex-col">
                                <span className="font-medium text-base">{obra.cidade} / {obra.estado}</span>
                                <span className="text-xs text-muted-foreground">{obra.endereco}</span>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Métricas (Datas, CNO e Valores) */}
                    <div className="space-y-1.5 text-sm lg:col-span-1 lg:border-l lg:border-border/50 lg:pl-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                            {/* CNO agora integrado aqui */}
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">CNO</span>
                                <span className="text-foreground font-mono text-xs font-medium truncate" title={obra.cno || ''}>
                                    {obra.cno || '--'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Início</span>
                                <span className="text-foreground font-mono text-xs font-medium">
                                    {new Date(obra.data_inicio).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Prev. Término</span>
                                <span className="text-foreground font-mono text-xs font-medium">
                                    {obra.previsao_termino ? new Date(obra.previsao_termino).toLocaleDateString() : '--'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Área</span>
                                <span className="text-foreground font-mono text-xs font-medium">
                                    {obra.metragem ? `${obra.metragem} m²` : '--'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Valor</span>
                                <span className="text-green-600 font-mono text-xs font-bold">
                                    {obra.valor_investimento ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(obra.valor_investimento) : '--'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
