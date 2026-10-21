import { z } from "zod";

// Server runtime also sees the NEXT_PUBLIC_ variables (they are inlined at
// build time), so the admin client can read the project URL from here.
export const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  APP_URL: z.string().min(1),
  SCHOOL_TIMEZONE: z.string().min(1),
});
