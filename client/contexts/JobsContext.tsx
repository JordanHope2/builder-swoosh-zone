import React, { createContext, useContext, useState, useEffect } from "react";

import {
  getJobs,
  getJobById,
  submitApplication,
} from "../lib/supabase";

import { useAuth } from "./AuthContext";

// Utility function to extract error message from various error types
const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    // Handle Supabase errors
    if ("message" in error) return String(error.message);
    if ("error" in error && typeof error.error === "string") return error.error;
    if ("details" in error && typeof error.details === "string")
      return error.details;
  }
  return "An unexpected error occurred";
};

interface Job {
  id: string;
  title: string;
  description: string;
  company_id: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  type: "full-time" | "part-time" | "contract" | "internship";
  status: "draft" | "published" | "closed";
  created_at: string;
  updated_at: string;
  companies?: {
    name: string;
    logo_url?: string;
    location: string;
  };
}

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  searchJobs: (query: string) => void;
  getJobDetails: (id: string) => Promise<Job>;
  applyToJob: (jobId: string, applicationData: any) => Promise<void>;
  refreshJobs: () => Promise<void>;
}

interface JobFilters {
  location?: string;
  title?: string;
  type?: string;
  salaryMin?: number;
  salaryMax?: number;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const { user } = useAuth();

  const loadJobs = async (currentFilters: JobFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs(currentFilters);
      setJobs(data || []);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Error loading jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(filters);
  }, [filters]);

  const searchJobs = (query: string) => {
    setFilters({ ...filters, title: query });
  };

  const getJobDetails = async (id: string): Promise<Job> => {
    try {
      const job = await getJobById(id);
      return job;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  };

  const applyToJob = async (jobId: string, applicationData: any) => {
    if (!user) {
      throw new Error("You must be logged in to apply for jobs");
    }

    try {
      await submitApplication(jobId, user.id, applicationData);
      // Refresh jobs to update application status
      await loadJobs(filters);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  };

  const refreshJobs = async () => {
    await loadJobs(filters);
  };

  const value = {
    jobs,
    loading,
    error,
    filters,
    setFilters,
    searchJobs,
    getJobDetails,
    applyToJob,
    refreshJobs,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
