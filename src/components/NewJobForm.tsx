'use client';

import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NewJobForm() {
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setMsg('');
    setSubmitting(true);
    try {
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

      // Try to parse JSON (may fail on non-JSON errors)
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        /* ignore */
      }

      if (res.ok) {
        setTitle('');
        setMsg('✅ Created!');
        // If you prefer SPA navigation instead of hard reload, replace with your router call
        window.location.reload();
      } else {
        const errText =
          data?.error?.message ||
          data?.error ||
          (typeof data === 'string' ? data : '') ||
          (await res.text()).slice(0, 300) ||
          'Error';
        setMsg(`❌ ${errText}`);
      }
    } catch (err: any) {
      setMsg(`❌ ${err?.message ?? 'Unexpected error'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input
        className="border p-2 rounded flex-1"
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button className="px-3 py-2 border rounded" disabled={!title.trim() || submitting}>
        {submitting ? 'Creating…' : 'Create'}
      </button>
      {msg && <span className="self-center text-sm">{msg}</span>}
    </form>
  );
}
