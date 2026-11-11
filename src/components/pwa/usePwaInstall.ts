"use client";

import { useState, useEffect, useCallback } from "react";
import { getPwaInitialState } from "./getPwaInitialState";
import { pwaStorageKeys } from "./pwaStorageKeys";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePwaInstall() {
  const [initial] = useState(() => getPwaInitialState());
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(initial.isStandalone);
  const [isDismissed, setIsDismissed] = useState(initial.isDismissed);
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);
  const [isBrowserGuideOpen, setIsBrowserGuideOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      try {
        window.localStorage?.setItem(pwaStorageKeys.installed, "true");
      } catch {
        // Ignore storage errors
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const openIosGuide = useCallback(() => setIsIosGuideOpen(true), []);
  const closeIosGuide = useCallback(() => setIsIosGuideOpen(false), []);
  const openBrowserGuide = useCallback(() => setIsBrowserGuideOpen(true), []);
  const closeBrowserGuide = useCallback(() => setIsBrowserGuideOpen(false), []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsStandalone(true);
          window.localStorage?.setItem(pwaStorageKeys.installed, "true");
        }
      } catch {
        // Ignore userChoice errors
      }
      setDeferredPrompt(null);
      return;
    }

    if (initial.isIos) {
      setIsIosGuideOpen(true);
      return;
    }

    setIsBrowserGuideOpen(true);
  }, [deferredPrompt, initial.isIos]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      window.sessionStorage?.setItem(pwaStorageKeys.dismissedSession, "true");
    } catch {
      // Ignore storage errors
    }
  }, []);

  const isInstallable = !isStandalone && !isDismissed;

  return {
    isInstallable,
    isIos: initial.isIos,
    isStandalone,
    isIosGuideOpen,
    isBrowserGuideOpen,
    openIosGuide,
    closeIosGuide,
    openBrowserGuide,
    closeBrowserGuide,
    promptInstall,
    dismiss,
  };
}
