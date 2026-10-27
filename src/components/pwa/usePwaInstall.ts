"use client";

import { useState, useEffect, useCallback } from "react";
import { detectIosDevice } from "./detectIosDevice";
import { isStandaloneMode } from "./isStandaloneMode";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [isIos] = useState(() => detectIosDevice());
  const [isStandalone] = useState(() => isStandaloneMode());
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("pwa_install_dismissed") === "true";
  });

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setHasPrompt(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setHasPrompt(false);
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

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setHasPrompt(false);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIos) {
      setIsIosGuideOpen(true);
    }
  }, [deferredPrompt, isIos]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  }, []);

  const isInstallable = (hasPrompt || isIos) && !isStandalone && !isDismissed;

  return {
    isInstallable,
    isIos,
    isStandalone,
    isIosGuideOpen,
    openIosGuide,
    closeIosGuide,
    promptInstall,
    dismiss,
  };
}
