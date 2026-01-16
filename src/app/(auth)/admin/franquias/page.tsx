'use client';

import { useState, useMemo } from 'react';
import { Building2, CheckCircle2, XCircle, Search, ArrowUpDown } from "lucide-react";
import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { TabelaFranquias } from "@/features/admin/components/tabela-franquias";
import { useFranquias } from "@/features/admin/hooks/use-franquias";
import { useExcluirFranquia } from "@/features/admin/hooks/use-excluir-franquia";
import { CardMetrica } from "@/features/dashboard/components/card-metrica";
import { FormularioFranquiaDialog } from "@/features/admin/components/formulario-franquia-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StatusFiltro = 'todos' | 'ativas' | 'inativas';
type OrdenacaoCampo = 'nome' | 'creditos_quota_mensal' | 'creditos_consumidos' | 'created_at';
type OrdenacaoDirecao = 'asc' | 'desc';

export default function PaginaFranquias() {
    const { franquias, isLoading } = useFranquias();
    const { excluirFranquia } = useExcluirFranquia();

    // Estados de filtro
    const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>('todos');
    const [filtroBusca, setFiltroBusca] = useState('');
    const [ordenacaoCampo, setOrdenacaoCampo] = useState<OrdenacaoCampo>('nome');
    const [ordenacaoDirecao, setOrdenacaoDirecao] = useState<OrdenacaoDirecao>('asc');

    // Derived metrics
    const total = franquias?.length || 0;
    const ativas = franquias?.filter(f => f.ativa).length || 0;
    const inativas = total - ativas;

    // Filtrar e ordenar
    const franquiasFiltradas = useMemo(() => {
        if (!franquias) return [];

        let resultado = [...franquias];

        // Filtro de status
        if (filtroStatus === 'ativas') {
            resultado = resultado.filter(f => f.ativa);
        } else if (filtroStatus === 'inativas') {
            resultado = resultado.filter(f => !f.ativa);
        }

        // Filtro de busca
        if (filtroBusca) {
            const busca = filtroBusca.toLowerCase();
            resultado = resultado.filter(f =>
                f.nome.toLowerCase().includes(busca) ||
                f.responsavel_nome.toLowerCase().includes(busca) ||
                f.responsavel_email.toLowerCase().includes(busca) ||
                f.cnpj?.toLowerCase().includes(busca)
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
    }, [franquias, filtroStatus, filtroBusca, ordenacaoCampo, ordenacaoDirecao]);

    const handleDelete = async (id: string) => {
        try {
            await excluirFranquia(id);
        } catch (error) {
            // Error already handled in hook
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Franquias', href: '/admin/franquias' }
                ]}
            >
                <FormularioFranquiaDialog />
            </CabecalhoPagina>

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <div className="grid gap-4 md:grid-cols-3">
                    <CardMetrica
                        titulo="Total de Franquias"
                        valor={total}
                        icone={Building2}
                        iconClassName="text-blue-500"
                    />
                    <CardMetrica
                        titulo="Franquias Ativas"
                        valor={ativas}
                        icone={CheckCircle2}
                        iconClassName="text-emerald-500"
                    />
                    <CardMetrica
                        titulo="Franquias Inativas"
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
                                        placeholder="Nome, responsável, CNPJ..."
                                        className="pl-9 h-9"
                                        value={filtroBusca}
                                        onChange={(e) => setFiltroBusca(e.target.value)}
                                    />
                                </div>
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

                <TabelaFranquias
                    franquias={franquiasFiltradas}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
