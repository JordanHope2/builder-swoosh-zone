import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import CompaniesView from "./CompaniesView"; // The new client component
import type { Database } from '@shared/types/supabase';

export const dynamic = 'force-dynamic';

// This Server Component fetches the initial data for the companies page.
export default async function CompaniesPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: initialCompanies, error } = await supabase
    .from("companies")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching initial companies:", error);
  }

  return (
    <CompaniesView
      initialCompanies={initialCompanies || []}
    />
  );
}
