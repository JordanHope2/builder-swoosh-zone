import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CandidateDashboardView from "./CandidateDashboardView"; // The new client component for the UI
import type { Database } from '@shared/types/supabase';

export const dynamic = 'force-dynamic';

// This is a Next.js Page component. It's a Server Component by default.
export default async function CandidateDashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // 1. Check for an active session and get the user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // This protects the page from unauthenticated users.
    redirect("/signin");
  }

  const userId = session.user.id;

  // 2. Fetch all necessary data for the dashboard in parallel
  const [profileRes, applicationsRes, recommendationsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("applications").select("*, jobs(title, company_name)").limit(5),
    supabase.rpc("match_jobs", {
      // TODO: Generate a real user embedding from the user's profile
      // text (bio, skills, etc.) using the `getEmbedding` service,
      // similar to the /api/recommendations route.
      query_embedding: Array(1536).fill(0), // Corrected placeholder
      match_threshold: 0.7,
      match_count: 5,
    })
  ]);

  const { data: profile, error: profileError } = profileRes;
  const { data: applications, error: applicationsError } = applicationsRes;
  const { data: recommendations, error: recommendationsError } = recommendationsRes;

  if (profileError || applicationsError || recommendationsError) {
    console.error("Error fetching dashboard data:", profileError || applicationsError || recommendationsError);
    // You might want to show an error page here
  }

  // 3. Pass the fetched data as props to the Client Component
  return (
    <CandidateDashboardView
      user={session.user}
      profile={profile}
      applications={applications}
      recommendations={recommendations}
    />
  );
}
