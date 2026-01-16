'use client';

import { useState, useMemo } from 'react';
import { Store, CheckCircle2, XCircle, Search, ArrowUpDown, Building2 } from "lucide-react";
import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { TabelaLojas } from "@/features/admin/components/tabela-lojas";
import { useLojas } from "@/features/admin/hooks/use-lojas";
import { useFranquias } from "@/features/admin/hooks/use-franquias";
import { CardMetrica } from "@/features/dashboard/components/card-metrica";
import { FormularioLojaDialog } from "@/features/admin/components/formulario-loja-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StatusFiltro = 'todos' | 'ativas' | 'inativas';
type OrdenacaoCampo = 'nome' | 'creditos_quota_mensal' | 'creditos_consumidos' | 'created_at';
type OrdenacaoDirecao = 'asc' | 'desc';

export default function PaginaLojas() {
    const { lojas, isLoading } = useLojas();
    const { franquias } = useFranquias();

    // Estados de filtro
    const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>('todos');
    const [filtroBusca, setFiltroBusca] = useState('');
    const [filtroFranquia, setFiltroFranquia] = useState<string>('todas');
    const [ordenacaoCampo, setOrdenacaoCampo] = useState<OrdenacaoCampo>('nome');
    const [ordenacaoDirecao, setOrdenacaoDirecao] = useState<OrdenacaoDirecao>('asc');

    // Derived metrics
    const total = lojas?.length || 0;
    const ativas = lojas?.filter(l => l.ativa).length || 0;
    const inativas = total - ativas;

    // Filtrar e ordenar
    const lojasFiltradas = useMemo(() => {
        if (!lojas) return [];

        let resultado = [...lojas];

        // Filtro de status
        if (filtroStatus === 'ativas') {
            resultado = resultado.filter(l => l.ativa);
        } else if (filtroStatus === 'inativas') {
            resultado = resultado.filter(l => !l.ativa);
        }

        // Filtro de franquia
        if (filtroFranquia !== 'todas') {
            resultado = resultado.filter(l => l.franquia_id === filtroFranquia);
        }

        // Filtro de busca
        if (filtroBusca) {
            const busca = filtroBusca.toLowerCase();
            resultado = resultado.filter(l =>
                l.nome.toLowerCase().includes(busca) ||
                l.responsavel_nome?.toLowerCase().includes(busca) ||
                l.responsavel_email?.toLowerCase().includes(busca) ||
                l.documento?.toLowerCase().includes(busca) ||
                l.cidade?.toLowerCase().includes(busca)
            );
        }

        // Ordenação
        resultado.sort((a, b) => {
            let valorA: string | number | Date;
            let valorB: string | number | Date;

            switch (ordenacaoCampo) {
                case 'nome':
                    valorA = a.nome.toLowerCase();
                    valorB = b.nome.toLowerCase();
                    break;
                case 'creditos_quota_mensal':
                    valorA = a.creditos_quota_mensal || 0;
                    valorB = b.creditos_quota_mensal || 0;
                    break;
                case 'creditos_consumidos':
                    valorA = a.creditos_consumidos || 0;
                    valorB = b.creditos_consumidos || 0;
                    break;
                case 'created_at':
                    valorA = new Date(a.created_at);
                    valorB = new Date(b.created_at);
                    break;
                default:
                    return 0;
            }

            if (valorA < valorB) return ordenacaoDirecao === 'asc' ? -1 : 1;
            if (valorA > valorB) return ordenacaoDirecao === 'asc' ? 1 : -1;
            return 0;
        });

        return resultado;
    }, [lojas, filtroStatus, filtroFranquia, filtroBusca, ordenacaoCampo, ordenacaoDirecao]);

    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Lojas', href: '/admin/lojas' }
                ]}
            >
                <FormularioLojaDialog />
            </CabecalhoPagina>

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <div className="grid gap-4 md:grid-cols-3">
                    <CardMetrica
                        titulo="Total de Lojas"
                        valor={total}
                        icone={Store}
                        iconClassName="text-blue-500"
                    />
                    <CardMetrica
                        titulo="Lojas Ativas"
                        valor={ativas}
                        icone={CheckCircle2}
                        iconClassName="text-emerald-500"
                    />
                    <CardMetrica
                        titulo="Lojas Inativas"
                        valor={inativas}
                        icone={XCircle}
                        iconClassName="text-red-500"
                    />
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Busca */}
                            <div className="space-y-1 flex-1 min-w-[200px]">
                                <Label htmlFor="busca" className="text-xs">Buscar</Label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="busca"
                                        placeholder="Nome, responsável, cidade..."
                                        className="pl-9 h-9"
                                        value={filtroBusca}
                                        onChange={(e) => setFiltroBusca(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Franquia */}
                            <div className="space-y-1 w-[180px]">
                                <Label className="text-xs">Franquia</Label>
                                <Select value={filtroFranquia} onValueChange={setFiltroFranquia}>
                                    <SelectTrigger className="h-9">
                                        <Building2 className="h-3 w-3 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas</SelectItem>
                                        {franquias?.map((f) => (
                                            <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-1 w-[140px]">
                                <Label className="text-xs">Status</Label>
                                <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as StatusFiltro)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos</SelectItem>
                                        <SelectItem value="ativas">Ativas</SelectItem>
                                        <SelectItem value="inativas">Inativas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ordenar por */}
                            <div className="space-y-1 w-[180px]">
                                <Label className="text-xs">Ordenar por</Label>
                                <Select value={ordenacaoCampo} onValueChange={(v) => setOrdenacaoCampo(v as OrdenacaoCampo)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nome">Nome</SelectItem>
                                        <SelectItem value="creditos_quota_mensal">Crédito de Consulta</SelectItem>
                                        <SelectItem value="creditos_consumidos">Créditos Consumidos</SelectItem>
                                        <SelectItem value="created_at">Data de Criação</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Direção */}
                            <div className="space-y-1 w-[140px]">
                                <Label className="text-xs">Direção</Label>
                                <Select value={ordenacaoDirecao} onValueChange={(v) => setOrdenacaoDirecao(v as OrdenacaoDirecao)}>
                                    <SelectTrigger className="h-9">
                                        <ArrowUpDown className="h-3 w-3 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Crescente</SelectItem>
                                        <SelectItem value="desc">Decrescente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <TabelaLojas lojas={lojasFiltradas} isLoading={isLoading} />
            </div>
        </div>
    );
}
