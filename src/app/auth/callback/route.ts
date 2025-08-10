import { NextResponse } from 'next/server';

export async function GET() {
  // Supabase auth-helpers handle session in cookies automatically on client.
  // We can just send users to home (or /jobs).
  return NextResponse.redirect(new URL('/jobs', process.env.NEXT_PUBLIC_APP_URL));
}
