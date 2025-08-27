import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signOut } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  setSession: (session) => {
    set({ session, user: session?.user ?? null, loading: false });
  },
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  signUp: async (email, password, userData) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: userData } });
    if (error) throw error;
  },
  signInWithOtp: async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  },
  signOut: async () => {
    await signOut();
  },
  updateProfile: async (data) => {
    const { user } = get();
    if (!user) throw new Error("No user logged in");
    const { error } = await supabase.auth.updateUser({ data });
    if (error) throw error;
  },
}));

// Initialize the store with the session and subscribe to auth changes
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
