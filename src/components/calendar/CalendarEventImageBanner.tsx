"use client";

export function CalendarEventImageBanner({
  imagePath,
  altText,
}: {
  imagePath: string | null;
  altText: string;
}) {
  if (!imagePath) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imagePath} alt={altText} className="max-h-48 w-full object-cover" />
    </div>
  );
}
