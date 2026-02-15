"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin, Plus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { RegraGeofencing } from "../types/tipos-franquia"
import { useCidades, useEstados } from "../hooks/use-ibge"
import { Label } from "@/components/ui/label"

interface GeofencingSelectorProps {
    value: RegraGeofencing[];
    onChange: (value: RegraGeofencing[]) => void;
}

export function GeofencingSelector({ value = [], onChange }: GeofencingSelectorProps) {
    const { data: estados } = useEstados();
    const [openCombobox, setOpenCombobox] = React.useState(false);

    const handleAddEstado = (sigla: string) => {
        if (!value.find(r => r.estado === sigla)) {
            onChange([...value, { estado: sigla, cidades: ['TODAS'] }]);
        }
        setOpenCombobox(false);
    };

    const handleRemoveEstado = (sigla: string) => {
        onChange(value.filter(r => r.estado !== sigla));
    };

    const handleUpdateCidades = (sigla: string, cidades: string[]) => {
        onChange(value.map(r => r.estado === sigla ? { ...r, cidades } : r));
    };

    return (
        <div className="space-y-4">
            <Popover open={openCombobox} onOpenChange={setOpenCombobox} modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-[200px] justify-between"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Adicionar Estado
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 pointer-events-auto">
                    <Command>
                        <CommandInput placeholder="Buscar estado..." />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                            <CommandEmpty>Estado não encontrado.</CommandEmpty>
                            <CommandGroup heading="Estados">
                                {estados?.map((estado) => {
                                    const isSelected = value.some(r => r.estado === estado.sigla);
                                    if (isSelected) return null;

                                    return (
                                        <CommandItem
                                            key={estado.id}
                                            value={estado.nome} // Search by name
                                            onSelect={() => handleAddEstado(estado.sigla)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {estado.nome} ({estado.sigla})
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="space-y-4">
                {value.length === 0 && (
                    <div className="text-sm text-muted-foreground italic p-4 border rounded-md bg-muted/20 text-center">
                        Nenhum estado selecionado.
                    </div>
                )}
                {value.map((regra) => (
                    <EstadoConfig
                        key={regra.estado}
                        regra={regra}
                        nomeEstado={estados?.find(e => e.sigla === regra.estado)?.nome || regra.estado}
                        onRemove={() => handleRemoveEstado(regra.estado)}
                        onUpdateCidades={(cidades) => handleUpdateCidades(regra.estado, cidades)}
                    />
                ))}
            </div>
        </div>
    );
}

interface EstadoConfigProps {
    regra: RegraGeofencing;
    nomeEstado: string;
    onRemove: () => void;
    onUpdateCidades: (cidades: string[]) => void;
}

function EstadoConfig({ regra, nomeEstado, onRemove, onUpdateCidades }: EstadoConfigProps) {
    const { data: cidades } = useCidades(regra.estado);
    const todasCidades = regra.cidades.includes('TODAS');
    const [openCitySelect, setOpenCitySelect] = React.useState(false);

    const handleToggleTodas = (checked: boolean) => {
        if (checked) {
            onUpdateCidades(['TODAS']);
        } else {
            onUpdateCidades([]);
        }
    };

    const toggleCidade = (nomeCidade: string) => {
        let novasCidades = [...regra.cidades];
        if (todasCidades) {
            // Se estava em TODAS e clicou numa, remove TODAS e seleciona apenas essa? Não.
            // Se estava em TODAS, desmarca TODAS e inicia lista vazia + a clicada? 
            // UX: Se desmarcar TODAS via switch, limpa. 
            // Se selecionar via combobox enquanto TODAS ta ativo, remove TODAS e mantem a lista?
            // Vamos assumir: Switch controla 'TODAS'. Combox box controla lista especifica.
            // Se selecionar algo no combobox, TODAS deve ser false.
            novasCidades = [nomeCidade];
        } else {
            if (novasCidades.includes(nomeCidade)) {
                novasCidades = novasCidades.filter(c => c !== nomeCidade);
            } else {
                novasCidades.push(nomeCidade);
            }
        }
        onUpdateCidades(novasCidades);
    };

    return (
        <div className="border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-base px-3 py-1 bg-muted">
                        {regra.estado}
                    </Badge>
                    <span className="font-medium text-sm text-muted-foreground">{nomeEstado}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive hover:text-destructive/90">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor={`todas-${regra.estado}`} className="text-sm font-normal">
                            Cobrir todo o estado
                        </Label>
                        <Switch
                            id={`todas-${regra.estado}`}
                            checked={todasCidades}
                            onCheckedChange={handleToggleTodas}
                        />
                    </div>
                </div>

                {!todasCidades && (
                    <div className="space-y-2">
                        <Popover open={openCitySelect} onOpenChange={setOpenCitySelect} modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCitySelect}
                                    className="w-full justify-between"
                                >
                                    {regra.cidades.length > 0
                                        ? `${regra.cidades.length} cidade(s) selecionada(s)`
                                        : "Selecionar cidades..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0 pointer-events-auto" align="start">
                                <Command
                                    filter={(value, search) => {
                                        if (value.includes('###')) return 1; // Hack para garantir que itens selecionados/complexos passem se necessário, mas aqui usaremos normalização

                                        // Normaliza valor e busca removendo acentos e caixa alta
                                        const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                                        const normalizedValue = normalize(value);
                                        const normalizedSearch = normalize(search);

                                        return normalizedValue.includes(normalizedSearch) ? 1 : 0;
                                    }}
                                >
                                    <CommandInput placeholder="Buscar cidade (ex: Sao Luis)..." />
                                    <CommandList className="max-h-[300px] overflow-y-auto">
                                        <CommandEmpty>Cidade não encontrada.</CommandEmpty>
                                        <CommandGroup heading="Cidades Disponíveis">
                                            {cidades?.map((cidade) => {
                                                const isSelected = regra.cidades.includes(cidade.nome);
                                                return (
                                                    <CommandItem
                                                        key={cidade.id}
                                                        value={cidade.nome} // O value é usado para o filtro. Se quisermos filtrar pelo nome normalizado, o filtro customizado acima resolve.
                                                        onSelect={() => toggleCidade(cidade.nome)}
                                                    >
                                                        <div className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                                        )}>
                                                            <Check className={cn("h-4 w-4")} />
                                                        </div>
                                                        {cidade.nome}
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {regra.cidades.length > 0 && (
                            <ScrollArea className="h-[100px] w-full border rounded-md p-2">
                                <div className="flex flex-wrap gap-2">
                                    {regra.cidades.map((cidade) => (
                                        <Badge key={cidade} variant="secondary" className="pl-2 pr-1 h-6">
                                            {cidade}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                                onClick={() => toggleCidade(cidade)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
