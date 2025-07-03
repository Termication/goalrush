// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.ADMIN_SECRET

export const config = {
  matcher: ['/admin/:path*', '/create-article'],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get('admin-token')?.value;

  try {
    const decoded = jwt.verify(token || '', SECRET_KEY);
    console.log('✅ Admin verified:', decoded);
    return NextResponse.next();
  } catch (err) {
    console.warn('❌ Invalid or missing admin token');
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}
