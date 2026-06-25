import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;

  if (token) {
    const authRoutes = ['/login', '/signup'];
    if (authRoutes.includes(path) || path === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    if (path.startsWith('/dashboard') || path.startsWith('/api/dashboard')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};