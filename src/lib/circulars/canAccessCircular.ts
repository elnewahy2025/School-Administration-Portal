export function canAccessCircular(
  circularSchoolId: string,
  userSchoolId: string | null | undefined,
  isOwner: boolean,
): boolean {
  if (isOwner) {
    return true;
  }
  return Boolean(userSchoolId && circularSchoolId === userSchoolId);
}
