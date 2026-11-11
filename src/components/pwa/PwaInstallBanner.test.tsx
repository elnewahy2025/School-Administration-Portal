import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { PwaInstallBanner } from "./PwaInstallBanner";
import * as usePwaInstallModule from "./usePwaInstall";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PwaInstallBanner", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders install dialog in center of screen when installable", () => {
    vi.spyOn(usePwaInstallModule, "usePwaInstall").mockReturnValue({
      isInstallable: true,
      isIos: false,
      isStandalone: false,
      isIosGuideOpen: false,
      isBrowserGuideOpen: false,
      openIosGuide: vi.fn(),
      closeIosGuide: vi.fn(),
      openBrowserGuide: vi.fn(),
      closeBrowserGuide: vi.fn(),
      promptInstall: vi.fn(),
      dismiss: vi.fn(),
    });

    render(<PwaInstallBanner />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("bannerTitle")).toBeInTheDocument();
    expect(screen.getByText("bannerSubtitle")).toBeInTheDocument();
    expect(screen.getByText("installButton")).toBeInTheDocument();
    expect(screen.getByText("skipForNow")).toBeInTheDocument();
  });

  it("triggers promptInstall when install button is clicked", () => {
    const promptInstall = vi.fn();
    vi.spyOn(usePwaInstallModule, "usePwaInstall").mockReturnValue({
      isInstallable: true,
      isIos: false,
      isStandalone: false,
      isIosGuideOpen: false,
      isBrowserGuideOpen: false,
      openIosGuide: vi.fn(),
      closeIosGuide: vi.fn(),
      openBrowserGuide: vi.fn(),
      closeBrowserGuide: vi.fn(),
      promptInstall,
      dismiss: vi.fn(),
    });

    render(<PwaInstallBanner />);

    const installBtn = screen.getByText("installButton");
    fireEvent.click(installBtn);
    expect(promptInstall).toHaveBeenCalled();
  });

  it("triggers dismiss when skip button is clicked", () => {
    const dismiss = vi.fn();
    vi.spyOn(usePwaInstallModule, "usePwaInstall").mockReturnValue({
      isInstallable: true,
      isIos: false,
      isStandalone: false,
      isIosGuideOpen: false,
      isBrowserGuideOpen: false,
      openIosGuide: vi.fn(),
      closeIosGuide: vi.fn(),
      openBrowserGuide: vi.fn(),
      closeBrowserGuide: vi.fn(),
      promptInstall: vi.fn(),
      dismiss,
    });

    render(<PwaInstallBanner />);

    const skipBtn = screen.getByText("skipForNow");
    fireEvent.click(skipBtn);
    expect(dismiss).toHaveBeenCalled();
  });

  it("does not render when not installable", () => {
    vi.spyOn(usePwaInstallModule, "usePwaInstall").mockReturnValue({
      isInstallable: false,
      isIos: false,
      isStandalone: true,
      isIosGuideOpen: false,
      isBrowserGuideOpen: false,
      openIosGuide: vi.fn(),
      closeIosGuide: vi.fn(),
      openBrowserGuide: vi.fn(),
      closeBrowserGuide: vi.fn(),
      promptInstall: vi.fn(),
      dismiss: vi.fn(),
    });

    const { container } = render(<PwaInstallBanner />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
