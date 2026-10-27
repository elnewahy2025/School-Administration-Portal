"use client";

import { Download, X, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePwaInstall } from "./usePwaInstall";
import { IosInstallDialog } from "./IosInstallDialog";

export function PwaInstallBanner() {
  const {
    isInstallable,
    isIos,
    isIosGuideOpen,
    openIosGuide,
    closeIosGuide,
    promptInstall,
    dismiss,
  } = usePwaInstall();
  const t = useTranslations("pwa");

  if (!isInstallable) {
    return <IosInstallDialog isOpen={isIosGuideOpen} onClose={closeIosGuide} />;
  }

  return (
    <>
      <aside
        aria-label={t("bannerAriaLabel")}
        className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md animate-in duration-300 fade-in slide-in-from-bottom-4 sm:right-6 sm:left-auto"
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Download className="h-5 w-5" />
            </div>
            <div className="text-right ltr:text-left rtl:text-right">
              <h3 className="text-sm font-semibold text-zinc-100">{t("bannerTitle")}</h3>
              <p className="text-xs text-zinc-400">
                {isIos ? t("bannerSubtitleIos") : t("bannerSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isIos && (
              <button
                type="button"
                onClick={openIosGuide}
                title={t("howToInstallIos")}
                aria-label={t("howToInstallIos")}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={promptInstall}
              className="flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow transition hover:opacity-90 active:scale-95"
            >
              {isIos ? t("iosGuideButton") : t("installButton")}
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t("dismissAriaLabel")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <IosInstallDialog isOpen={isIosGuideOpen} onClose={closeIosGuide} />
    </>
  );
}
