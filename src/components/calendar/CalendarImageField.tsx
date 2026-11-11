"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function CalendarImageField({
  initialImageUrl,
  disabled = false,
}: {
  initialImageUrl?: string | null;
  disabled?: boolean;
}) {
  const t = useTranslations("calendar");
  const [preview, setPreview] = useState<string | null>(null);

  const displayUrl = preview ?? initialImageUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <Label htmlFor="image" className="flex items-center gap-2">
        <UploadIcon className="size-4 text-muted-foreground" />
        <span>{t("bannerImage")}</span>
      </Label>
      {displayUrl && (
        <div className="relative max-h-48 overflow-hidden rounded-lg border border-border bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayUrl} alt="Banner preview" className="max-h-48 w-full object-cover" />
        </div>
      )}
      <Input
        id="image"
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={handleFileChange}
      />
      <p className="text-xs text-muted-foreground">{t("bannerHelp")}</p>
    </div>
  );
}
