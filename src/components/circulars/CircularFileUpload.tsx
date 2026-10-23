"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UploadCloudIcon, FileTextIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

export function CircularFileUpload() {
  const t = useTranslations("circulars");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="documents">{t("uploadDocuments")}</Label>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center transition-colors hover:border-primary/50">
        <UploadCloudIcon className="mb-2 size-8 text-muted-foreground" />
        <label
          htmlFor="documents"
          className="cursor-pointer text-sm font-medium text-primary hover:underline"
        >
          {t("chooseFiles")}
          <input
            id="documents"
            name="documents"
            type="file"
            multiple
            className="sr-only"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-1 text-xs text-muted-foreground">{t("uploadHint")}</p>
      </div>

      {selectedFiles.length > 0 ? (
        <div className="flex flex-col gap-2 pt-1">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
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
                onClick={() => removeFile(idx)}
                className="p-1 text-muted-foreground hover:text-destructive"
                aria-label={t("delete")}
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
