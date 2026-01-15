"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useLogin } from "../hooks/use-login";
import { schemaLogin, type DadosLogin } from "../types/tipos-auth";

export function FormularioLogin() {
    const { login, estaCarregando } = useLogin();
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const form = useForm<DadosLogin>({
        resolver: zodResolver(schemaLogin),
        defaultValues: {
            email: "",
            senha: "",
        },
    });

    const aoSubmeter = (dados: DadosLogin) => {
        login(dados);
    };

    return (
        <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
                <p className="text-sm text-muted-foreground">
                    Entre com seu e-mail e senha para acessar
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(aoSubmeter)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="seu@email.com"
                                        type="email"
                                        autoComplete="email"
                                        disabled={estaCarregando}
                                        className="bg-background"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="senha"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="******"
                                            type={mostrarSenha ? "text" : "password"}
                                            autoComplete="current-password"
                                            disabled={estaCarregando}
                                            className="bg-background pr-10"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setMostrarSenha(!mostrarSenha)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {mostrarSenha ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={estaCarregando}>
                        {estaCarregando ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm">
                <Link
                    href="/esqueci-senha"
                    className="text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                    Esqueceu sua senha?
                </Link>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou continue com
                    </span>
                </div>
            </div>

            <Button variant="outline" className="w-full" disabled={estaCarregando}>
                Login com Google (Em breve)
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                    href="/registro"
                    className="text-primary hover:underline font-medium"
                >
                    Criar conta
                </Link>
            </div>
        </div>
    );
}
