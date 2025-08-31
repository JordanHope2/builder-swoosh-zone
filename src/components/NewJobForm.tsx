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