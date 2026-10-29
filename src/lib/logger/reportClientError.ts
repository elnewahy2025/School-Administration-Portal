import { isDuplicateClientError } from "./isDuplicateClientError";
import { resolveClientErrorReference } from "./resolveClientErrorReference";
import { sendClientErrorReport } from "./sendClientErrorReport";

export type ClientErrorSource = "boundary" | "error" | "unhandledrejection";

/**
 * Mirrors a browser error to the server log, and returns its reference code.
 *
 * The code is stable for the error object (see `resolveClientErrorReference`),
 * so the boundary can render it while this function reports it once. Users who
 * quote `cli_…` or the digest can be matched to exactly one log line.
 */
export function reportClientError(error: unknown, source: ClientErrorSource): string {
  const correlationId = resolveClientErrorReference(error);
  const message = (error instanceof Error ? error.message : String(error ?? "")).slice(0, 2_000);

  if (!isDuplicateClientError(`${source}:${message}`)) {
    const payload = {
      message,
      correlationId,
      url: window.location.href.slice(0, 2_000),
      stack: error instanceof Error ? error.stack?.slice(0, 6_000) : undefined,
      source,
    };

    console.error("[client-error]", payload);
    sendClientErrorReport(payload);
  }

  return correlationId;
}
