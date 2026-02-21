import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let client: SupabaseClient | null = null;

/**
 * Single Supabase browser client. Reusing one instance avoids multiple tabs/clients
 * contending for the Navigator LockManager auth-token lock (which can timeout after 10s).
 */
export function createClient(): SupabaseClient {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  client = createSupabaseClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder"
  );
  return client;
}
