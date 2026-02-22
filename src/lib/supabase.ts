import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Single shared Supabase client singleton.
// NEXT_PUBLIC_ vars are replaced with literal strings at build time by Next.js.

let _instance: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (!_instance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error("[Nexofi] Supabase env vars missing!", { url: !!url, key: !!key });
      throw new Error("Missing Supabase env vars — check Vercel environment variables");
    }

    console.log("[Nexofi] Creating Supabase client →", url.slice(0, 30) + "…");
    _instance = createClient<Database>(url, key, {
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
  }
  return _instance;
}
