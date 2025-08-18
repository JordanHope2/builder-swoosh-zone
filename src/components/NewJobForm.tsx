'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NewJobForm() {
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      setMsg(`❌ Error: ${sessionError.message}`);
      return;
    }

    if (!session) {
      setMsg('❌ Error: You must be logged in to create a job.');
      return;
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    if (res.ok) {
      setTitle('');
      setMsg('✅ Created!');
      window.location.reload();
    } else {
      setMsg(`❌ ${data?.error?.message || data?.error || 'Error'}`);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input
        className="border p-2 rounded flex-1"
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="px-3 py-2 border rounded">Create</button>
      {msg && <span className="self-center text-sm">{msg}</span>}
    </form>
  );
}
MODIFIED FILE: src/components/SignIn.tsx

'use client';
import { supabase } from '../lib/supabaseClient';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Sending…');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback` }
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