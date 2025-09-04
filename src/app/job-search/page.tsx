import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import JobSearchView from "./JobSearchView"; // The new client component
import type { Database } from '@shared/types/supabase';

export const dynamic = 'force-dynamic';

// This Server Component fetches the initial data for the job search page.
// It can also handle initial search results if query params are present.
export default async function JobSearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const q = searchParams?.q as string || '';
  const location = searchParams?.location as string || '';

  // Build the initial query
  let query = supabase
    .from("jobs")
    .select("*, companies(*)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (q) {
    // In a real app, you'd use full-text search here:
    // query = query.textSearch('fts', q)
    query = query.ilike('title', `%${q}%`);
  }
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  const { data: initialJobs, error } = await query;

  if (error) {
    console.error("Error fetching initial jobs:", error);
    // Handle error appropriately
  }

  // The initial list of jobs is passed to the client component.
  // The client component will then handle subsequent searches and filtering.
  return (
    <JobSearchView
      initialJobs={initialJobs || []}
      initialSearchQuery={q}
    />
  );
}
