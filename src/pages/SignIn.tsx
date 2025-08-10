// src/pages/SignIn.tsx
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Sending magic link...');
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
    });
    setMsg(error ? `Error: ${error.message}` : 'Link sent! Check your email.');
  }

  async function signInGoogle() {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
    });
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={sendMagicLink} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          type="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <button className="w-full border rounded px-3 py-2" type="submit">
          Send magic link
        </button>
      </form>
      <button onClick={signInGoogle} className="w-full border rounded px-3 py-2">
        Continue with Google
      </button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  );
}
