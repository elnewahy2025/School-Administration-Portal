import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircularPriorityBadge } from "./CircularPriorityBadge";
import { CircularStatusBadge } from "./CircularStatusBadge";
import { CircularPublishButton } from "./CircularPublishButton";
import type { CircularDetail } from "@/lib/circulars/getCircularById";

export function CircularDetailCard({
  circular,
  canPublish,
}: {
  circular: CircularDetail;
  canPublish: boolean;
}) {
  const t = useTranslations("circulars");

  const formattedDueDate = circular.due_at ? new Date(circular.due_at).toLocaleDateString() : "—";
  const formattedPublishDate = circular.publish_at
    ? new Date(circular.publish_at).toLocaleDateString()
    : "—";

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {circular.ref_number}
            </span>
            <CircularPriorityBadge priority={circular.priority} />
            <CircularStatusBadge status={circular.status} />
          </div>
          <CardTitle className="text-xl font-bold">{circular.title}</CardTitle>
        </div>
        {circular.status === "draft" && canPublish ? (
          <CircularPublishButton circularId={circular.id} />
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
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
            <span className="font-medium text-foreground">{circular.response_type}</span>
          </div>
        </div>

        {circular.targets.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">
              {t("targetedDepartments")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {circular.targets.map((tgt) => (
                <Badge key={tgt.id} variant="secondary">
                  {tgt.department_name ?? tgt.role_key ?? "All"}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">
            {t("circularBody")}
          </h3>
          <div className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {circular.body}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
