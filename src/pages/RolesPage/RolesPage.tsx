import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SlideOver from "@/components/ui/SlideOver";
import { useDeleteRole, useRoles, useTogglePermission } from "@/hooks/useRoles";
import { toast } from "@/stores/toastStore";
import type { PermissionKey, Role } from "@/types/role";
import { AddRoleForm } from "./AddRoleForm";
import { RolesHeader } from "./RolesHeader";
import { RolesPermissionMatrix } from "./RolesPermissionMatrix";
import { RolesSidebar } from "./RolesSidebar";
import { getPermissionGroups } from "./roles.utils";

export function RolesPage() {
  const { data, isLoading, isError, error, refetch } = useRoles();
  const togglePermission = useTogglePermission();
  const deleteRole = useDeleteRole();

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const roles = data?.data ?? [];
  const permissions = data?.permissions ?? [];
  const groups = getPermissionGroups(permissions);

  async function handleToggle(role: Role, key: PermissionKey) {
    if (role.isSystem) return;

    const has = role.permissions.includes(key);
    const next = has ? role.permissions.filter((permission) => permission !== key) : [...role.permissions, key];

    try {
      await togglePermission.mutateAsync({ roleId: role.id, permissions: next });
    } catch {
      toast.error("Failed to update permission.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteRole.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" role deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete role.");
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <RolesHeader
        isLoading={isLoading}
        onAddRole={() => setSlideOverOpen(true)}
        rolesCount={roles.length}
      />

      <div className="flex gap-6 items-start">
        <RolesSidebar
          error={error}
          isError={isError}
          isLoading={isLoading}
          onAddRole={() => setSlideOverOpen(true)}
          onDeleteRole={setDeleteTarget}
          onRetry={() => void refetch()}
          roles={roles}
        />
        <RolesPermissionMatrix
          error={error}
          groups={groups}
          isError={isError}
          isLoading={isLoading}
          onAddRole={() => setSlideOverOpen(true)}
          onRetry={() => void refetch()}
          onTogglePermission={handleToggle}
          permissions={permissions}
          roles={roles}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        title="Add New Role"
        description="Define a custom role with specific permissions."
      >
        <AddRoleForm permissions={permissions} onClose={() => setSlideOverOpen(false)} />
      </SlideOver>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete role"
        loading={deleteRole.isPending}
      />
    </div>
  );
}
