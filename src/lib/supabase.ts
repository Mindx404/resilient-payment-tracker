import { createClient } from '@supabase/supabase-js';

// Используем .trim(), чтобы убрать случайные пробелы при копировании
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Логируем для отладки (в продакшене ключи не светятся, только проверка на наличие)
if (typeof window !== 'undefined') {
    if (!supabaseUrl) console.error('Supabase URL is missing!');
    if (!supabaseAnonKey) console.error('Supabase Anon Key is missing!');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
