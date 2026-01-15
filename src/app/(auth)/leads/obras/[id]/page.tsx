"use client";

import { useObra } from "@/features/leads/hooks/use-obra";
import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Ruler, Building, ArrowRight, Share2, Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PaginaDetalhesObra() {
    const params = useParams();
    const id = params.id as string;
    const { data: obra, isLoading, isError } = useObra(id);

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !obra) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-[50vh] text-destructive">
                <Building className="h-12 w-12 mb-4 opacity-50" />
                <h2 className="text-xl font-semibold">Obra não encontrada</h2>
                <p>Verifique o link ou tente novamente mais tarde.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 pb-20">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Leads', href: '/leads' },
                    { label: 'Obras', href: '/leads/obras' },
                    { label: obra.numero || 'Detalhes', href: `/leads/obras/${id}` }
                ]}
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                    </Button>
                    <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                    </Button>
                    <Button size="sm">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Enviar para CRM
                    </Button>
                </div>
            </CabecalhoPagina>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Section */}
                    <div className="relative h-[300px] rounded-xl overflow-hidden bg-muted group">
                        {/* Placeholder para foto real */}
                        <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                            <Building className="h-16 w-16 text-slate-400 opacity-50" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <div className="flex justify-between items-end">
                                <div>
                                    <Badge variant="secondary" className="mb-2 capitalize">
                                        {obra.situacao.replace('_', ' ')}
                                    </Badge>
                                    <h1 className="text-3xl font-bold">{obra.categoria} - {obra.subcategoria}</h1>
                                    <div className="flex items-center mt-2 text-slate-200">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {obra.endereco}, {obra.cidade} - {obra.estado}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dados Técnicos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ficha Técnica</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Metragem</p>
                                <div className="flex items-center font-medium">
                                    <Ruler className="h-4 w-4 mr-2 text-primary" />
                                    {obra.metragem?.toLocaleString()} m²
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Tipo de Área</p>
                                <p className="capitalize font-medium">{obra.tipo_area}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Zona</p>
                                <p className="font-medium">{obra.zona || 'Não informada'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Data de Início</p>
                                <div className="flex items-center font-medium">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    {format(new Date(obra.data_inicio), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Previsão Término</p>
                                <p className="font-medium">
                                    {obra.previsao_termino
                                        ? format(new Date(obra.previsao_termino), "MM/yyyy")
                                        : 'Não informada'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Tipo de Obra</p>
                                <p className="capitalize font-medium">{obra.tipo_obra}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Card Responsável */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Responsável</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {obra.responsavel_nome?.[0] || 'R'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate" title={obra.responsavel_nome || ''}>
                                        {obra.responsavel_nome}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{obra.responsavel_tipo}</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs text-muted-foreground mb-1">Documento</p>
                                <p className="font-mono text-sm">{obra.responsavel_cnpj || 'Não informado'}</p>
                            </div>

                            <Button className="w-full" variant="secondary">
                                Ver Contatos (PH3)
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Localização Mini-Map */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Localização</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-48 bg-muted relative">
                            {/* Integrar Google Maps aqui */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                                Mapa Indisponível (API Key Pending)
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
