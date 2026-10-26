"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { useMessageBoxState } from "@/lib/feedback/useMessageBoxState";
import { confirmMessageBox } from "@/lib/feedback/confirmMessageBox";
import { cancelMessageBox } from "@/lib/feedback/cancelMessageBox";
import { getMessageBoxTheme } from "@/lib/feedback/getMessageBoxTheme";
import { MessageBoxIcon } from "./MessageBoxIcon";
import { MessageBoxActions } from "./MessageBoxActions";

export function AppMessageBox() {
  const state = useMessageBoxState();
  const t = useTranslations("common");
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (state.isOpen) {
      confirmBtnRef.current?.focus();
    }
  }, [state.isOpen]);

  if (!state.isOpen) return null;

  const theme = getMessageBoxTheme(state.type);
  const displayTitle = state.title || t(theme.defaultTitleKey);
  const confirmLabel = state.confirmText || t("confirm");
  const cancelLabel = state.cancelText || t("cancel");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === "Escape") cancelMessageBox();
      }}
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border bg-card p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 ${theme.borderClass}`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

        <button
          onClick={cancelMessageBox}
          className="absolute top-4 end-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close"
        >
          <XIcon className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 pt-1">
          <div className={`flex size-14 items-center justify-center rounded-2xl ${theme.badgeBgClass}`}>
            <MessageBoxIcon type={state.type} />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-foreground">
              {displayTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {state.message}
            </p>
          </div>

          <MessageBoxActions
            showCancel={state.showCancel}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            buttonClass={theme.buttonClass}
            confirmBtnRef={confirmBtnRef}
            onConfirm={confirmMessageBox}
            onCancel={cancelMessageBox}
          />
        </div>
      </div>
    </div>
  );
}
