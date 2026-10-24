import { isAppError } from "../errors/isAppError";
import { redactSensitiveData } from "./redactSensitiveData";

export function buildErrorLogPayload(
  error: unknown,
  context?: Record<string, unknown>,
  correlationId?: string,
) {
  const resolvedCorrelationId =
    correlationId || (isAppError(error) ? error.correlationId : undefined) || `err_${Date.now()}`;

  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const code = isAppError(error) ? error.code : "INTERNAL_ERROR";
  const statusCode = isAppError(error) ? error.statusCode : 500;

  return {
    timestamp: new Date().toISOString(),
    level: statusCode >= 500 ? "ERROR" : "WARN",
    correlationId: resolvedCorrelationId,
    code,
    statusCode,
    message,
    context: context ? redactSensitiveData(context) : undefined,
    stack,
  };
}
