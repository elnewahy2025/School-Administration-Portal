"use client";

import { useState } from "react";
import type { SchoolUserRow } from "@/lib/school/getSchoolUsers";
import type { DepartmentRow } from "@/lib/school/getSchoolDepartments";
import type { SchoolRoleRow } from "@/lib/rbac/getSchoolRoles";
import { UserList } from "@/components/settings/UserList";
import { RoleList } from "./RoleList";
import { UserRolesTabNav } from "./UserRolesTabNav";

export function UserRolesManager({
  users,
  departments,
  roles,
  currentUserId,
  canManage,
}: {
  users: SchoolUserRow[];
  departments: DepartmentRow[];
  roles: SchoolRoleRow[];
  currentUserId?: string;
  canManage: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  return (
    <div className="space-y-6">
      <UserRolesTabNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "users" ? (
        <UserList
          users={users}
          departments={departments}
          roles={roles}
          currentUserId={currentUserId}
          canManage={canManage}
        />
      ) : (
        <RoleList roles={roles} canManage={canManage} />
      )}
    </div>
  );
}
