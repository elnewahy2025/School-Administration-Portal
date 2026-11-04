import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { unregisterServiceWorkers } = vi.hoisted(() => ({
  unregisterServiceWorkers: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/lib/pwa/unregisterServiceWorkers", () => ({
  unregisterServiceWorkers,
}));

import { ServiceWorkerRegister } from "./ServiceWorkerRegister";

function stubServiceWorker(register: (url: string) => Promise<{ scope: string }>) {
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { register, getRegistrations: () => Promise.resolve([]) },
  });
}

describe("ServiceWorkerRegister", () => {
  afterEach(() => {
    cleanup();
    unregisterServiceWorkers.mockClear();
    vi.unstubAllEnvs();
    delete (document as unknown as Record<string, unknown>).readyState;
  });

  it("removes stale service workers instead of registering one outside production", async () => {
    const register = vi.fn(() => Promise.resolve({ scope: "/" }));
    stubServiceWorker(register);

    render(<ServiceWorkerRegister />);

    await waitFor(() => {
      expect(unregisterServiceWorkers).toHaveBeenCalledTimes(1);
    });
    expect(register).not.toHaveBeenCalled();
  });

  it("registers immediately when the page has already finished loading", async () => {
    vi.stubEnv("NODE_ENV", "production");
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete",
    });
    const register = vi.fn(() => Promise.resolve({ scope: "/" }));
    stubServiceWorker(register);

    render(<ServiceWorkerRegister />);

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("/sw.js");
    });
  });
});
