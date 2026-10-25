import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockResetPasswordForEmail } = vi.hoisted(() => ({
  mockResetPasswordForEmail: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: (key: string) => {
      if (key === "host") return "localhost:3000";
      return null;
    },
  }),
}));

vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  }),
}));

vi.mock("@/lib/errors/sanitizeError", () => ({
  sanitizeError: vi.fn(),
}));

import { requestPasswordResetAction } from "./requestPasswordResetAction";

describe("requestPasswordResetAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error on missing or invalid email format", async () => {
    const formData = new FormData();
    formData.append("email", "invalid-email");

    const result = await requestPasswordResetAction({ success: false }, formData);
    expect(result.success).toBe(false);
    expect(result.error).toBe("invalid");
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("calls resetPasswordForEmail with correct redirect URL on valid email", async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

    const formData = new FormData();
    formData.append("email", "teacher@school.edu.kw");

    const result = await requestPasswordResetAction({ success: false }, formData);
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("teacher@school.edu.kw", {
      redirectTo: "http://localhost:3000/api/auth/callback?next=/reset-password",
    });
  });

  it("handles Supabase auth error gracefully", async () => {
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: new Error("Rate limit exceeded") });

    const formData = new FormData();
    formData.append("email", "teacher@school.edu.kw");

    const result = await requestPasswordResetAction({ success: false }, formData);
    expect(result.success).toBe(false);
    expect(result.error).toBe("failed");
  });
});
