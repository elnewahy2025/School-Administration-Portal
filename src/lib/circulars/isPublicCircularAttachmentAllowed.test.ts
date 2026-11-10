import { describe, it, expect, vi } from "vitest";
import { isPublicCircularAttachmentAllowed } from "./isPublicCircularAttachmentAllowed";
import type { SupabaseClient } from "@supabase/supabase-js";

describe("isPublicCircularAttachmentAllowed", () => {
  it("returns true when circular is published, public, and school is active", async () => {
    const mockAdmin = {
      from: vi.fn((table: string) => {
        if (table === "circulars") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { status: "published", visibility: "public" },
                  error: null,
                }),
              })),
            })),
          };
        }
        if (table === "schools") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { is_active: true },
                  error: null,
                }),
              })),
            })),
          };
        }
        return {};
      }),
    } as unknown as SupabaseClient;

    const allowed = await isPublicCircularAttachmentAllowed(mockAdmin, "c-1", "school-1");
    expect(allowed).toBe(true);
  });

  it("returns false when circular is internal", async () => {
    const mockAdmin = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { status: "published", visibility: "internal" },
              error: null,
            }),
          })),
        })),
      })),
    } as unknown as SupabaseClient;

    const allowed = await isPublicCircularAttachmentAllowed(mockAdmin, "c-1", "school-1");
    expect(allowed).toBe(false);
  });

  it("returns false when school is inactive", async () => {
    const mockAdmin = {
      from: vi.fn((table: string) => {
        if (table === "circulars") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: { status: "published", visibility: "public" },
                  error: null,
                }),
              })),
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { is_active: false },
                error: null,
              }),
            })),
          })),
        };
      }),
    } as unknown as SupabaseClient;

    const allowed = await isPublicCircularAttachmentAllowed(mockAdmin, "c-1", "school-1");
    expect(allowed).toBe(false);
  });
});
