"use client";

import { useTranslations } from "next-intl";
import { FileTextIcon } from "lucide-react";
import { UniversalDocumentViewer } from "@/components/documents/viewer/UniversalDocumentViewer";
import { getAttachmentKind } from "@/lib/circulars/getAttachmentKind";
import type { SchoolDocumentRow } from "@/lib/documents/types";

export function SchoolDocumentPreviewContent({
  currentDoc,
}: {
  currentDoc?: SchoolDocumentRow | null;
}) {
  const t = useTranslations("documents");
  const fileUrl = currentDoc?.file_url;

  if (!currentDoc || !fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <FileTextIcon className="size-6" />
        </div>
        <p className="text-sm font-semibold text-foreground">{t("noDocumentsPublic")}</p>
      </div>
    );
  }

  const kind = getAttachmentKind(currentDoc.file_name || currentDoc.title, currentDoc.mime_type);

  return (
    <div className="size-full h-[68vh] overflow-hidden rounded-lg border border-border/80 bg-background">
      <UniversalDocumentViewer url={fileUrl} fileName={currentDoc.title} kind={kind} />
    </div>
  );
}
