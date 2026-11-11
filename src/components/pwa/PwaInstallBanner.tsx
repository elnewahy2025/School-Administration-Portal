"use client";

import { createPortal } from "react-dom";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDrawerEscape } from "@/components/layout/useDrawerEscape";
import { useIsMounted } from "@/components/layout/useIsMounted";
import { usePwaInstall } from "./usePwaInstall";
import { IosInstallDialog } from "./IosInstallDialog";
import { BrowserInstallDialog } from "./BrowserInstallDialog";

export function PwaInstallBanner() {
  const isMounted = useIsMounted();
  const {
    isInstallable,
    isIosGuideOpen,
    isBrowserGuideOpen,
    closeIosGuide,
    closeBrowserGuide,
    promptInstall,
    dismiss,
  } = usePwaInstall();
  const t = useTranslations("pwa");

  const isPromptOpen = isInstallable && !isIosGuideOpen && !isBrowserGuideOpen;

  useDrawerEscape(dismiss, isPromptOpen);

  if (!isMounted) return null;

  return createPortal(
    <>
      {isPromptOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
          className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-scrim/60 p-4 backdrop-blur-sm duration-200 fade-in"
          onClick={dismiss}
        >
          <div
            className="w-full max-w-sm animate-in rounded-3xl border border-border bg-card p-6 text-center text-card-foreground shadow-2xl duration-200 zoom-in-95 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Download className="h-8 w-8" />
            </div>

            <h2 id="pwa-install-title" className="mt-5 text-lg font-bold sm:text-xl">
              {t("bannerTitle")}
            </h2>
            <p id="pwa-install-desc" className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("bannerSubtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={promptInstall}
                className="w-full cursor-pointer touch-manipulation rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-95"
              >
                {t("installButton")}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="w-full cursor-pointer touch-manipulation rounded-xl py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {t("skipForNow")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <IosInstallDialog isOpen={isIosGuideOpen} onClose={closeIosGuide} />
      <BrowserInstallDialog isOpen={isBrowserGuideOpen} onClose={closeBrowserGuide} />
    </>,
    document.body,
  );
}
