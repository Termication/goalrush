import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin/manage-staff') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/create-article', req.url));
    }
  },
  {
    callbacks: {
      // Requires authentication
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  // Protect 
  matcher: [
    '/admin/:path*',
    '/manage/:path*',
  ],
};