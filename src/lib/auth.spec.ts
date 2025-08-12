import { describe, it, expect } from 'vitest';
import { supabaseClient } from './supabaseClient';

describe('Supabase Client', () => {
  it('should create a Supabase client', () => {
    expect(supabaseClient).toBeTypeOf('object');
    expect(supabaseClient).not.toBeNull();
  });

  it('should have an auth property', () => {
    expect(supabaseClient).toHaveProperty('auth');
  });
});
