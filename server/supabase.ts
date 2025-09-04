// server/supabase.ts
import "dotenv/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@shared/types/supabase";

let _anon: SupabaseClient<Database> | null = null;
let _admin: SupabaseClient<Database> | null = null;

import { getSecrets } from './services/secretManager';

export function getSupabase(): SupabaseClient<Database> {
  if (_anon) return _anon;

  // Public keys can remain as environment variables.
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env: set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_/NEXT_PUBLIC_ fallbacks).",
    );
  }

  _anon = createClient<Database>(url, anon, {
    auth: { persistSession: false, autoRefreshToken: true },
  });
  return _anon;
}

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (_admin) return _admin;

  const secrets = getSecrets();
  const url = secrets.SUPABASE_URL;
  const serviceKey = secrets.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase secrets (URL or service key) not found in cache. Ensure fetchAndCacheSecrets() is called at startup.",
    );
  }

  // ⚠ server-only: bypasses RLS
  _admin = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
