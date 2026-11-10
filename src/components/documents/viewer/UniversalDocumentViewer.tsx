"use client";

import { WordDocumentViewer } from "./WordDocumentViewer";
import { ExcelDocumentViewer } from "./ExcelDocumentViewer";
import { PdfDocumentViewer } from "./PdfDocumentViewer";
import { ImageDocumentViewer } from "./ImageDocumentViewer";
import { GenericDocumentFallback } from "./GenericDocumentFallback";
import type { AttachmentKind } from "@/lib/circulars/getAttachmentKind";

export interface UniversalDocumentViewerProps {
  url: string;
  fileName: string;
  kind: AttachmentKind;
  className?: string;
  onExpand?: () => void;
}

export function UniversalDocumentViewer({
  url,
  fileName,
  kind,
  className = "",
  onExpand,
}: UniversalDocumentViewerProps) {
  if (kind === "image") {
    return <ImageDocumentViewer url={url} fileName={fileName} className={className} />;
  }

  if (kind === "word") {
    return <WordDocumentViewer url={url} fileName={fileName} className={className} />;
  }

  if (kind === "excel") {
    return <ExcelDocumentViewer url={url} fileName={fileName} className={className} />;
  }

  if (kind === "pdf") {
    return (
      <PdfDocumentViewer url={url} fileName={fileName} className={className} onExpand={onExpand} />
    );
  }

  return <GenericDocumentFallback url={url} fileName={fileName} className={className} />;
}
