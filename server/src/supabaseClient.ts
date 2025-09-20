import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded at import time
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string | undefined;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL in environment');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY in environment');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServiceRoleClient = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};


