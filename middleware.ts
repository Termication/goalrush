import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/create-article', '/admin/:path*'],
}

export function middleware(req: NextRequest) {
  const isAdmin = req.cookies.get('admin')?.value === 'true'

  if (!isAdmin) {
    const loginUrl = new URL('/login', req.url)
    console.log('❌ Not authenticated, redirecting to login.');
    return NextResponse.redirect(loginUrl)
  }

  console.log('✅ Admin verified, allowing access.');
  return NextResponse.next()
}
