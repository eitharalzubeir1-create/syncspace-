import { createClient } from '@supabase/supabase-js';
import { supabase as generatedSupabase } from '@/integrations/supabase/client';

const getEnv = (key: string): string | undefined => {
  const proc = (typeof process !== 'undefined' ? (process as any).env : undefined) || {};
  if (proc[key]) return proc[key];
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) || {};
  return viteEnv[key];
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  : generatedSupabase;

