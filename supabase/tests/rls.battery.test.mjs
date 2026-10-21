// WP2 RLS/authorization battery (build_plan.md WP2 gate; doc §9 Phase 2).
// Run: node --env-file=.env.local supabase/tests/rls.battery.test.mjs
// Seeds two schools with per-role users, then asserts visibility and
// denial behavior through the real API with real sessions.
import {
  check,
  cleanup,
  expectDenied,
  getEnv,
  makeAdmin,
  makeAnon,
  seedFixture,
  signInAs,
  skip,
  summary,
  visibleCount,
} from "./rls.helpers.test.mjs";

const env = getEnv();
const admin = makeAdmin(env);
let fx;

try {
  fx = await seedFixture(admin);
  const anon = makeAnon(env);

  // -- Anonymous: deny by default -----------------------------------------
  check("anon sees no circulars", (await visibleCount(anon, "circulars")).count === 0);
  check("anon sees no audit logs", (await visibleCount(anon, "audit_logs")).count === 0);
  check("anon sees no schools", (await visibleCount(anon, "schools")).count === 0);
  check("anon sees no profiles", (await visibleCount(anon, "profiles")).count === 0);
  check("anon sees no notifications", (await visibleCount(anon, "notifications")).count === 0);
  check(
    "anon sees exactly the one public published event",
    (await visibleCount(anon, "calendar_events")).count === 1,
  );
  await expectDenied("anon cannot create a maintenance request", () =>
    anon
      .from("maintenance_requests")
      .insert({
        school_id: fx.schoolId,
        title: "x",
        description: "x",
        reporter_id: fx.users.staff1.id,
      })
      .select("id"),
  );

  // -- Sessions ------------------------------------------------------------
  const adminC = await signInAs(env, fx.creds.admin.email, fx.creds.admin.password);
  const headC = await signInAs(env, fx.creds.head.email, fx.creds.head.password);
  const staffC = await signInAs(env, fx.creds.staff1.email, fx.creds.staff1.password);
  const staff2C = await signInAs(env, fx.creds.staff2.email, fx.creds.staff2.password);
  const opC = await signInAs(env, fx.creds.operator.email, fx.creds.operator.password);
  const audC = await signInAs(env, fx.creds.auditor.email, fx.creds.auditor.password);
  const disabledC = await signInAs(env, fx.creds.disabled.email, fx.creds.disabled.password);
  const admin2C = await signInAs(env, fx.creds.admin2.email, fx.creds.admin2.password);

  // -- School admin --------------------------------------------------------
  check("admin sees all three circulars", (await visibleCount(adminC, "circulars")).count === 3);
  check("admin reads the school audit trail", (await visibleCount(adminC, "audit_logs")).count > 0);
  check("admin sees school profiles", (await visibleCount(adminC, "profiles")).count === 7);
  check(
    "admin cannot read platform system_settings",
    (await visibleCount(adminC, "system_settings")).count === 0,
  );
  if (fx.ownerAssignmentId) {
    await expectDenied("admin cannot delete the platform owner assignment", () =>
      adminC.from("user_role_assignments").delete().eq("id", fx.ownerAssignmentId).select("id"),
    );
  } else {
    skip("admin cannot delete the platform owner assignment", "no platform owner exists");
  }
  await expectDenied("admin cannot write the permission matrix", () =>
    adminC
      .from("role_permissions")
      .insert({ role_id: fx.roleIds.auditor, permission_key: "circular.publish" })
      .select("role_id"),
  );

  // -- Department head: targeting + cross-department isolation -------------
  check(
    "head sees only targeted published C1",
    (await visibleCount(headC, "circulars")).count === 1,
  );
  const resp = await headC
    .from("circular_responses")
    .insert({
      circular_id: fx.c1,
      school_id: fx.schoolId,
      department_id: fx.d1Id,
      responder_id: fx.users.head.id,
      response_type: "acknowledgement",
      status: "acknowledged",
    })
    .select("id");
  check(
    "head responds for own department",
    !resp.error && (resp.data ?? []).length === 1,
    resp.error?.message,
  );
  await expectDenied("head cannot respond for another department", () =>
    headC
      .from("circular_responses")
      .insert({
        circular_id: fx.c3,
        school_id: fx.schoolId,
        department_id: fx.d2Id,
        responder_id: fx.users.head.id,
        response_type: "acknowledgement",
      })
      .select("id"),
  );
  check(
    "head sees only own response (no identities)",
    (await visibleCount(headC, "circular_responses")).count === 1,
  );
  check(
    "head sees own-department maintenance only",
    (await visibleCount(headC, "maintenance_requests")).count === 1,
  );

  // -- Staff: least privilege ----------------------------------------------
  check(
    "staff sees only targeted published C1",
    (await visibleCount(staffC, "circulars")).count === 1,
  );
  check(
    "staff sees own maintenance ticket only",
    (await visibleCount(staffC, "maintenance_requests")).count === 1,
  );
  await expectDenied("staff cannot respond to circulars", () =>
    staffC
      .from("circular_responses")
      .insert({
        circular_id: fx.c1,
        school_id: fx.schoolId,
        department_id: fx.d1Id,
        responder_id: fx.users.staff1.id,
        response_type: "acknowledgement",
      })
      .select("id"),
  );
  await expectDenied("staff cannot move their own ticket status", () =>
    staffC
      .from("maintenance_requests")
      .update({ status: "reopened", reopen_reason: "still broken" })
      .eq("id", fx.mr1)
      .select("id"),
  );
  await expectDenied("staff cannot change ticket priority", () =>
    staffC
      .from("maintenance_requests")
      .update({ priority: "urgent" })
      .eq("id", fx.mr1)
      .select("id"),
  );
  await expectDenied("staff cannot grant themselves a role", () =>
    staffC
      .from("user_role_assignments")
      .insert({
        user_id: fx.users.staff1.id,
        role_id: fx.roleIds.school_admin,
        school_id: fx.schoolId,
      })
      .select("id"),
  );

  // -- Operator: assigned tickets and legal transitions only ---------------
  check(
    "operator sees the assigned ticket",
    (await visibleCount(opC, "maintenance_requests")).count === 1,
  );
  const started = await opC
    .from("maintenance_requests")
    .update({ status: "in_progress" })
    .eq("id", fx.mr1)
    .select("id, status");
  check(
    "operator moves assigned ticket to in_progress",
    !started.error && (started.data ?? []).length === 1 && started.data[0].status === "in_progress",
    started.error?.message,
  );
  await expectDenied("operator cannot skip to closed", () =>
    opC.from("maintenance_requests").update({ status: "closed" }).eq("id", fx.mr1).select("id"),
  );
  const note = await opC
    .from("maintenance_updates")
    .insert({
      request_id: fx.mr1,
      school_id: fx.schoolId,
      author_id: fx.users.operator.id,
      kind: "note",
      new_value: "working on it",
    })
    .select("id");
  check(
    "operator adds a work note",
    !note.error && (note.data ?? []).length === 1,
    note.error?.message,
  );
  await expectDenied("operator cannot touch another department's ticket", () =>
    opC
      .from("maintenance_updates")
      .insert({
        request_id: fx.mr2,
        school_id: fx.schoolId,
        author_id: fx.users.operator.id,
        kind: "note",
        new_value: "x",
      })
      .select("id"),
  );

  // -- Auditor: read-only ---------------------------------------------------
  check("auditor reads the audit trail", (await visibleCount(audC, "audit_logs")).count > 0);
  check(
    "auditor reads all maintenance (reports.view)",
    (await visibleCount(audC, "maintenance_requests")).count === 2,
  );
  check(
    "auditor sees no circular responses",
    (await visibleCount(audC, "circular_responses")).count === 0,
  );
  if (fx.auditId) {
    await expectDenied("auditor cannot edit audit logs", () =>
      audC.from("audit_logs").update({ action: "tampered" }).eq("id", fx.auditId).select("id"),
    );
  } else {
    skip("auditor cannot edit audit logs", "no audit rows were written");
  }

  // -- Disabled user: data access revoked ----------------------------------
  check(
    "disabled user sees no circulars despite targeting",
    (await visibleCount(disabledC, "circulars")).count === 0,
  );
  check(
    "disabled user sees no maintenance tickets",
    (await visibleCount(disabledC, "maintenance_requests")).count === 0,
  );

  // -- Cross-school isolation -----------------------------------------------
  check(
    "school-2 admin sees no school-1 circulars",
    (await visibleCount(admin2C, "circulars")).count === 0,
  );
  check(
    "school-2 admin sees no school-1 maintenance",
    (await visibleCount(admin2C, "maintenance_requests")).count === 0,
  );
  check(
    "school-2 admin sees only own school profiles",
    (await visibleCount(admin2C, "profiles")).count === 1,
  );

  // -- IDOR: guessed IDs across departments ---------------------------------
  const idor = await staff2C.from("maintenance_requests").select("*").eq("id", fx.mr1);
  check("foreign ticket not fetchable by id", (idor.data ?? []).length === 0);
  const respIdor = await staff2C.from("circular_responses").select("*").eq("circular_id", fx.c1);
  check("foreign department responses not listable", (respIdor.data ?? []).length === 0);
} finally {
  if (fx) await cleanup(admin, fx);
  const ok = summary();
  if (!ok) process.exit(1);
}
