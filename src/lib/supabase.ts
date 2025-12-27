import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase URL is missing. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
}

