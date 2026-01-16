'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, LogOut } from "lucide-react";
import { useLogout } from "@/features/autenticacao/hooks/use-logout";

export default function ContaInativaPage() {
    const { logout, estaDeslogando } = useLogout();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl text-amber-700">Conta Inativa</CardTitle>
                    <CardDescription className="text-base">
                        Sua conta foi desativada pelo administrador do sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Se você acredita que isso foi um erro, entre em contato com o suporte
                        ou com o administrador da plataforma para reativar sua conta.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Suporte:</strong> contato@conectaobras.com.br
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={logout}
                        disabled={estaDeslogando}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {estaDeslogando ? 'Saindo...' : 'Sair da Conta'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
