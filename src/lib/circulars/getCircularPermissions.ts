export interface CircularPagePermissions {
  isOwner: boolean;
  canPublish: boolean;
  canManage: boolean;
  canViewResponses: boolean;
}

export function getCircularPermissions(perms: string[]): CircularPagePermissions {
  const isOwner = perms.includes("settings.platform.update") || perms.includes("roles.manage");
  const canPublish = isOwner || perms.includes("circular.publish");
  const canManage = canPublish || perms.includes("circular.create");
  const canViewResponses =
    isOwner || perms.includes("circular.view_responses") || perms.includes("audit.view");

  return { isOwner, canPublish, canManage, canViewResponses };
}
