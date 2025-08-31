'use client';
import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabaseClient';

export default function SessionInfo() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="text-sm text-gray-600">
      {email ? <>Signed in as <strong>{email}</strong></> : <>Not signed in</>}
    </div>
  );
}
