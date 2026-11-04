import { afterEach, describe, expect, it, vi } from "vitest";
import { createBypassToken } from "@/lib/security/createBypassToken";

const { cookieValue } = vi.hoisted(() => ({
  cookieValue: { current: undefined as string | undefined },
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieValue.current === undefined ? undefined : { name, value: cookieValue.current },
  }),
}));

import { isUnderConstruction } from "./isUnderConstruction";

const BYPASS_SECRET = "test-bypass-secret";

describe("isUnderConstruction", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    cookieValue.current = undefined;
  });

  it("is off unless UNDER_CONSTRUCTION is 'true'", async () => {
    expect(await isUnderConstruction()).toBe(false);
  });

  it("serves the holding page when UNDER_CONSTRUCTION is 'true'", async () => {
    vi.stubEnv("UNDER_CONSTRUCTION", "true");

    expect(await isUnderConstruction()).toBe(true);
  });

  it("lets a valid bypass cookie through", async () => {
    vi.stubEnv("UNDER_CONSTRUCTION", "true");
    vi.stubEnv("UNDER_CONSTRUCTION_BYPASS_SECRET", BYPASS_SECRET);
    cookieValue.current = createBypassToken(BYPASS_SECRET);

    expect(await isUnderConstruction()).toBe(false);
  });

  it("keeps the holding page for an invalid bypass cookie", async () => {
    vi.stubEnv("UNDER_CONSTRUCTION", "true");
    vi.stubEnv("UNDER_CONSTRUCTION_BYPASS_SECRET", BYPASS_SECRET);
    cookieValue.current = "tampered.token.value";

    expect(await isUnderConstruction()).toBe(true);
  });
});
