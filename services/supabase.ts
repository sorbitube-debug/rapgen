import { createClient } from '@supabase/supabase-js';

// خواندن از .env.local (مقادیر در vite.config از env لود و در بیلد جایگزین می‌شوند)
const supabaseUrl: string = (process.env.SUPABASE_URL as string) || '';
const supabaseAnonKey: string = (process.env.SUPABASE_KEY as string) || '';

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  supabaseUrl !== 'https://YOUR_PROJECT_ID.supabase.co' &&
  supabaseAnonKey !== 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
