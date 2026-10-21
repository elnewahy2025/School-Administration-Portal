import { can } from "./can";

export function assertPermission(permissions: readonly string[], key: string): void {
  if (!can(permissions, key)) {
    throw new Error(`Permission denied: ${key}`);
  }
}
