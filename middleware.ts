import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    console.log('[Middleware] URL:', request.nextUrl.pathname);
    console.log('[Middleware] Token:', token ? 'existe' : 'não existe');

    // Se não tem token, redireciona para login
    if (!token) {
        console.log('[Middleware] Sem token, redirecionando para /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar se token é válido
    const user = verifyToken(token);

    console.log('[Middleware] Token válido?', user ? 'sim' : 'não');

    if (!user) {
        // Token inválido, redireciona para login
        console.log('[Middleware] Token inválido, redirecionando para /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token válido, permite acesso
    console.log('[Middleware] Acesso permitido');
    return NextResponse.next();
}

// Forçar Node.js runtime para suportar jsonwebtoken (crypto module)
export const runtime = 'nodejs';

// Configurar quais rotas devem ser protegidas
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/pets/:path*',
    ],
};
