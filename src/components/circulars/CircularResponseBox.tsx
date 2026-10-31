"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GoldDots } from "@/components/ui/gold-dots";
import { submitCircularResponseAction } from "@/actions/circulars/submitCircularResponseAction";
import type {
  CircularResponseStatus,
  CircularResponseType,
  CircularResponseRow,
} from "@/lib/circulars/types";
import { CircularApprovalResponse } from "./CircularApprovalResponse";
import { CircularResponseBanner } from "./CircularResponseBanner";

export function CircularResponseBox({
  circularId,
  responseType,
  existingResponse,
}: {
  circularId: string;
  responseType: CircularResponseType;
  existingResponse?: CircularResponseRow | null;
}) {
  const t = useTranslations("circulars");
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleResponse = (status: CircularResponseStatus) => {
    if (status === "rejected" && !reason.trim()) {
      toast.error(t("rejectionReason"));
      return;
    }

    startTransition(async () => {
      const res = await submitCircularResponseAction({
        circularId,
        responseType,
        status,
        reason,
      });

      if (res.success) {
        toast.success(t("responseRecorded"));
      } else {
        toast.error(res.error ?? "Failed to submit response");
      }
    });
  };

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 font-heading text-base font-extrabold text-primary">
          <span>{t("respond")}</span>
          <GoldDots />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingResponse ? (
          <CircularResponseBanner response={existingResponse} statusLabel={t("responseStatus")} />
        ) : null}

        {responseType === "acknowledgement" ? (
          <Button
            onClick={() => handleResponse("acknowledged")}
            disabled={isPending}
            className="w-full gap-2 sm:w-auto"
          >
            <CheckCircle2Icon className="size-4" />
            <span>{t("ackAction")}</span>
          </Button>
        ) : null}

        {responseType === "approval" ? (
          <CircularApprovalResponse
            reason={reason}
            onReasonChange={setReason}
            onApprove={() => handleResponse("approved")}
            onReject={() => handleResponse("rejected")}
            isPending={isPending}
          />
        ) : null}

        {responseType === "task" ? (
          <Button
            onClick={() => handleResponse("completed")}
            disabled={isPending}
            className="w-full gap-2 sm:w-auto"
          >
            <CheckCircle2Icon className="size-4" />
            <span>{t("statusCompleted")}</span>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
