import { getSupabase } from '../supabase';

export const root = {
  jobs: async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(*)');
    if (error) throw error;
    return data;
  },
  job: async ({ id }: { id: string }) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};
