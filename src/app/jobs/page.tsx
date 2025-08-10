import JobsList from '@/components/JobsList';
import NewJobFormGate from '@/components/NewJobFormGate';

export default function JobsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      <NewJobFormGate />   {/* <<—— was NewJobForm */}
      <JobsList />
    </div>
  );
}
