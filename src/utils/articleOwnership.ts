export function canManageArticle(articleOwnerId: string | undefined, adminId: string, isGlobalAdmin: boolean) {
  return isGlobalAdmin || articleOwnerId === adminId;
}
