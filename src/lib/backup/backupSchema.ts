import { z } from "zod";

export const backupSchema = z.object({
  metadata: z.object({
    version: z.number().int().min(1),
    exportedAt: z.string(),
    exportedBy: z.string(),
    scope: z.enum(["platform", "school"]),
    schoolId: z.string().nullable(),
    schoolName: z.string().nullable().optional(),
  }),
  tables: z.object({
    schools: z.array(z.record(z.string(), z.unknown())).optional(),
    school_settings: z.array(z.record(z.string(), z.unknown())).optional(),
    departments: z.array(z.record(z.string(), z.unknown())).optional(),
    locations: z.array(z.record(z.string(), z.unknown())).optional(),
    roles: z.array(z.record(z.string(), z.unknown())).optional(),
    role_permissions: z.array(z.record(z.string(), z.unknown())).optional(),
    profiles: z.array(z.record(z.string(), z.unknown())).optional(),
    user_role_assignments: z.array(z.record(z.string(), z.unknown())).optional(),
    school_sequences: z.array(z.record(z.string(), z.unknown())).optional(),
    circulars: z.array(z.record(z.string(), z.unknown())).optional(),
    circular_targets: z.array(z.record(z.string(), z.unknown())).optional(),
    circular_responses: z.array(z.record(z.string(), z.unknown())).optional(),
    maintenance_requests: z.array(z.record(z.string(), z.unknown())).optional(),
    maintenance_assignments: z.array(z.record(z.string(), z.unknown())).optional(),
    maintenance_updates: z.array(z.record(z.string(), z.unknown())).optional(),
    calendar_events: z.array(z.record(z.string(), z.unknown())).optional(),
    school_achievements: z.array(z.record(z.string(), z.unknown())).optional(),
  }),
});
