import { sanitizeError } from "./sanitizeError";
import { formatActionErrorResult, type ActionErrorResult } from "./formatActionErrorResult";

export type ServerAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult | ActionErrorResult>;

export function withActionErrorHandler<TArgs extends unknown[], TResult>(
  actionName: string,
  action: (...args: TArgs) => Promise<TResult>,
): ServerAction<TArgs, TResult> {
  return async (...args: TArgs): Promise<TResult | ActionErrorResult> => {
    try {
      const result = await action(...args);
      return result;
    } catch (err: unknown) {
      const sanitized = sanitizeError(err, {
        action: actionName,
      });
      return formatActionErrorResult(sanitized);
    }
  };
}
