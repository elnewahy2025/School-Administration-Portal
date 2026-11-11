import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePwaInstall } from "./usePwaInstall";

describe("usePwaInstall", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("is installable by default when not standalone and not dismissed", () => {
    const { result } = renderHook(() => usePwaInstall());
    expect(result.current.isInstallable).toBe(true);
  });

  it("handles dismissal correctly and persists to sessionStorage", () => {
    const { result } = renderHook(() => usePwaInstall());

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.isInstallable).toBe(false);
    expect(sessionStorage.getItem("pwa_install_dismissed_session")).toBe("true");
  });

  it("toggles iOS guide modal state", () => {
    const { result } = renderHook(() => usePwaInstall());

    expect(result.current.isIosGuideOpen).toBe(false);

    act(() => {
      result.current.openIosGuide();
    });
    expect(result.current.isIosGuideOpen).toBe(true);

    act(() => {
      result.current.closeIosGuide();
    });
    expect(result.current.isIosGuideOpen).toBe(false);
  });

  it("opens iOS guide when promptInstall is called on iOS device", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)",
        platform: "iPhone",
        maxTouchPoints: 5,
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => usePwaInstall());

    expect(result.current.isIos).toBe(true);

    act(() => {
      result.current.promptInstall();
    });

    expect(result.current.isIosGuideOpen).toBe(true);
  });

  it("opens browser guide when promptInstall is called on non-iOS device without deferredPrompt", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        platform: "Win32",
        maxTouchPoints: 0,
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => usePwaInstall());

    expect(result.current.isIos).toBe(false);
    expect(result.current.isBrowserGuideOpen).toBe(false);

    act(() => {
      result.current.promptInstall();
    });

    expect(result.current.isBrowserGuideOpen).toBe(true);
  });

  it("marks installed when appinstalled event fires", () => {
    const { result } = renderHook(() => usePwaInstall());

    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });

    expect(result.current.isStandalone).toBe(true);
    expect(result.current.isInstallable).toBe(false);
    expect(localStorage.getItem("pwa_installed")).toBe("true");
  });
});
