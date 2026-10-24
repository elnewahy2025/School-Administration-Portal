"use client";

import type { ProfileRow } from "@/lib/auth/getCurrentProfile";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";
import { DashboardVisionMission } from "./DashboardVisionMission";

export function DashboardHeader({
  school,
}: {
  profile?: ProfileRow;
  school: SchoolFullDetails | null;
}) {
  return <DashboardVisionMission school={school} />;
}
