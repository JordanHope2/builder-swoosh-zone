import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Helper function to make authenticated API requests
const fetchFromApi = async (endpoint: string, token: string | undefined, options: RequestInit = {}) => {
    if (!token) throw new Error("Authentication token not found.");
    const res = await fetch(endpoint, {
        ...options,
        headers: { ...options.headers, "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "An API error occurred.");
    }
    return res.json();
};

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const { session } = useAuth();
  const token = session?.access_token;

  const { mutate: searchJobs, isPending, error } = useMutation({
    mutationFn: (query: string) =>
      fetchFromApi("/api/match/jobs", token, {
        method: "POST",
        body: JSON.stringify({ query }),
      }),
    onSuccess: (data) => {
        setJobResults(data.jobs);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    searchJobs(searchQuery);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-jobequal-text mb-4 sm:mb-6 leading-tight">
            Find Your Dream Job
          </h1>
          <p className="text-lg sm:text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
            Use our AI-powered semantic search to find opportunities that truly match your skills and aspirations.
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-jobequal-neutral-dark mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-jobequal-text-muted" />
              <input
                type="text"
                placeholder="Describe your ideal job, skills, or company culture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm sm:text-base lg:text-lg"
              />
            </div>
            <button type="submit" disabled={isPending || !token} className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base flex items-center justify-center disabled:opacity-50">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </div>
        </form>

        <div className="lg:col-span-3">
            <h2 className="text-xl sm:text-2xl font-bold text-jobequal-text mb-6">
                {isPending ? 'Searching...' : jobResults.length > 0 ? `Found ${jobResults.length} matching jobs` : 'Search for jobs to see results'}
            </h2>

            {error && <div className="p-4 text-red-500 bg-red-50 rounded-lg flex items-center space-x-2"><AlertCircle /><span>{error.message}</span></div>}

            <div className="space-y-4 sm:space-y-6">
                {jobResults.map((job: any) => (
                    <div key={job.id} className="p-6 border rounded-xl bg-white shadow-sm">
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="font-medium text-jobequal-green">{job.company_name}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.description}</p>
                    </div>
                ))}
            </div>
          </div>
      </div>
    </main>
  );
}
