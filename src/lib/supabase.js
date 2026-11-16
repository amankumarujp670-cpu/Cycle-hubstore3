import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("CYCLE HUB Supabase configuration is missing.");
}

export const supabase = createClient(url || "https://example.supabase.co", key || "missing-publishable-key", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
