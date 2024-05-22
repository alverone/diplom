import { getAppSession } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const adminRoutes = ['/admin'];
const accountRoutes = ['/account/:path?'];

export async function middleware(req: NextRequest) {
  const session = await getAppSession();
  const isAuthenticated = session && session?.user;
  const canEnterAdmin =
    isAuthenticated && session?.user?.role === UserRole.ADMIN;

  //const isAdminRoute = adminRoutes.includes(req.nextUrl.pathname);
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAccountRoute = req.nextUrl.pathname.startsWith('/account');

  if (!isAuthenticated && isAccountRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  } else if (!canEnterAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL('/login?fromAdmin=true', req.url));
  }

  return NextResponse.next();
}

export const config = {
  //FIXME: add admin routes
  matcher: ['/account', '/account/:path*', '/admin/', '/admin/:path*'],
};
