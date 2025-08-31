import { getSupabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return new Response(JSON.stringify({ user }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
}
