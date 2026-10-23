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
  check("anon sees no school_settings", (await visibleCount(anon, "school_settings")).count === 0);
  check(
    "anon can read the public school profile view (N6)",
    (await visibleCount(anon, "public_school_profiles")).count === 2,
  );
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

  // -- C1: the app's owner-existence query must return a usable count ------
  const ownerProbe = await admin
    .from("user_role_assignments")
    .select("id, roles!inner(key)", { count: "exact", head: true })
    .eq("roles.key", "owner")
    .is("school_id", null);
  check(
    "owner-existence query returns a usable count (C1)",
    !ownerProbe.error && typeof ownerProbe.count === "number",
    ownerProbe.error?.message ?? `count=${ownerProbe.count}`,
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
  const ownerC = await signInAs(env, fx.creds.owner.email, fx.creds.owner.password);

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

  await expectDenied("admin cannot grant a role to a user outside the school", () =>
    adminC
      .from("user_role_assignments")
      .insert({
        user_id: fx.users.admin2.id,
        role_id: fx.roleIds.school_admin,
        school_id: fx.schoolId,
      })
      .select("id"),
  );

  // -- Platform owner: escalation + lockout guards (H6/H2/N4) --------------
  await expectDenied("owner cannot demote the last platform owner", () =>
    ownerC
      .from("user_role_assignments")
      .update({ role_id: fx.roleIds.school_admin, school_id: fx.schoolId })
      .eq("id", fx.ownerAssignmentId)
      .select("id"),
  );
  await expectDenied("owner cannot deactivate the last platform owner", () =>
    ownerC.from("profiles").update({ is_active: false }).eq("id", fx.users.owner.id).select("id"),
  );
  await expectDenied("non-owner cannot call bootstrap_platform_owner", () =>
    staffC.rpc("bootstrap_platform_owner", { p_user_id: fx.users.staff1.id }),
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
  await expectDenied("head cannot respond to a circular they are not targeted for", () =>
    headC
      .from("circular_responses")
      .insert({
        circular_id: fx.c2,
        school_id: fx.schoolId,
        department_id: fx.d1Id,
        responder_id: fx.users.head.id,
        response_type: "acknowledgement",
      })
      .select("id"),
  );
  await expectDenied("head cannot forge a response for another department", () =>
    headC
      .from("circular_responses")
      .insert({
        circular_id: fx.c1,
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
  await expectDenied("staff cannot create a pre-closed ticket", () =>
    staffC
      .from("maintenance_requests")
      .insert({
        school_id: fx.schoolId,
        ticket_number: `MR-preclosed-${Date.now()}`,
        title: "x",
        description: "x",
        reporter_id: fx.users.staff1.id,
        reporter_department_id: fx.d1Id,
        status: "closed",
      })
      .select("id"),
  );
  await expectDenied("staff cannot create a pre-assigned ticket", () =>
    staffC
      .from("maintenance_requests")
      .insert({
        school_id: fx.schoolId,
        ticket_number: `MR-preassigned-${Date.now()}`,
        title: "x",
        description: "x",
        reporter_id: fx.users.staff1.id,
        reporter_department_id: fx.d1Id,
        assigned_operator_id: fx.users.operator.id,
      })
      .select("id"),
  );
  await expectDenied("reporter cannot escalate priority while reopening", () =>
    staffC
      .from("maintenance_requests")
      .update({ status: "reopened", reopen_reason: "x", priority: "urgent" })
      .eq("id", fx.mr1)
      .select("id"),
  );
  await expectDenied("reporter cannot relocate their ticket while reopening", () =>
    staffC
      .from("maintenance_requests")
      .update({ status: "reopened", reopen_reason: "x", school_id: fx.school2Id })
      .eq("id", fx.mr1)
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
  await expectDenied("operator cannot change the ticket priority", () =>
    opC.from("maintenance_requests").update({ priority: "urgent" }).eq("id", fx.mr1).select("id"),
  );
  const resolved = await opC
    .from("maintenance_requests")
    .update({ status: "resolved" })
    .eq("id", fx.mr1)
    .select("id, status");
  check(
    "operator resolves the in-progress ticket",
    !resolved.error && (resolved.data ?? []).length === 1 && resolved.data[0].status === "resolved",
    resolved.error?.message,
  );
  const reopened = await staffC
    .from("maintenance_requests")
    .update({ status: "reopened", reopen_reason: "still broken" })
    .eq("id", fx.mr1)
    .select("id, status");
  check(
    "reporter can reopen their own resolved ticket",
    !reopened.error && (reopened.data ?? []).length === 1 && reopened.data[0].status === "reopened",
    reopened.error?.message,
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
  await expectDenied("disabled user cannot re-enable themselves", () =>
    disabledC
      .from("profiles")
      .update({ is_active: true })
      .eq("id", fx.users.disabled.id)
      .select("id"),
  );
  await expectDenied("disabled user cannot rewrite their own department", () =>
    disabledC
      .from("profiles")
      .update({ department_id: fx.d2Id })
      .eq("id", fx.users.disabled.id)
      .select("id"),
  );

  // -- Self-service profile scope (H4) -------------------------------------
  await expectDenied("staff cannot rewrite their own department", () =>
    staffC
      .from("profiles")
      .update({ department_id: fx.d2Id })
      .eq("id", fx.users.staff1.id)
      .select("id"),
  );
  const selfEdit = await staffC
    .from("profiles")
    .update({ full_name: "Renamed Staff" })
    .eq("id", fx.users.staff1.id)
    .select("id");
  check(
    "staff can still edit their own display name",
    !selfEdit.error && (selfEdit.data ?? []).length === 1,
    selfEdit.error?.message,
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
  await expectDenied("admin2 cannot point a target at another school's circular", () =>
    admin2C
      .from("circular_targets")
      .insert({ circular_id: fx.c1, school_id: fx.school2Id, department_id: fx.d2school2Id })
      .select("id"),
  );
  await expectDenied("admin2 cannot attach to another school's circular", () =>
    admin2C
      .from("circular_attachments")
      .insert({
        circular_id: fx.c1,
        school_id: fx.school2Id,
        path: `foreign/${Date.now()}.pdf`,
        uploaded_by: fx.users.admin2.id,
      })
      .select("id"),
  );
  await expectDenied("admin2 cannot assign onto another school's ticket", () =>
    admin2C
      .from("maintenance_assignments")
      .insert({
        request_id: fx.mr1,
        school_id: fx.school2Id,
        operator_id: fx.users.admin2.id,
        assigned_by: fx.users.admin2.id,
      })
      .select("id"),
  );
  await expectDenied("admin2 cannot add a work note to another school's ticket", () =>
    admin2C
      .from("maintenance_updates")
      .insert({
        request_id: fx.mr1,
        school_id: fx.school2Id,
        author_id: fx.users.admin2.id,
        kind: "note",
        new_value: "x",
      })
      .select("id"),
  );

  // -- H1: privileged helpers are not callable by anon or end users ---------
  const anonOwner = await anon.rpc("has_any_owner");
  check(
    "anon cannot call has_any_owner (H1)",
    Boolean(anonOwner.error),
    anonOwner.error?.message ?? "no error",
  );
  const anonNumber = await anon.rpc("generate_school_number", {
    p_school: fx.schoolId,
    p_kind: "MR",
  });
  check(
    "anon cannot call generate_school_number (H1)",
    Boolean(anonNumber.error),
    anonNumber.error?.message ?? "no error",
  );
  const staffOwner = await staffC.rpc("has_any_owner");
  check(
    "staff cannot call has_any_owner (H1)",
    Boolean(staffOwner.error),
    staffOwner.error?.message ?? "no error",
  );
  const staffNumber = await staffC.rpc("generate_school_number", {
    p_school: fx.schoolId,
    p_kind: "MR",
  });
  check(
    "staff cannot call generate_school_number (H1)",
    Boolean(staffNumber.error),
    staffNumber.error?.message ?? "no error",
  );
  const staffMember = await staffC.rpc("is_school_member", { p_school: fx.schoolId });
  check(
    "staff can still call the policy helper is_school_member (H1)",
    !staffMember.error && staffMember.data === true,
    staffMember.error?.message ?? `data=${staffMember.data}`,
  );

  // -- N12: department-scoped roles hold their school-scoped permissions -----
  const staffPerm = await staffC.rpc("has_permission", {
    p_permission: "maintenance.create",
    p_school: fx.schoolId,
  });
  check(
    "department-scoped staff holds maintenance.create (N12)",
    !staffPerm.error && staffPerm.data === true,
    staffPerm.error?.message ?? `data=${staffPerm.data}`,
  );
  const staffPermOther = await staffC.rpc("has_permission", {
    p_permission: "maintenance.create",
    p_school: fx.school2Id,
  });
  check(
    "staff holds no permission in another school (N12)",
    !staffPermOther.error && staffPermOther.data === false,
    staffPermOther.error?.message ?? `data=${staffPermOther.data}`,
  );
  const staffPermWrongDept = await staffC.rpc("has_permission", {
    p_permission: "maintenance.create",
    p_school: fx.schoolId,
    p_department: fx.d2Id,
  });
  check(
    "a mismatched department does not grant the permission (N12)",
    !staffPermWrongDept.error && staffPermWrongDept.data === false,
    staffPermWrongDept.error?.message ?? `data=${staffPermWrongDept.data}`,
  );

  // -- N5: the system-role catalog is readable by role managers -------------
  const adminRoles = await visibleCount(adminC, "roles");
  check(
    "a school admin can read the system role catalog (N5)",
    adminRoles.count >= 6,
    `count=${adminRoles.count}`,
  );
  const staffRoles = await visibleCount(staffC, "roles");
  check(
    "staff cannot read the role catalog (N5)",
    staffRoles.count === 0,
    `count=${staffRoles.count}`,
  );

  // -- H7/N7: structural + workflow changes are audited ---------------------
  const { data: auditMr, error: auditMrErr } = await staffC
    .from("maintenance_requests")
    .insert({
      school_id: fx.schoolId,
      ticket_number: `MR-${Date.now()}-audit`,
      title: "audit probe",
      description: "d",
      reporter_id: fx.users.staff1.id,
    })
    .select("id")
    .single();
  check(
    "staff can create a request for the audit probe (setup)",
    Boolean(auditMr?.id),
    auditMrErr?.message ?? "",
  );
  const { data: insertAudit } = await admin
    .from("audit_logs")
    .select("id")
    .eq("entity_type", "maintenance_requests")
    .eq("entity_id", auditMr?.id ?? "00000000-0000-0000-0000-000000000000")
    .eq("action", "maintenance_requests.insert");
  check("a new request is audited (N7)", (insertAudit ?? []).length === 1);

  const { error: prioErr } = await adminC
    .from("maintenance_requests")
    .update({ priority: "urgent" })
    .eq("id", fx.mr2);
  check(
    "admin can change a request priority for the audit probe (setup)",
    !prioErr,
    prioErr?.message ?? "",
  );
  const { data: updateAudit } = await admin
    .from("audit_logs")
    .select("id")
    .eq("entity_type", "maintenance_requests")
    .eq("entity_id", fx.mr2)
    .eq("action", "maintenance_requests.update");
  check("a priority change is audited (N7)", (updateAudit ?? []).length >= 1);

  const { data: probeSchool } = await admin
    .from("schools")
    .insert({
      name_ar: "مدرسة الاختبار",
      name_en: "Audit Probe School",
      slug: `audit-${Date.now()}`,
    })
    .select("id")
    .single();
  const { error: delErr } = await admin.from("schools").delete().eq("id", probeSchool.id);
  check("probe school can be deleted (setup)", !delErr, delErr?.message ?? "");
  const { data: schoolAudit } = await admin
    .from("audit_logs")
    .select("action, metadata")
    .eq("entity_type", "schools")
    .eq("entity_id", probeSchool.id)
    .in("action", ["schools.insert", "schools.delete"]);
  const schoolActions = new Set((schoolAudit ?? []).map((r) => r.action));
  check(
    "school create + delete are audited (H7)",
    schoolActions.has("schools.insert") && schoolActions.has("schools.delete"),
    `actions=${[...schoolActions].join(",")}`,
  );
  const schoolDeleteRow = (schoolAudit ?? []).find((r) => r.action === "schools.delete");
  check(
    "a deleted school keeps its name in the audit trail (H7)",
    schoolDeleteRow?.metadata?.school_name_en === "Audit Probe School",
    `meta=${JSON.stringify(schoolDeleteRow?.metadata ?? null).slice(0, 60)}`,
  );

  // -- H3/N10: attachment reads follow the entity audience ------------------
  const objectPath = `${fx.schoolId}/probe-${Date.now()}.jpg`;
  const { error: upErr } = await staffC.storage
    .from("maintenance-photos")
    .upload(objectPath, new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), { contentType: "image/jpeg" });
  check("reporter can upload a maintenance photo (setup)", !upErr, upErr?.message ?? "");
  const { error: regErr } = await staffC
    .from("maintenance_attachments")
    .insert({
      request_id: fx.mr1,
      school_id: fx.schoolId,
      path: objectPath,
      uploaded_by: fx.users.staff1.id,
    })
    .select("id");
  check("reporter can register the attachment (setup)", !regErr, regErr?.message ?? "");
  const selfSign = await staffC.storage.from("maintenance-photos").createSignedUrl(objectPath, 60);
  check(
    "reporter can read their own attachment (H3)",
    !selfSign.error,
    selfSign.error?.message ?? "",
  );
  const otherSign = await staff2C.storage
    .from("maintenance-photos")
    .createSignedUrl(objectPath, 60);
  check(
    "an unrelated user cannot read the attachment (H3/N10)",
    Boolean(otherSign.error) || !otherSign.data?.signedUrl,
    otherSign.error?.message ?? "a signed url was issued",
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
