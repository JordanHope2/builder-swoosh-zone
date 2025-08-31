'use client';
import { useState } from 'react';

import { supabase } from '../lib/supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Sending…');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
    });
    setMsg(error ? `❌ ${error.message}` : '✅ Check your email for the sign-in link.');
  }

  return (
    <form onSubmit={sendLink} className="space-y-3 max-w-sm">
      <input
        type="email"
        placeholder="you@example.com"
        className="border p-2 w-full rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="px-3 py-2 border rounded w-full">Send magic link</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
