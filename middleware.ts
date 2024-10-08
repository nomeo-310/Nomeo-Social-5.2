import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {

    const protectedRoutes = ['/', '/users/:path*', '/posts/:path*', '/notifications', '/bookmarks', '/image-gallery', '/video-gallery'];

    const publicRoutes = ['/sign-in', '/sign-up'];

    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (publicRoutes.includes(req.nextUrl.pathname) && req.nextauth.token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
);

export const config = {
  matcher: ['/', '/users/:path*', '/posts/:path*', '/notifications', '/bookmarks', '/image-gallery', '/video-gallery'],
};