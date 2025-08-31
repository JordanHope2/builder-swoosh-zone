import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../app/types/supabase';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient<Database> = createClient<Database>(url!, anon!);
