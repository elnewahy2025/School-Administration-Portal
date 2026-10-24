import { AppError } from "./AppError";
import { ConflictError } from "./ConflictError";
import { NotFoundError } from "./NotFoundError";
import { ValidationError } from "./ValidationError";
import { ForbiddenError } from "./ForbiddenError";
import { DatabaseError } from "./DatabaseError";

type DbErrorLike = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export function mapDatabaseError(error: unknown, correlationId?: string): AppError {
  if (error instanceof AppError) return error;

  const dbErr = error as DbErrorLike;
  const code = dbErr?.code;

  if (code === "23505") {
    return new ConflictError("A record with this identifier already exists", correlationId);
  }
  if (code === "23503") {
    return new NotFoundError("A referenced record does not exist", correlationId);
  }
  if (code === "23502") {
    return new ValidationError("Required field missing", undefined, correlationId);
  }
  if (code === "42501") {
    return new ForbiddenError("Insufficient permissions to complete operation", correlationId);
  }
  if (code === "PGRST116") {
    return new NotFoundError("Requested record not found", correlationId);
  }

  return new DatabaseError("Database operation failed", correlationId, error);
}
