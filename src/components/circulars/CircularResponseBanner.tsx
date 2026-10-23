import { CheckCircle2Icon } from "lucide-react";
import type { CircularResponseRow } from "@/lib/circulars/types";

export function CircularResponseBanner({
  response,
  statusLabel,
}: {
  response: CircularResponseRow;
  statusLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-4 text-sm">
      <CheckCircle2Icon className="size-5 shrink-0 text-primary" />
      <div>
        <p className="font-medium text-foreground">
          {statusLabel}: {response.status}
        </p>
        {response.reason ? (
          <p className="mt-1 text-xs text-muted-foreground">{response.reason}</p>
        ) : null}
      </div>
    </div>
  );
}
