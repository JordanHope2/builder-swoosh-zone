import { withCORS, handleOPTIONS } from '@/lib/cors';
import type { NextRequest } from 'next/server';

export function OPTIONS(req: NextRequest) { return handleOPTIONS(req); }

export async function GET() {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), withCORS());
}
