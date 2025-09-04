import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from '@shared/types/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ jobs: [], error: "Search query 'q' is required." }, { status: 400 });
  }

  const supabase = createServerComponentClient<Database>({ cookies });

  // Use textSearch for full-text search capabilities.
  // This requires a 'fts' column on your jobs table.
  // Example: SELECT to_tsvector('english', title || ' ' || description)
  // For now, we use a simple ilike for demonstration.
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .ilike('title', `%${q}%`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error searching for jobs:", error);
    return NextResponse.json({ jobs: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobs });
}
