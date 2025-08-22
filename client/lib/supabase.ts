// src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../shared/types/supabase";

// Create a browser client once (uses Vite's import.meta.env)
let _client: SupabaseClient<Database> | null = null;

function makeBrowserClient(): SupabaseClient<Database> {
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Don't log secrets; just indicate presence
    console.error("Missing Supabase env", {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
    });
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

// Keep your original export name
export const supabase: SupabaseClient<Database> =
  _client ?? (_client = makeBrowserClient());

// ===== Auth helpers (unchanged API) =====
export const auth = supabase.auth;

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
    options: { data: userData },
  });
  if (error) throw error;
  return data;
};

// ===== Mock data (kept) =====
const mockJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    description:
      "Join our innovative team building next-generation financial technology solutions.",
    location: "Zurich",
    salary_min: 120000,
    salary_max: 140000,
    type: "full-time",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: { name: "TechCorp Zurich", logo_url: "🏢", location: "Zurich" },
  },
  {
    id: "2",
    title: "Product Manager",
    description:
      "Lead product strategy and development for our growing fintech platform.",
    location: "Geneva",
    salary_min: 100000,
    salary_max: 130000,
    type: "full-time",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: { name: "FinanceFlow", logo_url: "💼", location: "Geneva" },
  },
  {
    id: "3",
    title: "Data Scientist",
    description:
      "Analyze complex datasets to drive business insights and growth.",
    location: "Bern",
    salary_min: 100000,
    salary_max: 120000,
    type: "full-time",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: { name: "DataDriven Bern", logo_url: "📊", location: "Bern" },
  },
];

// ===== DB helpers (kept; adds safe fallbacks) =====
export const getJobs = async (filters?: any) => {
  try {
    let query = supabase.from("jobs").select("*").limit(20);

    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters?.title) {
      query = query.ilike("title", `%${filters.title}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase query failed, using mock data:", error);
      throw error;
    }

    return data ?? mockJobs;
  } catch (error) {
    // Filter mock data as a fallback
    let filtered = [...mockJobs];
    if (filters?.location) {
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(filters.location.toLowerCase()),
      );
    }
    if (filters?.title) {
      filtered = filtered.filter((j) =>
        j.title.toLowerCase().includes(filters.title.toLowerCase()),
      );
    }
    return filtered;
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
      console.warn("Supabase getJobById failed, using mock:", error);
      const mock = mockJobs.find((j) => j.id === id);
      if (mock) return mock;
      throw new Error("Job not found");
    }
    return data;
  } catch (err) {
    console.warn("Error in getJobById, trying mock:", err);
    const mock = mockJobs.find((j) => j.id === id);
    if (mock) return mock;
    throw err;
  }
};

export const submitApplication = async (
  jobId: string,
  candidateId: string,
  data: any,
) => {
  const { data: application, error } = await supabase
    .from("applications")
    .insert({ job_id: jobId, candidate_id: candidateId, ...data })
    .select()
    .single();

  if (error) throw error;
  return application;
};

// ===== Realtime subscriptions (fixed template strings) =====
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
