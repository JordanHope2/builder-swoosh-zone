// server/supabase.ts
import "dotenv/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../app/types/supabase";

let _anon: SupabaseClient<Database> | null = null;
let _admin: SupabaseClient<Database> | null = null;

function getEnv(name: string) {
  return process.env[name];
}

export function getSupabase(): SupabaseClient<Database> {
  if (_anon) return _anon;

  // Prefer server names; keep Vite/Next fallbacks
  const url =
    getEnv("SUPABASE_URL") ||
    getEnv("VITE_SUPABASE_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_URL");

  const anon =
    getEnv("SUPABASE_ANON_KEY") ||
    getEnv("VITE_SUPABASE_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

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

  const url =
    getEnv("SUPABASE_URL") ||
    getEnv("VITE_SUPABASE_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_URL");

  const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin env: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  // ⚠ server-only: bypasses RLS
  _admin = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
