"use client";

import { useTranslations } from "next-intl";
import { FileTextIcon, XIcon } from "lucide-react";

export interface CircularSelectedFilesListProps {
  files: File[];
  disabled?: boolean;
  onRemove: (index: number) => void;
}

export function CircularSelectedFilesList({
  files,
  disabled = false,
  onRemove,
}: CircularSelectedFilesListProps) {
  const t = useTranslations("circulars");

  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pt-1">
      {files.map((file, idx) => (
        <div
          key={`${file.name}-${file.lastModified}-${idx}`}
          className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <FileTextIcon className="size-4 shrink-0 text-primary" />
            <span className="truncate font-medium text-foreground">{file.name}</span>
            <span className="shrink-0 font-mono text-muted-foreground" dir="ltr">
              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            disabled={disabled}
            className="p-1 text-muted-foreground hover:text-destructive disabled:opacity-40"
            aria-label={t("delete")}
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
