"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { restoreBackupAction } from "@/actions/backup";
import type { DatabaseBackupPayload } from "@/lib/backup";

export function useRestoreFile() {
  const router = useRouter();
  const [previewPayload, setPreviewPayload] = useState<DatabaseBackupPayload | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("backup");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as DatabaseBackupPayload;
        if (!parsed.metadata || !parsed.tables) {
          toast.error(t("invalidFile"));
          return;
        }
        setPreviewPayload(parsed);
        setIsDialogOpen(true);
      } catch {
        toast.error(t("invalidFile"));
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!previewPayload) return;
    try {
      setIsRestoring(true);
      const res = await restoreBackupAction(previewPayload);
      if (!res.success || !res.summary) {
        toast.error(res.error ?? t("restoreError"));
        return;
      }

      toast.success(
        t("restoreSuccess", {
          count: res.summary.totalRecords,
          tables: Object.keys(res.summary.tableCounts).length,
        }),
      );
      closeDialog();
      router.refresh();
    } catch {
      toast.error(t("restoreError"));
    } finally {
      setIsRestoring(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setPreviewPayload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    previewPayload,
    isDialogOpen,
    isRestoring,
    fileInputRef,
    handleFileChange,
    handleConfirmRestore,
    closeDialog,
  };
}
