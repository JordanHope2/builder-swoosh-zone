import { supabaseServer } from '@/lib/supabaseServer';
import { withCORS, handleOPTIONS } from '@/lib/cors';
import { z } from 'zod';
import type { NextRequest } from 'next/server';

export function OPTIONS(req: NextRequest) { return handleOPTIONS(req); }

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) return new Response(JSON.stringify({ error: error.message }), withCORS({ status: 400 }));
  return new Response(JSON.stringify(data), withCORS());
}

const JobSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().default(''),
  location: z.string().optional().default(''),
  salary_min: z.number().int().nonnegative().optional(),
  salary_max: z.number().int().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), withCORS({ status: 401 }));

  const json = await req.json().catch(() => ({}));
  const parse = JobSchema.safeParse(json);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: parse.error.flatten() }), withCORS({ status: 422 }));
  }

  const payload = parse.data;
  const { data, error } = await supabase.from('jobs').insert({
    owner: user.id,
    title: payload.title,
    description: payload.description,
    location: payload.location,
    salary_min: payload.salary_min ?? null,
    salary_max: payload.salary_max ?? null,
  }).select('*').single();

  if (error) return new Response(JSON.stringify({ error: error.message }), withCORS({ status: 400 }));
  return new Response(JSON.stringify(data), withCORS({ status: 201 }));
}
