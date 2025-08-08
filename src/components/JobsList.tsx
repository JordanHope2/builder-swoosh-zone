 'use client';
import { useEffect, useState } from 'react';

export default function JobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(setJobs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading jobs…</p>;
  if (!jobs.length) return <p>No jobs yet.</p>;

  return (
    <ul className="space-y-2">
      {jobs.map(j => (
        <li key={j.id} className="p-3 rounded border">
          <div className="font-medium">{j.title}</div>
          {j.location && <div className="text-sm text-gray-500">{j.location}</div>}
        </li>
      ))}
    </ul>
  );
}
   