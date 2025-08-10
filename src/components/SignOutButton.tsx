'use client';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SignOutButton() {
  async function signOut() {
    await supabaseClient.auth.signOut();
    window.location.reload();
  }
  return (
    <button onClick={signOut} className="px-3 py-2 border rounded">
      Sign out
    </button>
  );
}
