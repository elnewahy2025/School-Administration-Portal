"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { UploadCloudIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { circularDocumentRules } from "@/lib/circulars/circularDocumentRules";
import { validateClientFile } from "@/lib/storage/validateClientFile";
import { CircularSelectedFilesList } from "./CircularSelectedFilesList";

export interface CircularFileUploadProps {
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx",
  "application/pdf,image/jpeg,image/png,image/webp,application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
].join(",");

export function CircularFileUpload({
  files: controlledFiles,
  onFilesChange,
  disabled = false,
}: CircularFileUploadProps = {}) {
  const t = useTranslations("circulars");
  const [internalFiles, setInternalFiles] = useState<File[]>([]);

  const isControlled = Boolean(onFilesChange && controlledFiles !== undefined);
  const selectedFiles = isControlled ? (controlledFiles ?? []) : internalFiles;

  const updateFiles = (nextFiles: File[]) => {
    if (isControlled && onFilesChange) {
      onFilesChange(nextFiles);
    } else {
      setInternalFiles(nextFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;
    const inputFiles = Array.from(e.target.files);
    const validFiles: File[] = [];

    for (const file of inputFiles) {
      const isDuplicate = selectedFiles.some(
        (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified,
      );
      if (isDuplicate) continue;

      const validation = validateClientFile(file, {
        allowedMimes: circularDocumentRules.allowedMime,
        maxBytes: circularDocumentRules.maxBytes,
      });

      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      updateFiles([...selectedFiles, ...validFiles]);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="circular-file-picker">{t("uploadDocuments")}</Label>
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center transition-colors ${
          disabled ? "opacity-60 cursor-not-allowed" : "hover:border-primary/50"
        }`}
      >
        <UploadCloudIcon className="mb-2 size-8 text-muted-foreground" />
        <label
          htmlFor="circular-file-picker"
          className={`text-sm font-medium text-primary hover:underline ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {t("chooseFiles")}
          <input
            id="circular-file-picker"
            type="file"
            multiple
            disabled={disabled}
            className="sr-only"
            accept={ACCEPTED_TYPES}
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-1 text-xs text-muted-foreground">{t("uploadHint")}</p>
      </div>

      <CircularSelectedFilesList
        files={selectedFiles}
        disabled={disabled}
        onRemove={(idx) => updateFiles(selectedFiles.filter((_, i) => i !== idx))}
      />
    </div>
  );
}
