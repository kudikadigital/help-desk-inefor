import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Recupera o token que definimos na Route Handler de Login
  const token = request.cookies.get('auth_token')?.value;
  
  const { pathname } = request.nextUrl;

  // 2. Define as rotas
  const isLoginPage = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin') && !isLoginPage;

  // REGRA 1: Se tentar acessar /admin/... sem token, manda para o login
  if (isAdminPage && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // REGRA 2: Se já estiver logado e tentar ir para o login, manda para o dashboard
  if (isLoginPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/'; // ou /admin/dashboard conforme sua pasta
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// O matcher garante que o middleware só rode nas rotas administrativas
export const config = {
  matcher: ['/admin/:path*'],
};