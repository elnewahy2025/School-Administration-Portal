import { useTranslations } from "next-intl";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CircularApprovalResponse({
  reason,
  onReasonChange,
  onApprove,
  onReject,
  isPending,
}: {
  reason: string;
  onReasonChange: (val: string) => void;
  onApprove: () => void;
  onReject: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("circulars");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="rejection_reason">{t("rejectionReason")}</Label>
        <Textarea
          id="rejection_reason"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder={t("reasonPlaceholder")}
          rows={2}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onApprove} disabled={isPending} className="gap-2">
          <CheckCircle2Icon className="size-4" />
          <span>{t("approveAction")}</span>
        </Button>
        <Button variant="destructive" onClick={onReject} disabled={isPending} className="gap-2">
          <XCircleIcon className="size-4" />
          <span>{t("rejectAction")}</span>
        </Button>
      </div>
    </div>
  );
}
