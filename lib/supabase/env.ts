export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the public Supabase env vars are set (the site falls back to seed data otherwise). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
