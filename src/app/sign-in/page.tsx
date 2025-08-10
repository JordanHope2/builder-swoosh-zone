// app/sign-in/page.tsx
'use client';
import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Envoi du lien...');
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
    });
    setMsg(error ? `Erreur: ${error.message}` : 'Lien envoyé ! Vérifie ton email.');
  }

  async function signInGoogle() {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` }
    });
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <form onSubmit={sendMagicLink} className="space-y-3">
        <input className="w-full border rounded px-3 py-2"
               type="email" value={email}
               onChange={e => setEmail(e.target.value)} required />
        <button className="w-full border rounded px-3 py-2" type="submit">
          Recevoir un lien magique
        </button>
      </form>
      <button onClick={signInGoogle} className="w-full border rounded px-3 py-2">
        Continuer avec Google
      </button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </div>
  );
}
