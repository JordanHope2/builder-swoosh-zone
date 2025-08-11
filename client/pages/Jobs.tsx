import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';

interface Job {
  id: string;
  title: string;
  location: {
    display_name: string;
  };
  company: {
    display_name: string;
  };
  description: string;
  redirect_url: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/scrape');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.results || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Scraped Job Listings
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Live jobs fetched from the Adzuna API.
          </p>
        </div>

        {loading && <p className="text-center">Loading jobs...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <a
                  key={job.id}
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-white dark:bg-gray-800 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-foreground">{job.title}</h2>
                  <p className="text-md text-muted-foreground font-medium">{job.company.display_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{job.location.display_name}</p>
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{job.description}</p>
                </a>
              ))
            ) : (
              <p className="text-center">No jobs found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
