'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  async function sendLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    setMsg('Sending…');
    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback` },
      });
      setMsg(error ? `❌ ${error.message}` : '✅ Check your email for the sign-in link.');
    } catch (err: any) {
      setMsg(`❌ ${err?.message ?? 'Unexpected error'}`);
    } finally {
      setSending(false);
    }
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
      <button className="px-3 py-2 border rounded w-full" disabled={!email || sending}>
        {sending ? 'Sending…' : 'Send magic link'}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
