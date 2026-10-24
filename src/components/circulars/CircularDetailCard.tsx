import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { resolveRoleDisplayName } from "@/lib/rbac/resolveRoleDisplayName";
import { CircularPriorityBadge } from "./CircularPriorityBadge";
import { CircularStatusBadge } from "./CircularStatusBadge";
import { CircularDetailActions } from "./CircularDetailActions";
import { CircularAttachmentsList } from "./CircularAttachmentsList";
import { CircularDetailMetaGrid } from "./CircularDetailMetaGrid";
import type { CircularDetail } from "@/lib/circulars/getCircularById";

export function CircularDetailCard({
  circular,
  canPublish,
  canManage = false,
  totalDepartments,
}: {
  circular: CircularDetail;
  canPublish: boolean;
  canManage?: boolean;
  totalDepartments?: number;
}) {
  const t = useTranslations("circulars");
  const tRbac = useTranslations("rbac");

  const isAllTargets =
    !circular.targets ||
    circular.targets.length === 0 ||
    (typeof totalDepartments === "number" &&
      totalDepartments > 0 &&
      circular.targets.length >= totalDepartments);

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
        <CircularDetailActions circular={circular} canPublish={canPublish} canManage={canManage} />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <CircularDetailMetaGrid
          publishedAt={circular.publish_at}
          dueAt={circular.due_at}
          responseType={circular.response_type}
        />

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">
            {t("targetedDepartments")}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {isAllTargets ? (
              <Badge variant="secondary" className="font-semibold">
                {t("allDepartments")}
              </Badge>
            ) : (
              circular.targets.map((tgt) => (
                <Badge key={tgt.id} variant="secondary">
                  {tgt.department_name ??
                    (tgt.role_key
                      ? resolveRoleDisplayName(tgt.role_key, tRbac)
                      : t("allDepartments"))}
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">
            {t("circularBody")}
          </h3>
          <div className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {circular.body}
          </div>
        </div>

        {circular.attachments && circular.attachments.length > 0 ? (
          <CircularAttachmentsList
            attachments={circular.attachments}
            circularId={circular.id}
            canManage={canManage}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
