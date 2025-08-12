import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../shared/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://zithkvtlwfjjsrqafwgq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdGhrdnRsd2ZqanNycWFmd2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTIwOTAsImV4cCI6MjA2OTU4ODA5MH0.SSFS_R18ROUXHhiMBqZ5t6vpFQU_pbgFGYTdbD3_CRE";

console.log('Supabase configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey });
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helpers
export const auth = supabase.auth;

// Helper functions for common operations
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  userData?: any,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  if (error) throw error;
  return data;
};

// Mock data for development/demo
const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    description: 'Join our innovative team building next-generation financial technology solutions.',
    location: 'Zurich',
    salary_min: 120000,
    salary_max: 140000,
    type: 'full-time',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: {
      name: 'TechCorp Zurich',
      logo_url: '🏢',
      location: 'Zurich'
    }
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Lead product strategy and development for our growing fintech platform.',
    location: 'Geneva',
    salary_min: 100000,
    salary_max: 130000,
    type: 'full-time',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: {
      name: 'FinanceFlow',
      logo_url: '💼',
      location: 'Geneva'
    }
  },
  {
    id: '3',
    title: 'Data Scientist',
    description: 'Analyze complex datasets to drive business insights and growth.',
    location: 'Bern',
    salary_min: 100000,
    salary_max: 120000,
    type: 'full-time',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: {
      name: 'DataDriven Bern',
      logo_url: '📊',
      location: 'Bern'
    }
  }
];

// Database helpers
export const getJobs = async (filters?: any) => {
  console.log('getJobs called with filters:', filters);

  try {
    let query = supabase
      .from("jobs")
      .select("*")
      .limit(20);

    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters?.title) {
      query = query.ilike("title", `%${filters.title}%`);
    }

    console.log('Executing Supabase query...');
    const { data, error } = await query;

    if (error) {
      console.warn('Supabase query failed, using mock data:', error);
      // Return filtered mock data
      let filteredJobs = mockJobs;

      if (filters?.location) {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters?.title) {
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(filters.title.toLowerCase())
        );
      }

      return filteredJobs;
    }

    console.log('Jobs data received:', data);
    return data || mockJobs;
  } catch (error) {
    console.warn('Error in getJobs, using mock data:', error);
    return mockJobs;
  }
};

export const getJobById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.warn('Supabase getJobById failed, using mock data:', error);
      // Return mock job if Supabase fails
      const mockJob = mockJobs.find(job => job.id === id);
      if (mockJob) return mockJob;
      throw new Error('Job not found');
    }

    return data;
  } catch (error) {
    console.warn('Error in getJobById, trying mock data:', error);
    const mockJob = mockJobs.find(job => job.id === id);
    if (mockJob) return mockJob;
    throw error;
  }
};

export const submitApplication = async (
  jobId: string,
  candidateId: string,
  data: any,
) => {
  const { data: application, error } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      candidate_id: candidateId,
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return application;
};

// Real-time subscriptions
export const subscribeToMessages = (
  conversationId: string,
  callback: (payload: any) => void,
) => {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback,
    )
    .subscribe();
};

export const subscribeToNotifications = (
  userId: string,
  callback: (payload: any) => void,
) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe();
};

export default supabase;
