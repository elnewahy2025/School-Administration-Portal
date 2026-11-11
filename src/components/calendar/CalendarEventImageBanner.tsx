"use client";

import { useState } from "react";
import Image from "next/image";
import { getCalendarImageUrl } from "@/lib/calendar/getCalendarImageUrl";

export function CalendarEventImageBanner({
  imagePath,
  altText,
}: {
  imagePath: string | null;
  altText: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const resolvedUrl = getCalendarImageUrl(imagePath);

  if (!resolvedUrl || failedUrl === resolvedUrl) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Image
        src={resolvedUrl}
        alt={altText}
        width={800}
        height={300}
        unoptimized
        onError={() => setFailedUrl(resolvedUrl)}
        className="max-h-48 w-full object-cover"
      />
    </div>
  );
}
