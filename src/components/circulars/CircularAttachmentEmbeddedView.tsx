"use client";

import { useTranslations } from "next-intl";
import { ZoomInIcon } from "lucide-react";
import { UniversalDocumentViewer } from "@/components/documents/viewer/UniversalDocumentViewer";
import type { AttachmentKind } from "@/lib/circulars/getAttachmentKind";

export function CircularAttachmentEmbeddedView({
  publicUrl,
  fileName,
  kind,
  onExpand,
}: {
  publicUrl?: string;
  fileName: string;
  kind: AttachmentKind;
  onExpand: () => void;
}) {
  const t = useTranslations("circulars");
  if (!publicUrl) return null;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-background">
      <div className="h-[480px] w-full">
        <UniversalDocumentViewer url={publicUrl} fileName={fileName} kind={kind} />
      </div>
      <button
        type="button"
        onClick={onExpand}
        className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-md border border-border bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur-xs transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ZoomInIcon className="size-3.5" />
        <span>{t("expandAttachment")}</span>
      </button>
    </div>
  );
}
