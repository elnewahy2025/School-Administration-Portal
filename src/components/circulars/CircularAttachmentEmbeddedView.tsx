"use client";

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
  if (!publicUrl) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="h-[480px] w-full">
        <UniversalDocumentViewer
          url={publicUrl}
          fileName={fileName}
          kind={kind}
          onExpand={onExpand}
        />
      </div>
    </div>
  );
}
