"use client";

import { useState, useRef, useEffect } from "react";
import { getCalendarImageUrl } from "@/lib/calendar/getCalendarImageUrl";

export function CalendarEventImageBanner({
  imagePath,
  altText,
}: {
  imagePath: string | null;
  altText: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const resolvedUrl = getCalendarImageUrl(imagePath);

  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth === 0) {
        setHasError(true);
      } else {
        setIsLoaded(true);
      }
    }
  }, [resolvedUrl]);

  if (!resolvedUrl || hasError) return null;

  return (
    <div
      className={`overflow-hidden rounded-lg border border-border transition-opacity duration-200 ${
        isLoaded ? "opacity-100" : "hidden"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={resolvedUrl}
        alt={altText}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className="max-h-48 w-full object-cover"
      />
    </div>
  );
}
