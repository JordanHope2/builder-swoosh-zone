'use client';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import NewJobForm from '@/components/NewJobForm';

export default function NewJobFormGate() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  if (authed === null) return <p>Checking session…</p>;
  if (!authed) return <a href="/sign-in" className="underline">Sign in to create a job</a>;

  return <NewJobForm />;
}
