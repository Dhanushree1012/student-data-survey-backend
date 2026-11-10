export const supabaseClient = {
  url: process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
};
