'use client';
import { useEffect, useState } from 'react';

import NewJobForm from './NewJobForm';
import { supabase } from '../lib/supabaseClient';

export default function NewJobFormGate() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
  }, []);

  if (authed === null) return <p>Checking session…</p>;
  if (!authed) return <a href="/sign-in" className="underline">Sign in to create a job</a>;

  return <NewJobForm />;
}
