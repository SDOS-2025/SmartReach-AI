// middleware.js
import { matchesMiddleware } from 'next/dist/shared/lib/router/router';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;


  if (pathname === '/login'){
    const authResponse = await fetch('http://localhost:8000/api/check-auth', {
        method: 'GET',
        headers: {
          Cookie: request.headers.get('cookie') || '', // Forward cookies from the request
        },
      });
  
      if (!authResponse.ok) {
        // Not authenticated, redirect to /login
        return NextResponse.next();
      }
  
      const authData = await authResponse.json();
      if (!authData.is_authenticated) {
        // Not authenticated, redirect to /login
        return NextResponse.next();
      }
  
      if (authData.status === "Normal"){
          return NextResponse.redirect(new URL('/write_email', request.url));
      }
      else {
          return NextResponse.redirect(new URL('/home', request.url));
      }
    }
  if (pathname === '/write-email' || pathname === '/home' || pathname.startsWith('/dashboard') || pathname === '/admin') {
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
  
  }

  if (pathname === '/write_email'){
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

      if (authData.status === "Normal"){
          return NextResponse.next();
      }
      else {
          return NextResponse.redirect(new URL('/home', request.url));
      }
  }

  

  // For all other routes, proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/write-email', '/home', '/dashboard/:id*', '/login', '/admin', '/write_email'], 
};