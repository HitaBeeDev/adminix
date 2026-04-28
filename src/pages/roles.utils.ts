import type { Permission } from "@/types/role";

export function getPermissionGroups(permissions: Permission[]) {
  return [...new Set(permissions.map((permission) => permission.group))];
}
