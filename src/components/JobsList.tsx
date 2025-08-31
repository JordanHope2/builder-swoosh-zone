import type { Job } from '../../lib/types.db';

type Props = { jobs: Pick<Job, 'id' | 'title' | 'location'>[] };

export function JobsList({ jobs }: Props) {
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
export default JobsList;
   