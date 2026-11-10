"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { createCircularAction } from "@/actions/circulars/createCircularAction";
import { circularDocumentRules } from "@/lib/circulars/circularDocumentRules";
import { validateClientFile } from "@/lib/storage/validateClientFile";
import { uploadCircularAttachmentsClient } from "@/lib/circulars/uploadCircularAttachmentsClient";

export function useCreateCircularForm() {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (formData: FormData) => {
    formData.delete("documents");

    for (const file of files) {
      const validation = validateClientFile(file, {
        allowedMimes: circularDocumentRules.allowedMime,
        maxBytes: circularDocumentRules.maxBytes,
      });
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        return;
      }
    }

    startTransition(async () => {
      const res = await createCircularAction(formData);
      if (!res.success || !res.circularId || !res.schoolId) {
        toast.error(res.error ?? "Failed to create circular");
        return;
      }

      if (files.length > 0) {
        setIsUploading(true);
        const uploadResult = await uploadCircularAttachmentsClient({
          files,
          circularId: res.circularId,
          schoolId: res.schoolId,
        });
        setIsUploading(false);

        if (!uploadResult.success) {
          toast.error(uploadResult.error ?? "Failed to upload attachments");
          router.push(`/circulars/${res.circularId}`);
          return;
        }
      }

      toast.success(tCommon("saved"));
      router.push(`/circulars/${res.circularId}`);
    });
  };

  return {
    isBusy: isPending || isUploading,
    files,
    setFiles,
    handleSubmit,
  };
}
