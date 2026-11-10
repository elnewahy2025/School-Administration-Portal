import { ValidationError } from "@/lib/errors/ValidationError";
import type { UpdateMaintenanceRequestInput } from "@/actions/maintenance/updateMaintenanceRequestAction";

export function validateUpdateMaintenanceInput(input: UpdateMaintenanceRequestInput): {
  title: string;
  description: string;
} {
  const title = input.title?.trim() ?? "";
  const description = input.description?.trim() ?? "";

  if (title.length < 2) {
    throw new ValidationError("Title must be at least 2 characters long");
  }
  if (description.length < 2) {
    throw new ValidationError("Description must be at least 2 characters long");
  }

  return { title, description };
}
