import type { NextRequest } from 'next/server';

const ALLOW_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || '*';

export function withCORS(init?: ResponseInit) {
  return {
    ...init,
    headers: {
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      ...(init?.headers || {}),
    },
  };
}

export function handleOPTIONS(_req: NextRequest) {
  return new Response(null, withCORS({ status: 204 }));
}
