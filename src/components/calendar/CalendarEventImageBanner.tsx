"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { getCalendarImageUrl } from "@/lib/calendar/getCalendarImageUrl";

export function CalendarEventImageBanner({
  imagePath,
  altText,
}: {
  imagePath: string | null;
  altText: string;
}) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const resolvedUrl = getCalendarImageUrl(imagePath);

  if (!resolvedUrl) return null;

  const isLoaded = loadedUrl === resolvedUrl;
  const hasError = failedUrl === resolvedUrl;

  if (hasError) {
    return (
      <div className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-muted-foreground">
        <ImageIcon className="size-8 stroke-1 text-muted-foreground/60" aria-hidden="true" />
        <span className="text-xs">{altText}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 transition-opacity duration-200 ${
        isLoaded ? "opacity-100" : "opacity-90"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedUrl}
        alt={altText}
        onLoad={() => setLoadedUrl(resolvedUrl)}
        onError={() => setFailedUrl(resolvedUrl)}
        className="h-auto max-h-[32rem] w-full object-contain"
      />
    </div>
  );
}
