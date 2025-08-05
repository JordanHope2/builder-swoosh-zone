// Supabase Database Types
// This file should be generated using: supabase gen types typescript --local > shared/types/supabase.ts

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'candidate' | 'recruiter' | 'company' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          role?: 'candidate' | 'recruiter' | 'company' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'candidate' | 'recruiter' | 'company' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          location: string | null;
          size: string | null;
          industry: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          location?: string | null;
          size?: string | null;
          industry?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          location?: string | null;
          size?: string | null;
          industry?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string;
          requirements: string[] | null;
          salary_min: number | null;
          salary_max: number | null;
          currency: string | null;
          location: string | null;
          type: 'full-time' | 'part-time' | 'contract' | 'internship';
          company_id: string;
          recruiter_id: string | null;
          status: 'draft' | 'published' | 'closed';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          requirements?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string | null;
          location?: string | null;
          type?: 'full-time' | 'part-time' | 'contract' | 'internship';
          company_id: string;
          recruiter_id?: string | null;
          status?: 'draft' | 'published' | 'closed';
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          requirements?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string | null;
          location?: string | null;
          type?: 'full-time' | 'part-time' | 'contract' | 'internship';
          company_id?: string;
          recruiter_id?: string | null;
          status?: 'draft' | 'published' | 'closed';
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
          cover_letter: string | null;
          resume_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          status?: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
          cover_letter?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          status?: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
          cover_letter?: string | null;
          resume_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: 'active' | 'cancelled' | 'past_due' | 'trialing';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: 'active' | 'cancelled' | 'past_due' | 'trialing';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          status?: 'active' | 'cancelled' | 'past_due' | 'trialing';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          type: 'text' | 'image' | 'file' | 'audio' | 'video';
          file_url: string | null;
          read_by: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          type?: 'text' | 'image' | 'file' | 'audio' | 'video';
          file_url?: string | null;
          read_by?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          type?: 'text' | 'image' | 'file' | 'audio' | 'video';
          file_url?: string | null;
          read_by?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'candidate' | 'recruiter' | 'company' | 'admin';
      job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
      application_status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
      subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    };
  };
}
