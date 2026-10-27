"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { RestoreConfirmHeader } from "./RestoreConfirmHeader";
import { RestoreMetadataSummary } from "./RestoreMetadataSummary";
import type { DatabaseBackupPayload } from "@/lib/backup";

export function RestoreConfirmDialog({
  isOpen,
  isRestoring,
  payload,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  isRestoring: boolean;
  payload: DatabaseBackupPayload | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("backup");

  if (!isOpen || !payload) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg animate-in rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl duration-200 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <RestoreConfirmHeader payload={payload} isRestoring={isRestoring} onClose={onClose} />

        <RestoreMetadataSummary payload={payload} />

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            disabled={isRestoring}
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={isRestoring}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow transition hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {isRestoring ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{t("restoring")}</span>
              </>
            ) : (
              <span>{t("restoreButton")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
