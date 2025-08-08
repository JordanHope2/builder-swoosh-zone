import { supabaseServer } from '@/lib/supabaseServer';
import { withCORS, handleOPTIONS } from '@/lib/cors';
import type { NextRequest } from 'next/server';

export function OPTIONS(req: NextRequest) { return handleOPTIONS(req); }

export async function GET() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return new Response(JSON.stringify({ user }), withCORS());
}
