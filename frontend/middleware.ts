// middleware.js
import { matchesMiddleware } from 'next/dist/shared/lib/router/router';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /write-email route
  if (pathname === '/write-email' || pathname === '/home' || pathname.startsWith('/dashboard')) {
    // Fetch auth status from your API
    const authResponse = await fetch('http://localhost:8000/api/check-auth', {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '', // Forward cookies from the request
      },
    });

    if (!authResponse.ok) {
      // Not authenticated, redirect to /login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const authData = await authResponse.json();
    if (!authData.is_authenticated) {
      // Not authenticated, redirect to /login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authData.status != "Normal"){
        return NextResponse.next();
    }
    else {
        return NextResponse.redirect(new URL('/write_email', request.url));
    }
    // Authenticated, allow the request to proceed
    
  }

  // For all other routes, proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/write-email', '/home', '/dashboard/:id*'], // Apply middleware only to /write-email
};