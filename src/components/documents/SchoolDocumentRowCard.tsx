"use client";

import { FileTextIcon, ImageIcon } from "lucide-react";
import { SchoolDocumentRowActions } from "./SchoolDocumentRowActions";
import type { SchoolDocumentRow } from "@/lib/documents/types";

export function SchoolDocumentRowCard({
  document,
  onPreview,
  onEdit,
  onDelete,
}: {
  document: SchoolDocumentRow;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isImage = document.mime_type.startsWith("image/");
  const formattedSize =
    document.file_size > 1024 * 1024
      ? `${(document.file_size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(document.file_size / 1024)} KB`;

  const dateStr = new Date(document.created_at).toLocaleDateString();

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          {isImage ? <ImageIcon className="size-5" /> : <FileTextIcon className="size-5" />}
        </div>

        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="max-w-sm truncate text-sm font-bold text-foreground sm:max-w-md sm:text-base">
              {document.title}
            </h3>
            <span className="rounded border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
              {isImage ? "IMG" : "PDF"}
            </span>
          </div>

          {document.description ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">{document.description}</p>
          ) : null}

          <div className="flex items-center gap-3 pt-0.5 text-[11px] text-muted-foreground/80">
            <span>{document.file_name}</span>
            <span>•</span>
            <span>{formattedSize}</span>
            <span>•</span>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>

      <SchoolDocumentRowActions
        fileUrl={document.file_url}
        onPreview={onPreview}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
