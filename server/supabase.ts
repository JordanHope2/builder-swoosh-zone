// server/supabase.ts
import "dotenv/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _anon: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_anon) return _anon;

  const url =
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_*) in your .env"
    );
  }

  _anon = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: true },
  });
  return _anon;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url =
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env"
    );
  }

  // ⚠ server-only: bypasses RLS
  _admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
