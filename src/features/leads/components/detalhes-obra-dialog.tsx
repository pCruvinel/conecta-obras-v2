import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Obra } from "../types/tipos-obra";
import { Building2, Calendar, MapPin, Ruler, User, Wallet, Phone, Mail, FileText } from "lucide-react";

interface DetalhesObraDialogProps {
    obra: Obra;
    children: React.ReactNode;
}

export function DetalhesObraDialog({ obra, children }: DetalhesObraDialogProps) {

    // Formatadores (reutilizáveis)
    const formatarMoeda = (valor: number | null | undefined) => {
        if (!valor) return 'Não informado';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    const formatarData = (data: string | null | undefined) => {
        if (!data) return '--/--/----';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarNumero = (valor: number | null | undefined, suffix = '') => {
        if (!valor) return '--';
        return `${valor.toLocaleString('pt-BR')} ${suffix}`;
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            em_andamento: "bg-green-100 text-green-700 hover:bg-green-100/80",
            em_projeto: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
            em_licitacao: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
            paralisada: "bg-red-100 text-red-700 hover:bg-red-100/80",
            concluida: "bg-slate-100 text-slate-700 hover:bg-slate-100/80",
        };
        const colorClass = colors[status] || "bg-gray-100 text-gray-700";

        return (
            <Badge variant="outline" className={`capitalize border-0 ${colorClass}`}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border shadow-lg sm:max-w-4xl">
                <DialogHeader className="px-6 py-5 border-b bg-muted/5 shrink-0">
                    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-foreground truncate" title={obra.subcategoria}>
                                {obra.subcategoria}
                            </DialogTitle>
                            <DialogDescription className="flex items-center gap-1.5 text-sm text-foreground/70">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {obra.endereco}, {obra.cidade}/{obra.estado}
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2 pr-8 shrink-0">
                            <span className="text-sm font-medium text-foreground">
                                <span className="text-muted-foreground mr-1">Situação:</span>
                                {obra.situacao.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-y-auto bg-background">
                    <div className="p-6 space-y-8">

                        {/* Grade de Informações Principais - Equal Height */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Cronograma */}
                            <div className="flex flex-col h-full space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <h3>Cronograma</h3>
                                </div>
                                <div className="bg-card p-4 rounded-lg border border-border space-y-2.5 text-sm shadow-sm flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Início</span>
                                        <span className="font-medium font-mono text-foreground">{formatarData(obra.data_inicio)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Previsão</span>
                                        <span className="font-medium font-mono text-foreground">{formatarData(obra.previsao_termino)}</span>
                                    </div>
                                    <Separator className="bg-border/50 my-auto" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Etapa</span>
                                        <span className="font-medium capitalize text-foreground">{obra.tipo_obra}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dimensões & Valores */}
                            <div className="flex flex-col h-full space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Ruler className="h-4 w-4 text-primary" />
                                    <h3>Dimensões & Valores</h3>
                                </div>
                                <div className="bg-card p-4 rounded-lg border border-border space-y-2.5 text-sm shadow-sm flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Metragem</span>
                                        <span className="font-medium text-foreground">{formatarNumero(obra.metragem, 'm²')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Área Total</span>
                                        <span className="font-medium text-foreground">{formatarNumero(obra.area_total, 'm²')}</span>
                                    </div>
                                    <Separator className="bg-border/50 my-auto" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Investimento</span>
                                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">{formatarMoeda(obra.valor_investimento)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dados Técnicos */}
                            <div className="flex flex-col h-full space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    <h3>Dados Técnicos</h3>
                                </div>
                                <div className="bg-card p-4 rounded-lg border border-border space-y-2.5 text-sm shadow-sm flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">CNO</span>
                                        <span className="font-medium font-mono text-foreground">{obra.cno || '--'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Tipo Área</span>
                                        <span className="font-medium capitalize text-foreground">{obra.tipo_area}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Destinação</span>
                                        <span className="font-medium text-foreground">{obra.destinacao || 'Venda'}</span>
                                    </div>
                                    {obra.kilowatt && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Potência</span>
                                            <span className="font-medium text-foreground">{obra.kilowatt} KW</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seção de Responsáveis */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">Responsáveis</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Card Proprietário */}
                                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors shadow-sm">
                                    <div className="p-2 bg-blue-50 rounded-md text-blue-600 border border-blue-100">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1 w-full">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proprietário</span>
                                        <p className="font-medium text-sm sm:text-base text-foreground truncate" title={obra.proprietario || undefined}>{obra.proprietario || 'Não informado'}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-md"><Phone className="h-3.5 w-3.5" /></Button>
                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-md"><Mail className="h-3.5 w-3.5" /></Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Responsável Técnico/Construtora */}
                                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors shadow-sm">
                                    <div className="p-2 bg-orange-50 rounded-md text-orange-600 border border-orange-100">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1 w-full">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            {obra.responsavel_tipo === 'PJ' ? 'Empresa Responsável' : 'Responsável Técnico'}
                                        </span>
                                        <p className="font-medium text-sm sm:text-base text-foreground truncate" title={obra.responsavel_nome || undefined}>{obra.responsavel_nome || 'Não informado'}</p>
                                        {obra.responsavel_cnpj && (
                                            <p className="text-[11px] text-muted-foreground font-mono">Doc: {obra.responsavel_cnpj}</p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 rounded-md">
                                                <FileText className="h-3.5 w-3.5" /> Ficha Técnica
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                {/* Footer Simplificado */}
                <div className="p-3 border-t border-border bg-muted/5 flex justify-end">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-md h-8 text-xs">Fechar</Button>
                    </DialogTrigger>
                </div>
            </DialogContent>
        </Dialog>
    );
}
