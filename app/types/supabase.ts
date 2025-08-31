export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          resume_url: string | null
          skills: string[] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          resume_url?: string | null
          skills?: string[] | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          resume_url?: string | null
          skills?: string[] | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          company_size: number | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          legal_entity_type: string | null
          location: string | null
          name: string
          offers_visa_sponsorship: boolean | null
          phone: string | null
          tags: string[] | null
          tech_stack: string[] | null
          updated_at: string
          website_url: string | null
          zefix_uid: string | null
        }
        Insert: {
          address?: string | null
          company_size?: number | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          legal_entity_type?: string | null
          location?: string | null
          name: string
          offers_visa_sponsorship?: boolean | null
          phone?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          website_url?: string | null
          zefix_uid?: string | null
        }
        Update: {
          address?: string | null
          company_size?: number | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          legal_entity_type?: string | null
          location?: string | null
          name?: string
          offers_visa_sponsorship?: boolean | null
          phone?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          updated_at?: string
          website_url?: string | null
          zefix_uid?: string | null
        }
        Relationships: []
      }
      companies_scraped_raw_data: {
        Row: {
          company_id: string
          created_at: string
          id: number
          raw_data: Json
          source: string
          source_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: number
          raw_data: Json
          source: string
          source_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: number
          raw_data?: Json
          source?: string
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_scraped_raw_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          owner_id: string | null
          posted_at: string | null
          salary_max: number | null
          salary_min: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          owner_id?: string | null
          posted_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          owner_id?: string | null
          posted_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          candidate_id: string | null
          id: string
          job_id: string | null
          match_score: number | null
          matched_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          id?: string
          job_id?: string | null
          match_score?: number | null
          matched_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          id?: string
          job_id?: string | null
          match_score?: number | null
          matched_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      scraped_candidate_skills: {
        Row: {
          candidate_id: number
          created_at: string
          id: number
          skill: string
          source_of_skill: string | null
        }
        Insert: {
          candidate_id: number
          created_at?: string
          id?: number
          skill: string
          source_of_skill?: string | null
        }
        Update: {
          candidate_id?: number
          created_at?: string
          id?: number
          skill?: string
          source_of_skill?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraped_candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "scraped_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      scraped_candidates: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string | null
          followers_count: number | null
          github_url: string | null
          id: number
          job_title: string | null
          last_scraped_at: string | null
          linkedin_url: string | null
          location: string | null
          name: string | null
          raw_data: Json | null
          source: string
          source_id: string
          twitter_url: string | null
          updated_at: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          followers_count?: number | null
          github_url?: string | null
          id?: number
          job_title?: string | null
          last_scraped_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          raw_data?: Json | null
          source: string
          source_id: string
          twitter_url?: string | null
          updated_at?: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          followers_count?: number | null
          github_url?: string | null
          id?: number
          job_title?: string | null
          last_scraped_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          raw_data?: Json | null
          source?: string
          source_id?: string
          twitter_url?: string | null
          updated_at?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
