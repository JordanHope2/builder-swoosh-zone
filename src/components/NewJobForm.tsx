'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { JobSchema } from '../app/validation/jobSchemas';
import type { z } from 'zod';

type JobInput = z.infer<typeof JobSchema>;

export default function NewJobForm() {
  const [formData, setFormData] = useState<Partial<JobInput>>({});
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    const parsed = JobSchema.safeParse(formData);
    if (!parsed.success) {
        setMsg(`❌ Error: ${JSON.stringify(parsed.error.flatten())}`);
        return;
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(parsed.data),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json();
    if (res.ok) {
      setFormData({});
      setMsg('✅ Created!');
      window.location.reload();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setMsg(`❌ ${data?.error?.message || data?.error || 'Error'}`);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 mb-4 p-4 border rounded">
      <input
        name="title"
        className="border p-2 rounded"
        placeholder="Job title"
        onChange={handleChange}
      />
      <textarea
        name="description"
        className="border p-2 rounded"
        placeholder="Job description"
        onChange={handleChange}
      />
      <input
        name="location"
        className="border p-2 rounded"
        placeholder="Location"
        onChange={handleChange}
      />
      <input
        name="salary_min"
        type="number"
        className="border p-2 rounded"
        placeholder="Salary min"
        onChange={handleChange}
      />
      <input
        name="salary_max"
        type="number"
        className="border p-2 rounded"
        placeholder="Salary max"
        onChange={handleChange}
      />
      <button className="px-3 py-2 border rounded bg-blue-500 text-white">Create</button>
      {msg && <span className="self-center text-sm">{msg}</span>}
    </form>
  );
}