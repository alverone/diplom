import { getAppSession } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await getAppSession();
  const isAuthenticated = session && session?.user;
  const canEnterAdmin = session?.user?.role === UserRole.ADMIN;

  //const isAdminRoute = adminRoutes.includes(req.nextUrl.pathname);
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAccountRoute = req.nextUrl.pathname.startsWith('/account');

  if (!isAuthenticated && isAccountRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login?fromAdmin=true', req.url));
    } else if (isAuthenticated && !canEnterAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    } /*if (isAuthenticated && canEnterAdmin) */ else {
      //return NextResponse.redirect(new URL('/admin/', req.url));
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account', '/account/:path*', '/admin/', '/admin/:path*'],
};
