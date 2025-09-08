import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@shared/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not signed in, and they are trying to access a protected route, redirect them to the sign-in page.
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Check the user's role.
  // This assumes you have a `profiles` table with a `role` column.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const role = profile?.role;
  const pathname = req.nextUrl.pathname;

  // Role-based route protection.
  if (pathname.startsWith('/candidate-dashboard') && role !== 'candidate') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect to home
  }
  if (pathname.startsWith('/recruiter-dashboard') && role !== 'recruiter') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (pathname.startsWith('/owner-admin-dashboard') && role !== 'owner') {
    return NextResponse.redirect(new URL('/', req.url));
  }


  return res;
}

export const config = {
  matcher: ['/candidate-dashboard/:path*', '/recruiter-dashboard/:path*', '/owner-admin-dashboard/:path*'],
};
