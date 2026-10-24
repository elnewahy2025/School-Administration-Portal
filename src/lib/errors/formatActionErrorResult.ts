import type { AppError } from "./AppError";
import { ValidationError } from "./ValidationError";

export type ActionErrorResult = {
  success: false;
  error: string;
  code: string;
  correlationId?: string;
  fieldErrors?: Record<string, string[]>;
};

export function formatActionErrorResult(error: AppError): ActionErrorResult {
  const fieldErrors = error instanceof ValidationError ? error.fieldErrors : undefined;

  return {
    success: false,
    error: error.message,
    code: error.code,
    correlationId: error.correlationId,
    fieldErrors,
  };
}
