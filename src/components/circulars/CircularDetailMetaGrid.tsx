import { useTranslations } from "next-intl";

export function CircularDetailMetaGrid({
  publishedAt,
  dueAt,
  responseType,
}: {
  publishedAt?: string | null;
  dueAt?: string | null;
  responseType: string;
}) {
  const t = useTranslations("circulars");

  const formattedDueDate = dueAt ? new Date(dueAt).toLocaleDateString() : "—";
  const formattedPublishDate = publishedAt ? new Date(publishedAt).toLocaleDateString() : "—";

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/40 p-4 text-xs sm:grid-cols-3">
      <div>
        <span className="text-muted-foreground">{t("publishedAt")}: </span>
        <span className="font-medium text-foreground">{formattedPublishDate}</span>
      </div>
      <div>
        <span className="text-muted-foreground">{t("dueDate")}: </span>
        <span className="font-medium text-foreground">{formattedDueDate}</span>
      </div>
      <div>
        <span className="text-muted-foreground">{t("responseType")}: </span>
        <span className="font-medium text-foreground">{responseType}</span>
      </div>
    </div>
  );
}
