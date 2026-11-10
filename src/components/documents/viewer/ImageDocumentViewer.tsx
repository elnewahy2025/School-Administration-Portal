"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomInIcon, ZoomOutIcon, RotateCwIcon, Maximize2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ImageDocumentViewerProps {
  url: string;
  fileName: string;
  className?: string;
}

export function ImageDocumentViewer({ url, fileName, className = "" }: ImageDocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <div className={`relative flex size-full flex-col overflow-hidden bg-muted/20 ${className}`}>
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="truncate font-medium">{fileName}</span>
        <div className="flex items-center gap-1">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            title="Zoom in"
          >
            <ZoomInIcon className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            title="Zoom out"
          >
            <ZoomOutIcon className="size-3.5" />
          </Button>
          <Button size="icon-xs" variant="ghost" onClick={handleRotate} title="Rotate 90deg">
            <RotateCwIcon className="size-3.5" />
          </Button>
          <Button size="icon-xs" variant="ghost" onClick={handleReset} title="Reset">
            <Maximize2Icon className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          className="flex items-center justify-center"
        >
          <Image
            src={url}
            alt={fileName}
            width={1200}
            height={800}
            unoptimized
            className="max-h-[70vh] w-auto max-w-full rounded-md object-contain shadow-md"
          />
        </div>
      </div>
    </div>
  );
}

