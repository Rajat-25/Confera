import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('__Secure-authjs.session-token')?.value;

  const { pathname } = req.nextUrl;
  const publicPaths = ['/', '/signin'];

  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
