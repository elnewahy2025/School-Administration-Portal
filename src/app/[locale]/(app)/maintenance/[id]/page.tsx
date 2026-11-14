import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";
import { isPlatformOwner } from "@/lib/auth/isPlatformOwner";
import { resolveSchoolForCaller } from "@/lib/school/resolveSchoolForCaller";
import { getMaintenanceRequestById } from "@/lib/maintenance/getMaintenanceRequestById";
import { getMaintenanceUpdates } from "@/lib/maintenance/getMaintenanceUpdates";
import { getMaintenanceAttachments } from "@/lib/maintenance/getMaintenanceAttachments";
import { getMaintenanceOperators } from "@/lib/maintenance/getMaintenanceOperators";
import { resolveMaintenanceDetailPermissions } from "@/lib/maintenance/resolveMaintenanceDetailPermissions";
import { getSchoolLocations } from "@/lib/school";
import { createSupabaseServerClient } from "@/lib/supabase";
import { markEntityNotificationsRead } from "@/lib/notifications/markEntityNotificationsRead";
import { MaintenanceDetailCard } from "@/components/maintenance/MaintenanceDetailCard";
import { MaintenanceAttachmentsList } from "@/components/maintenance/MaintenanceAttachmentsList";
import { MaintenanceStatusActions } from "@/components/maintenance/MaintenanceStatusActions";
import { MaintenanceAssignSection } from "@/components/maintenance/MaintenanceAssignSection";
import { MaintenanceTimeline } from "@/components/maintenance/MaintenanceTimeline";
import { MaintenanceAddNoteBox } from "@/components/maintenance/MaintenanceAddNoteBox";
import { MaintenanceDetailActions } from "@/components/maintenance/MaintenanceDetailActions";

export default async function MaintenanceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(`/${locale}/login`);
  }

  const schoolId = await resolveSchoolForCaller(profile);
  if (!schoolId) {
    redirect(`/${locale}/login`);
  }

  const isOwner = await isPlatformOwner(profile.id);
  const ticket = await getMaintenanceRequestById(id);
  if (!ticket || (!isOwner && ticket.school_id !== schoolId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  await markEntityNotificationsRead(supabase, {
    userId: profile.id,
    entityType: "maintenance_request",
    entityId: id,
  });

  const targetSchoolId = ticket.school_id;
  const [updates, attachments, operators, locations, perms] = await Promise.all([
    getMaintenanceUpdates(id),
    getMaintenanceAttachments(id),
    getMaintenanceOperators(targetSchoolId),
    getSchoolLocations(targetSchoolId),
    resolveMaintenanceDetailPermissions(profile, ticket),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href={`/${locale}/maintenance`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeftIcon className="size-4 rtl:rotate-180" />
            <span>Back to Maintenance</span>
          </Button>
        </Link>

        <MaintenanceDetailActions
          ticket={ticket}
          locations={locations}
          canManage={perms.canManage}
        />
      </div>

      <MaintenanceDetailCard ticket={ticket} />

      <MaintenanceAttachmentsList attachments={attachments} />

      <MaintenanceStatusActions
        requestId={id}
        status={ticket.status}
        isReporter={perms.isReporter}
        isOperator={perms.isOperator}
        canAssign={perms.canAssign}
        canClose={perms.canClose}
      />

      {perms.canAssign && (
        <MaintenanceAssignSection
          requestId={id}
          currentOperatorId={ticket.assigned_operator_id}
          currentPriority={ticket.priority}
          currentStatus={ticket.status}
          operators={operators}
        />
      )}

      <MaintenanceTimeline updates={updates} />

      {perms.isParticipant && <MaintenanceAddNoteBox requestId={id} />}
    </div>
  );
}
