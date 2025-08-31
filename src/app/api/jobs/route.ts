import { type NextRequest } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabaseServer';
import type { Job } from '../../../lib/types.db';
import { JobSchema } from '../../validation/jobSchemas';

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify((data ?? []) as Job[]), { status: 200 });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await req.json().catch(() => ({}));
  const parse = JobSchema.safeParse(json);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: parse.error.flatten() }), { status: 422 });
  }

  const payload = parse.data;
  const { data, error } = await supabase.from('jobs').insert({
    owner_id: user.id,
    title: payload.title,
    description: payload.description,
    location: payload.location,
    salary_min: payload.salary_min ?? null,
    salary_max: payload.salary_max ?? null,
  }).select('*').single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify(data as Job), { status: 201 });
}
