import type { z } from "zod";
import { clientEnvSchema } from "./clientEnvSchema";
import { formatEnvIssues } from "./formatEnvIssues";

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function getClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Invalid public environment variables (check .env.local against .env.example). ${formatEnvIssues(parsed.error)}`,
    );
  }
  return parsed.data;
}
