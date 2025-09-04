"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Search,
  Filter,
  Bookmark,
  Star,
  TrendingUp,
  Zap,
  X,
} from "lucide-react";
import Link from "next/link";
// Mocking these for now, as they rely on context that needs to be set up for Next.js
// import { useFavorites } from "@/contexts/FavoritesContext";

// Define the Job type based on our database schema
// Note: This should ideally be generated from your Supabase types
type Company = {
  name: string;
  logo_url: string | null;
} | null;

type Job = {
  id: string;
  title: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  type: string | null;
  description: string | null;
  created_at: string;
  companies: Company;
};

function JobCard({ job }: { job: Job }) {
  // const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  // const isBookmarked = isFavorite(job.id);

  const handleBookmark = () => {
    // Logic to handle bookmarking would go here
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-3xl shadow-md flex-shrink-0">
            {job.companies?.logo_url ? <img src={job.companies.logo_url} alt={job.companies.name} className="w-10 h-10 object-contain" /> : '🚀'}
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/job/${job.id}`} className="group-hover:text-jobequal-green transition-colors">
              <h3 className="font-bold text-xl text-jobequal-text mb-2 leading-tight line-clamp-2">{job.title}</h3>
            </Link>
            <p className="text-jobequal-text-muted font-medium text-lg mb-2">{job.companies?.name || 'N/A'}</p>
          </div>
        </div>
        <button onClick={handleBookmark} className="p-2 rounded-lg hover:bg-gray-100">
          <Bookmark className="w-6 h-6 text-jobequal-text-muted hover:text-red-500" />
        </button>
      </div>
      <p className="text-jobequal-text-muted leading-relaxed text-sm line-clamp-3 my-4">{job.description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-jobequal-neutral-dark mt-4">
        <div className="flex items-center text-jobequal-text-muted text-sm">
          <MapPin className="w-4 h-4 mr-2 text-jobequal-green" />
          <span className="font-medium">{job.location}</span>
        </div>
        <Link href={`/job/${job.id}`} className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-2 rounded-xl font-medium hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md">
          View Details
        </Link>
      </div>
    </div>
  );
}


export default function JobSearchView({
  initialJobs,
  initialSearchQuery,
}: {
  initialJobs: Job[];
  initialSearchQuery: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [jobs, setJobs] = useState(initialJobs);
  const [isLoading, setIsLoading] = useState(false);

  // This effect will re-fetch jobs when the search query changes.
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const handler = setTimeout(() => {
      if (searchQuery !== initialSearchQuery) {
        setIsLoading(true);
        // Fetch new jobs from our API route
        fetch(`/api/jobs/search?q=${searchQuery}`)
          .then((res) => res.json())
          .then((data) => {
            setJobs(data.jobs || []);
            setIsLoading(false);
          });
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, initialSearchQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      {/* The Navigation will be handled by the root layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-jobequal-text mb-4">Find Your Dream Job</h1>
          <p className="text-lg text-jobequal-text-muted max-w-3xl mx-auto">Discover opportunities that match your skills and aspirations across Switzerland</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-transparent text-jobequal-text focus:ring-2 focus:ring-jobequal-green"
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="hidden lg:block lg:col-span-1">
            {/* Filter Sidebar would go here */}
            <div className="bg-white/90 p-8 rounded-3xl border sticky top-24">
              <h3 className="text-2xl font-bold">Filters</h3>
              <p className="mt-4 text-jobequal-text-muted">Filter controls will be implemented here.</p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-jobequal-text mb-6">
              {isLoading ? "Searching..." : `${jobs.length} Jobs Found`}
            </h2>
            <div className="space-y-6">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
