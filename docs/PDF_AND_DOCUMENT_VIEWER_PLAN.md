# Production Guide: PDF & Multi-Format Document Viewing Architecture

This guide details the exact architecture, components, and HTTP security headers used in this application to render **PDFs, Word documents (DOCX), Excel spreadsheets (XLSX), and Images** cleanly, securely, and responsively across desktop and mobile devices without heavy bundle bloat.

---

## Table of Contents

1. [Core Design Philosophy: Why Native PDF Viewer Over Third-Party Bundles](#1-core-design-philosophy)
2. [Component Architecture (`PdfDocumentViewer.tsx`)](#2-component-architecture)
3. [The Critical HTTP Headers (Why Most PDF Viewers Fail)](#3-the-critical-http-headers)
4. [Universal Document Viewer Matrix (PDF, DOCX, XLSX, Image)](#4-universal-document-viewer-matrix)
5. [Cloudinary-Specific PDF Delivery Strategies](#5-cloudinary-specific-pdf-delivery-strategies)
6. [Mobile / iOS Safari Compatibility & Fallbacks](#6-mobile--ios-safari-compatibility--fallbacks)
7. [Step-by-Step Implementation Guide for the New App](#7-step-by-step-implementation-guide)

---

## 1. Core Design Philosophy

Many developers immediately install heavy client packages like `react-pdf` or `pdfjs-dist`. In production web applications, this frequently causes:

- **Massive bundle bloat:** `pdf.js` worker adds 2MB–4MB to frontend bundles.
- **Worker & CORS errors:** Next.js bundlers (Turbopack/Webpack) frequently struggle with PDF.js web workers and canvas rendering fonts.
- **Poor mobile performance:** Rendering multi-page PDFs to HTML5 canvases consumes huge memory and causes mobile browser tabs to crash.

### The Modern Production Solution: Native Browser Engine

Every modern browser (Chrome, Edge, Safari, Firefox, Opera, Brave) ships with an optimized, hardware-accelerated C++ / Rust PDF rendering engine (PDFium / Mozilla PDF.js).
By embedding the PDF in an optimized `<iframe src={`${url}#toolbar=1&navpanes=0`} />` with the correct **`Content-Disposition: inline`** headers:

- Rendering is instant and hardware-accelerated.
- Bundle size overhead is **0 KB**.
- Users get native pinch-to-zoom, search (`Ctrl+F`), text selection, and native printing out of the box.

---

## 2. Component Architecture (`PdfDocumentViewer.tsx`)

The viewer pairs an iframe with a responsive toolbar providing **Fullscreen / Dialog Expand**, **Open in New Tab**, and **Direct Download** controls, plus an automatic failure fallback.

```tsx
// src/components/documents/viewer/PdfDocumentViewer.tsx
"use client";

import { useState } from "react";
import { ExternalLinkIcon, DownloadIcon, Maximize2Icon } from "lucide-react";

export interface PdfDocumentViewerProps {
  url: string;
  fileName: string;
  className?: string;
  onExpand?: () => void;
}

export function PdfDocumentViewer({
  url,
  fileName,
  className = "",
  onExpand,
}: PdfDocumentViewerProps) {
  const [loadFailed, setLoadFailed] = useState(false);

  // #toolbar=1 displays standard browser zoom/print/page controls
  // &navpanes=0 collapses the left thumbnail sidebar for clean presentation
  const iframeSrc = `${url}#toolbar=1&navpanes=0`;

  return (
    <div
      className={`relative flex size-full flex-col overflow-hidden rounded-lg border bg-background ${className}`}
    >
      {/* 1. Header Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/40 px-3 py-2 text-xs">
        <span className="truncate font-medium text-foreground">{fileName}</span>
        <div className="flex items-center gap-1.5">
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              title="Expand / Fullscreen"
              className="rounded p-1 hover:bg-muted"
            >
              <Maximize2Icon className="size-4" />
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new window"
            className="rounded p-1 hover:bg-muted"
          >
            <ExternalLinkIcon className="size-4" />
          </a>
          <a
            href={url}
            download={fileName}
            title="Download PDF"
            className="rounded p-1 hover:bg-muted"
          >
            <DownloadIcon className="size-4" />
          </a>
        </div>
      </div>

      {/* 2. Native PDF Iframe */}
      <div className="relative flex-1">
        <iframe
          src={iframeSrc}
          title={fileName}
          onError={() => setLoadFailed(true)}
          className="size-full border-0 bg-background"
        />

        {/* 3. Automatic Error / Unsupported Device Fallback */}
        {loadFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center">
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              Unable to display PDF inline on this device.
            </p>
            <div className="flex items-center gap-2">
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Open in Browser
              </a>
              <a href={url} download={fileName} className="btn btn-primary">
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 3. The Critical HTTP Headers

90% of PDF preview issues occur because the backend API or storage server sends incorrect HTTP headers.

### Required Header Configuration

When serving PDFs through an authenticated Next.js Route Handler (`/api/documents/[id]/preview`):

```typescript
return new Response(fileBuffer, {
  headers: {
    // 1. MUST be inline: 'attachment' forces download and breaks iframes
    "Content-Disposition": 'inline; filename="document.pdf"',

    // 2. Exact MIME type: 'application/octet-stream' prevents native preview
    "Content-Type": "application/pdf",

    // 3. Security: Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // 4. Frame permissions: Allow embedding within your application
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": "frame-ancestors 'self';",

    // 5. Cache control for private documents
    "Cache-Control": "private, no-store",
  },
});
```

---

## 4. Universal Document Viewer Matrix

In modern business applications, users upload more than just PDFs. Pair `PdfDocumentViewer` with a universal switcher (`UniversalDocumentViewer.tsx`):

```tsx
// src/components/documents/viewer/UniversalDocumentViewer.tsx
export function UniversalDocumentViewer({ url, fileName, mimeType, onExpand }) {
  // 1. Images (JPG, PNG, WebP, SVG) -> Native <img> with pan/zoom
  if (mimeType.startsWith("image/")) {
    return <ImageDocumentViewer url={url} fileName={fileName} />;
  }

  // 2. PDFs -> Native Browser PDF Engine via Iframe
  if (mimeType === "application/pdf") {
    return <PdfDocumentViewer url={url} fileName={fileName} onExpand={onExpand} />;
  }

  // 3. Word (.docx) -> docx-preview client library
  if (mimeType.includes("word") || fileName.endsWith(".docx")) {
    return <WordDocumentViewer url={url} fileName={fileName} />;
  }

  // 4. Excel (.xlsx) -> SheetJS (xlsx) client library
  if (mimeType.includes("sheet") || fileName.endsWith(".xlsx")) {
    return <ExcelDocumentViewer url={url} fileName={fileName} />;
  }

  // 5. Fallback for binary / unsupported files
  return <GenericDocumentFallback url={url} fileName={fileName} />;
}
```

### Dependencies Used

- **PDFs:** 0 external libraries (Native browser PDFium via iframe).
- **Word (.docx):** `npm install docx-preview` (renders DOCX into formatted HTML DOM elements client-side).
- **Excel (.xlsx):** `npm install xlsx` (SheetJS renders workbook sheets into interactive HTML tables).
- **Icons:** `npm install lucide-react`.

---

## 5. Cloudinary-Specific PDF Delivery Strategies

Because your new web application uses **Cloudinary**, take advantage of Cloudinary's specialized PDF capabilities:

### Strategy A: Direct Inline PDF Delivery

By default, Cloudinary delivers `raw` files as downloads. To force inline PDF viewing:

1. Deliver with resource type `image` or `raw` with the `fl_inline` flag:
   ```
   https://res.cloudinary.com/<cloud_name>/image/upload/fl_inline/v12345/tenants/school_1/document.pdf
   ```
2. Or in Cloudinary settings, set **PDF and ZIP files delivery** to `inline` rather than `attachment`.

### Strategy B: Instant First-Page Image Thumbnail

Cloudinary can automatically rasterize page 1 of any PDF into an optimized JPEG image without running any server code:

```
https://res.cloudinary.com/<cloud_name>/image/upload/w_600,h_800,c_fill,pg_1/v12345/tenants/school_1/document.jpg
```

Use this to display high-speed document preview cards before the user clicks to view the full PDF!

### Strategy C: Multi-Page Image Carousel (Ideal for Mobile Safari)

On mobile devices where PDF iframes have scrolling limitations, convert PDF pages to an image gallery using Cloudinary:

```
Page 1: .../image/upload/pg_1/document.png
Page 2: .../image/upload/pg_2/document.png
Page 3: .../image/upload/pg_3/document.png
```

---

## 6. Mobile / iOS Safari Compatibility & Fallbacks

### iOS Safari Nested Iframe Behavior

Historically, iOS Safari treats iframes containing PDFs differently than desktop browsers:

- It renders only page 1 or expands the iframe height indefinitely.
- Pinch-to-zoom inside a nested iframe can zoom the entire page rather than just the PDF.

### Production Solution:

1. On desktop (`window.innerWidth >= 768px`), render the interactive iframe.
2. Provide prominent header buttons:
   - **Maximize / Dialog:** Opens the document in a full-screen modal.
   - **External Tab (`target="_blank"`):** Lets mobile Safari open the PDF in its native full-screen viewer.
3. Catch iframe load errors with `onError={() => setLoadFailed(true)}` to display the direct download and view fallback buttons immediately.

---

## 7. Step-by-Step Implementation Guide for the New App

1. **Install Client Preview Libraries (For Office Docs):**
   ```bash
   npm install docx-preview xlsx lucide-react
   ```
2. **Create `PdfDocumentViewer.tsx`:**
   Copy the component from Section 2 into `src/components/documents/viewer/PdfDocumentViewer.tsx`.
3. **Configure Delivery Headers:**
   Ensure your document API route or Cloudinary URL uses `Content-Disposition: inline` and `Content-Type: application/pdf`.
4. **Add URL Parameters:**
   Always append `#toolbar=1&navpanes=0` to the iframe `src`.
5. **Verify Security Headers in `next.config.mjs`:**
   Ensure `X-Frame-Options` is set to `SAMEORIGIN` (not `DENY`) so your own application can frame its preview API route.
