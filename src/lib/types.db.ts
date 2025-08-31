export interface Job {
  id: string;
  title: string;
  location?: string | null;
  description?: string | null;
  company?: string | null;
  created_at?: string | null;
  owner_id?: string | null;
  status?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
}

export interface Profile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  skills?: string[] | null;
  resume_url?: string | null;
  role?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  bio?: string | null;
}

export interface Subscription {
    id: string;
    user_id: string;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    stripe_price_id: string;
    status: string;
    created_at?: string | null;
}

export interface Candidate {
    id: string;
    name?: string | null;
    email?: string | null;
    created_at?: string | null;
}

export interface Company {
    id: string;
    name?: string | null;
    created_at?: string | null;
}

export interface Application {
    id: string;
    job_id: string;
    candidate_id: string;
    status: string;
    created_at?: string | null;
}

export interface Database {
  public: {
    Tables: {
      jobs: { Row: Job; Insert: Omit<Job, 'id'>; Update: Partial<Job> };
      profiles: { Row: Profile; Insert: Omit<Profile, 'id'>; Update: Partial<Profile> };
      subscriptions: { Row: Subscription; Insert: Omit<Subscription, 'id'>; Update: Partial<Subscription> };
      candidates: { Row: Candidate; Insert: Omit<Candidate, 'id'>; Update: Partial<Candidate> };
      companies: { Row: Company; Insert: Omit<Company, 'id'>; Update: Partial<Company> };
      applications: { Row: Application; Insert: Omit<Application, 'id'>; Update: Partial<Application> };
      // add other tables as you touch them
    };
  };
}
