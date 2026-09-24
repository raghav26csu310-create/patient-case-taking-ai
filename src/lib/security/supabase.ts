import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logging/logger";

/**
 * Architectural Supabase Integration Boundary
 * Prepared for future persistence layer. Does NOT execute unconfigured network calls.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) {
    return clientInstance;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    logger.debug(
      "SupabaseClient",
      "Supabase credentials not configured. System is operating in local/in-memory demo mode."
    );
    return null;
  }

  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    return clientInstance;
  } catch (error) {
    logger.error("SupabaseClient", "Failed to initialize Supabase client", { error });
    return null;
  }
}
