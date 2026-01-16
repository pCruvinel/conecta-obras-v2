"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useObras } from "../hooks/use-obras";
import { useGeofencing } from "@/hooks/use-geofencing";
import { useState, useEffect, useMemo } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ESTADOS_BRASIL = [
    { sigla: "AC", nome: "Acre" },
    { sigla: "AL", nome: "Alagoas" },
    { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" },
    { sigla: "BA", nome: "Bahia" },
    { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" },
    { sigla: "ES", nome: "Espírito Santo" },
    { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" },
    { sigla: "MT", nome: "Mato Grosso" },
    { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" },
    { sigla: "PA", nome: "Pará" },
    { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" },
    { sigla: "PE", nome: "Pernambuco" },
    { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" },
    { sigla: "RN", nome: "Rio Grande do Norte" },
    { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" },
    { sigla: "RR", nome: "Roraima" },
    { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" },
    { sigla: "SE", nome: "Sergipe" },
    { sigla: "TO", nome: "Tocantins" },
];

interface CidadeIBGE {
    id: number;
    nome: string;
}

export function FiltrosObras() {
    const { setFiltros, filtros, triggerSearch } = useObras();
    const { isAdmin, estadosPermitidos, cidadesPermitidas, temRestricao } = useGeofencing();

    // Estado local para evitar fetch automático enquanto digita
    const [localFiltros, setLocalFiltros] = useState(filtros);

    // Se os filtros globais mudarem (ex: paginação no footer), atualizamos o local?
    // Se a paginação muda, 'filtros' muda. Mas se atualizarmos localFiltros aqui, podemos sobrescrever o que o usuário está digitando se ele mudou de página sem querer?
    // Melhor não sincronizar automaticamente inputs de texto, mas sincronizar paginação.
    // Na verdade, o form de filtros não exibe a paginação, então é seguro ignorar a paginação no localFiltros visualmente, mas manter no objeto.

    const [cidades, setCidades] = useState<CidadeIBGE[]>([]);
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [openCidade, setOpenCidade] = useState(false);
    const [mostrarAvancados, setMostrarAvancados] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filtra estados baseado no geofencing (apenas após mount para evitar hydration mismatch)
    const estadosFiltrados = useMemo(() => {
        if (!mounted) return ESTADOS_BRASIL; // SSR: mostra todos
        const permitidos = estadosPermitidos('obras');
        if (permitidos.length === 0) return ESTADOS_BRASIL; // Sem restrição
        return ESTADOS_BRASIL.filter(e => permitidos.includes(e.sigla));
    }, [estadosPermitidos, mounted]);

    // Buscar cidades ao selecionar estado (Baseado no estado LOCAL)
    useEffect(() => {
        if (localFiltros.estado && localFiltros.estado !== 'todos') {
            setLoadingCidades(true);
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${localFiltros.estado}/municipios`)
                .then(res => res.json())
                .then(data => {
                    let cidadesOrdenadas = data.sort((a: CidadeIBGE, b: CidadeIBGE) => a.nome.localeCompare(b.nome));

                    // Filtrar cidades baseado no geofencing
                    const cidadesPermitidas_ = cidadesPermitidas('obras', localFiltros.estado || '');
                    // Se a lista de cidades tiver "TODAS" ou estiver vazia, não filtra
                    const temTodasAsCidades = cidadesPermitidas_.length === 0 ||
                        cidadesPermitidas_.some(c => c.toUpperCase() === 'TODAS');

                    if (!temTodasAsCidades && cidadesPermitidas_.length > 0) {
                        cidadesOrdenadas = cidadesOrdenadas.filter((c: CidadeIBGE) =>
                            cidadesPermitidas_.includes(c.nome)
                        );
                    }

                    setCidades(cidadesOrdenadas);
                    setLoadingCidades(false);
                })
                .catch(err => {
                    console.error("Erro ao buscar cidades:", err);
                    setLoadingCidades(false);
                });
        } else {
            setCidades([]);
        }
    }, [localFiltros.estado, cidadesPermitidas]);

    const handleBuscar = () => {
        // Envia o estado local para o global e dispara a busca
        setFiltros({ ...localFiltros, pagina: 1 }); // Reseta para pág 1 ao buscar
        triggerSearch();
    };

    const updateLocal = (key: string, value: any) => {
        setLocalFiltros(prev => ({ ...prev, [key]: value }));
    };

    const handleEstadoChange = (uf: string) => {
        const novoEstado = uf === 'todos' ? undefined : uf;
        if (localFiltros.estado !== novoEstado) {
            setLocalFiltros(prev => ({ ...prev, estado: novoEstado, cidade: undefined }));
        }
    };

    const handleCidadeSelect = (nomeCidade: string) => {
        updateLocal('cidade', nomeCidade);
        setOpenCidade(false);
    };

    // Helpers para identificar tipo de obra (usando LOCAL)
    const isEletrica = localFiltros.categoria === 'eletrica_infra';
    const isCivil = !isEletrica;

    // Função para normalizar texto (remover acentos e lowercase) para busca
    const filterCidades = (value: string, search: string) => {
        const normalize = (str: string) =>
            str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return normalize(value).includes(normalize(search)) ? 1 : 0;
    };

    return (
        <div className="space-y-4 bg-background p-4 rounded-md border shadow-sm">

            {/* 1. Filtros Obrigatórios: Estado e Cidade (Layout Flexível) */}
            <div className="flex flex-wrap gap-4 items-end">

                {/* Estado */}
                <div className="min-w-[140px] flex-grow md:flex-grow-0 space-y-1">
                    <Label className="text-xs font-semibold text-primary">Estado *</Label>
                    <Select
                        value={localFiltros.estado || (mounted && temRestricao('obras') ? "" : "todos")}
                        onValueChange={handleEstadoChange}
                    >
                        <SelectTrigger className="h-9 text-sm border-primary/20 bg-primary/5 w-full">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            {(!mounted || !temRestricao('obras')) && <SelectItem value="todos">Todos</SelectItem>}
                            {estadosFiltrados.map((estado) => (
                                <SelectItem key={estado.sigla} value={estado.sigla}>
                                    {estado.sigla} - {estado.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Cidade (Combobox com Search) */}
                <div className="flex-grow min-w-[200px] space-y-1">
                    <Label className="text-xs font-semibold text-primary">Cidade *</Label>
                    <Popover open={openCidade} onOpenChange={setOpenCidade}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCidade}
                                disabled={!localFiltros.estado || localFiltros.estado === 'todos'}
                                className="h-9 text-sm border-primary/20 bg-primary/5 w-full justify-between font-normal"
                            >
                                {localFiltros.cidade
                                    ? localFiltros.cidade
                                    : (!localFiltros.estado || localFiltros.estado === 'todos') ? "Selecione um estado..." : "Selecione a cidade..."}
                                {loadingCidades ? (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
                                ) : (
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command filter={filterCidades}>
                                <CommandInput placeholder="Buscar cidade..." />
                                <CommandList>
                                    <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                                    <CommandGroup>
                                        {cidades.map((cidade) => (
                                            <CommandItem
                                                key={cidade.id}
                                                value={cidade.nome}
                                                onSelect={() => handleCidadeSelect(cidade.nome)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        localFiltros.cidade === cidade.nome ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {cidade.nome}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Busca Rápida - Agora por último e maior */}
                <div className="flex-grow min-w-[250px] space-y-1">
                    <Label className="text-xs font-semibold">Busca Rápida</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="CNO, Proprietário ou Endereço..."
                            className="pl-9 h-9 text-sm w-full"
                            value={localFiltros.termo_busca || ""}
                            onChange={(e) => updateLocal('termo_busca', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                        />
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 min-w-[200px] flex-grow md:flex-grow-0 pb-[1px]">
                    <Button onClick={handleBuscar} size="sm" className="w-[120px] h-9">
                        Buscar
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMostrarAvancados(!mostrarAvancados)}
                        className="h-9 px-3 text-xs w-[140px]"
                    >
                        {mostrarAvancados ? 'Menos Filtros' : 'Filtros Avançados'}
                    </Button>
                </div>
            </div>

            {/* 2. Filtros Avançados (Condicionais) */}
            {mostrarAvancados && (
                <div className="pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Seletor de Categoria (Define os campos abaixo) */}
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold">Categoria da Obra</Label>
                            <Select
                                value={localFiltros.categoria || "construcao_civil"}
                                onValueChange={(val) => updateLocal('categoria', val)}
                            >
                                <SelectTrigger className="h-8 text-xs bg-muted/50 w-full">
                                    <SelectValue placeholder="Selecione a categoria..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="construcao_civil">Construção Civil</SelectItem>
                                    <SelectItem value="eletrica_infra">Elétrica de Infra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Campos Comuns (Agora flexíveis) */}
                        <div className="space-y-1 min-w-[130px] flex-grow md:flex-grow-0">
                            <Label className="text-xs">Data Início (Registro)</Label>
                            <Input
                                type="date"
                                className="h-8 text-xs w-full"
                                value={localFiltros.data_inicio || ''}
                                onChange={(e) => updateLocal('data_inicio', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1 min-w-[130px] flex-grow md:flex-grow-0">
                            <Label className="text-xs">Previsão Término</Label>
                            <Input
                                type="date"
                                className="h-8 text-xs w-full"
                                value={localFiltros.previsao_termino || ''}
                                onChange={(e) => updateLocal('previsao_termino', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1 min-w-[130px] flex-grow md:flex-grow-0">
                            <Label className="text-xs">Zona</Label>
                            <Select onValueChange={(val) => updateLocal('zona', val)}>
                                <SelectTrigger className="h-8 text-xs w-full">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urbana">Urbana</SelectItem>
                                    <SelectItem value="rural">Rural</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Campos Específicos: Construção Civil */}
                    {isCivil && (
                        <div className="rounded-md bg-slate-50 p-3 border border-dashed border-slate-200">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Filtros de Construção Civil</h4>
                            <div className="flex flex-wrap gap-3">
                                <div className="min-w-[140px] flex-grow">
                                    <Input placeholder="Subcategoria" className="h-8 text-xs w-full" />
                                </div>
                                <div className="min-w-[140px] flex-grow">
                                    <Select onValueChange={(v) => updateLocal('tipo_obra', v)}>
                                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder="Tipo de Obra" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nova">Nova</SelectItem>
                                            <SelectItem value="reforma">Reforma</SelectItem>
                                            <SelectItem value="ampliacao">Ampliação</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="min-w-[140px] flex-grow">
                                    <Select>
                                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder="Situação" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                            <SelectItem value="projeto">Projeto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="min-w-[120px] flex-grow">
                                    <Input placeholder="Metragem Mín (m²)" type="number" className="h-8 text-xs w-full" />
                                </div>
                                <div className="min-w-[140px] flex-grow">
                                    <Select>
                                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder="Destinação" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="venda">Venda</SelectItem>
                                            <SelectItem value="locacao">Locação</SelectItem>
                                            <SelectItem value="uso_proprio">Uso Próprio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Campos Específicos: Infraestrutura Elétrica */}
                    {isEletrica && (
                        <div className="rounded-md bg-yellow-50/50 p-3 border border-dashed border-yellow-200">
                            <h4 className="text-[10px] font-bold text-yellow-600/70 uppercase tracking-wider mb-2">Filtros de Infraestrutura Elétrica</h4>
                            <div className="flex flex-wrap gap-3">
                                <div className="space-y-1 min-w-[120px] flex-grow">
                                    <Label className="text-xs">Potência (KW)</Label>
                                    <Input placeholder="Ex: 500" type="number" className="h-8 text-xs w-full" />
                                </div>
                                <div className="space-y-1 min-w-[140px] flex-grow">
                                    <Label className="text-xs">Situação</Label>
                                    <Select>
                                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="em_licitacao">Em Licitação</SelectItem>
                                            <SelectItem value="contratada">Contratada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1 min-w-[140px] flex-grow">
                                    <Label className="text-xs">Responsável</Label>
                                    <Select>
                                        <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder="Tipo..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PF">Pessoa Física</SelectItem>
                                            <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
