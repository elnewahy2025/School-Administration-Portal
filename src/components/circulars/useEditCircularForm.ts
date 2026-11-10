"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n";
import { toast } from "sonner";
import { updateCircularAction } from "@/actions/circulars/updateCircularAction";
import { circularDocumentRules } from "@/lib/circulars/circularDocumentRules";
import { validateClientFile } from "@/lib/storage/validateClientFile";
import { uploadCircularAttachmentsClient } from "@/lib/circulars/uploadCircularAttachmentsClient";
import type { CircularDetail } from "@/lib/circulars/getCircularById";

export function useEditCircularForm(circular: CircularDetail) {
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
      const res = await updateCircularAction(circular.id, formData);
      if (!res.success) {
        toast.error(res.error ?? "Failed to update circular");
        return;
      }

      if (files.length > 0) {
        setIsUploading(true);
        const uploadResult = await uploadCircularAttachmentsClient({
          files,
          circularId: circular.id,
          schoolId: circular.school_id,
        });
        setIsUploading(false);

        if (!uploadResult.success) {
          toast.error(uploadResult.error ?? "Failed to upload attachments");
          router.push(`/circulars/${circular.id}`);
          router.refresh();
          return;
        }
      }

      toast.success(tCommon("saved"));
      router.push(`/circulars/${circular.id}`);
      router.refresh();
    });
  };

  return {
    isBusy: isPending || isUploading,
    files,
    setFiles,
    handleSubmit,
    router,
  };
}
