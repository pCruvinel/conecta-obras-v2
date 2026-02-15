import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Rotas públicas que não requerem autenticação
    const publicRoutes = ['/login', '/registro', '/esqueci-senha'];
    const inactiveRoute = '/conta-inativa';

    // Verifica se a rota atual é pública (exata para /, startsWith para outras)
    const pathname = request.nextUrl.pathname;
    const isPublicRoute = pathname === '/' || publicRoutes.some(route => pathname.startsWith(route));
    const isInactiveRoute = pathname === inactiveRoute;

    // Se não estiver logado e tentar acessar rota protegida, redireciona para login
    if (!user && !isPublicRoute && !isInactiveRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Se estiver logado, verificar se a conta está ativa
    if (user && !isPublicRoute && !isInactiveRoute) {
        // Buscar dados do usuário e verificar se a franquia está ativa
        const { data: usuario } = await supabase
            .from('usuarios')
            .select('role, franquia_id')
            .eq('id', user.id)
            .single();

        // Se não for admin e tiver franquia, verificar se está ativa
        if (usuario && usuario.role !== 'admin' && usuario.franquia_id) {
            const { data: franquia } = await supabase
                .from('franquias')
                .select('ativa')
                .eq('id', usuario.franquia_id)
                .single();

            // Se franquia estiver inativa, redireciona para página de conta inativa
            if (franquia && franquia.ativa === false) {
                const url = request.nextUrl.clone();
                url.pathname = inactiveRoute;
                return NextResponse.redirect(url);
            }
        }
    }

    // Se estiver logado e tentar acessar login, redireciona para dashboard
    if (user && request.nextUrl.pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return response;
}
