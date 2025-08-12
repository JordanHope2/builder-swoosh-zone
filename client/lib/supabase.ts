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

// Database helpers
export const getJobs = async (filters?: any) => {
  let query = supabase
    .from("jobs")
    .select(
      `
      *,
      companies(name, logo_url, location),
      applications(id, status, candidate_id)
    `,
    )
    .eq("status", "published");

  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  if (filters?.title) {
    query = query.ilike("title", `%${filters.title}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getJobById = async (id: string) => {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      companies(*),
      applications(*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
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
