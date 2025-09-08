import React from "react";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import type { Database } from '@shared/types/supabase';

// A simple banner to nudge users to complete their profile.
function ProfileCompletionNudge({ profile }: { profile: any }) {
  // A simple check for profile completeness.
  // You can expand this with more fields as needed.
  const isProfileComplete = profile?.full_name && profile?.avatar_url;

  if (isProfileComplete) {
    return null;
  }

  return (
    <div className="p-4 bg-yellow-100 border-b border-yellow-300 text-center">
      <p>
        Your profile is incomplete.{" "}
        <Link href="/profile-settings" className="underline font-bold">
          Complete it now
        </Link>{" "}
        to get the most out of JobEqual.
      </p>
    </div>
  );
}


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Fetch profile only if a session exists
  const { data: profile } = session
    ? await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
    : { data: null };

  return (
    <div>
      <Navigation />
      {/* Conditionally render the nudge only for authenticated users */}
      {session && <ProfileCompletionNudge profile={profile} />}
      <main>
        {children}
      </main>
    </div>
  );
}
