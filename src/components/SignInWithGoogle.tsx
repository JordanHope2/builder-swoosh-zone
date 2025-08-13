'use client';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SignInWithGoogle() {
  async function signIn() {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });
  }
  return (
    <button onClick={signIn} className="px-3 py-2 border rounded w-full">
      Continuer avec Google
    </button>
  );
}
