
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Credentials provided by the user
// Fix: Explicitly type as string to prevent TypeScript from using literal types which causes errors in comparison logic.
const supabaseUrl: string = 'https://sucwedodpggljuhxksxj.supabase.co';
// Fix: Explicitly type as string to prevent TypeScript from using literal types which causes errors in comparison logic.
const supabaseAnonKey: string = 'sb_publishable_ywEszOqaL_kefiKTB3fmPQ_AEPLSfyK';

// Check if credentials are still the placeholders (safety check)
export const isSupabaseConfigured = 
  supabaseUrl !== 'https://YOUR_PROJECT_ID.supabase.co' && 
  supabaseAnonKey !== 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
