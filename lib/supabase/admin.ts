import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client
 * This client uses the service_role_key which bypasses all RLS.
 * MUST ONLY BE USED IN SERVER-SIDE ENVIRONMENTS (Server Actions, API Routes).
 * NEVER expose this to the client.
 */
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
