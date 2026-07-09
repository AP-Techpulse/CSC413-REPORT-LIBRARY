import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes("YOUR-PROJECT-REF")
);

// If the env vars have not been filled in yet, we still export a client
// object so the app does not crash on import. Every call will simply
// fail gracefully and the UI shows a "not configured yet" state instead.
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : createClient("https://placeholder.supabase.co", "placeholder-key");

export const REPORTS_BUCKET = "reports";
