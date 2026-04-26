import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Trash2, Plus, Users } from 'lucide-react';
import { useRoles, useCreateRole, useTogglePermission, useDeleteRole } from '@/hooks/useRoles';
import SlideOver from '@/components/ui/SlideOver';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from '@/stores/toastStore';
import { cn } from '@/lib/utils';
import type { Role, PermissionKey, Permission } from '@/types/role';

// ─── Add Role Form ───────────────────────────────────────────────────────────

const schema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});
type FormValues = z.infer<typeof schema>;

const fieldClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const errorClass = 'mt-1 text-xs text-rose-500';

function AddRoleForm({ permissions, onClose }: { permissions: Permission[]; onClose: () => void }) {
  const createRole = useCreateRole();
  const groups = [...new Set(permissions.map((p) => p.group))];

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { permissions: [] },
  });

  const selected = watch('permissions') as PermissionKey[];

  function togglePerm(key: PermissionKey) {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    setValue('permissions', next, { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    try {
      const role = await createRole.mutateAsync({
        name: values.name,
        description: values.description,
        permissions: values.permissions as PermissionKey[],
      });
      toast.success(`"${role.name}" role created.`);
      onClose();
    } catch {
      toast.error('Failed to create role.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Role name</label>
        <input {...register('name')} placeholder="e.g. Billing Admin" className={cn(fieldClass, errors.name && 'border-rose-400 dark:border-rose-600')} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register('description')} rows={2} placeholder="What can this role do?" className={cn(fieldClass, 'resize-none', errors.description && 'border-rose-400 dark:border-rose-600')} />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Permissions</label>
        {errors.permissions && <p className={cn(errorClass, 'mb-2')}>{errors.permissions.message}</p>}
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">{group}</p>
              <div className="space-y-1.5">
                {permissions.filter((p) => p.group === group).map((perm) => (
                  <label key={perm.key} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selected.includes(perm.key)}
                      onChange={() => togglePerm(perm.key)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{perm.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button type="button" onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50 transition-colors">
          {isSubmitting ? 'Creating…' : 'Create role'}
        </button>
      </div>
    </form>
  );
}

// ─── Permission Matrix ────────────────────────────────────────────────────────

function MatrixSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-3.5 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RolesPage() {
  const { data, isLoading } = useRoles();
  const togglePermission = useTogglePermission();
  const deleteRole = useDeleteRole();

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const roles = data?.data ?? [];
  const permissions = data?.permissions ?? [];
  const groups = [...new Set(permissions.map((p) => p.group))];

  async function handleToggle(role: Role, key: PermissionKey) {
    if (role.isSystem) return;
    const has = role.permissions.includes(key);
    const next = has ? role.permissions.filter((k) => k !== key) : [...role.permissions, key];
    try {
      await togglePermission.mutateAsync({ roleId: role.id, permissions: next });
    } catch {
      toast.error('Failed to update permission.');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteRole.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" role deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete role.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="block h-4 w-32 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ) : `${roles.length} roles configured`}
          </p>
        </div>
        <button
          onClick={() => setSlideOverOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <Plus size={15} /> Add role
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Roles sidebar ── */}
        <div className="w-64 shrink-0 space-y-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck size={15} className="text-indigo-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{role.name}</span>
                  </div>
                  {!role.isSystem && role.usersCount === 0 && (
                    <button
                      onClick={() => setDeleteTarget(role)}
                      className="shrink-0 p-1 rounded text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      title="Delete role"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{role.description}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <Users size={11} />
                  <span>{role.usersCount} user{role.usersCount !== 1 ? 's' : ''}</span>
                  {role.isSystem && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-[10px] font-medium">
                      System
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Permission matrix ── */}
        <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          {isLoading ? (
            <MatrixSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-52">Permission</th>
                    {roles.map((role) => (
                      <th key={role.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <>
                      {/* Group header row */}
                      <tr key={`group-${group}`} className="bg-gray-50/50 dark:bg-gray-800/20">
                        <td
                          colSpan={roles.length + 1}
                          className="px-5 py-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider"
                        >
                          {group}
                        </td>
                      </tr>

                      {/* Permission rows */}
                      {permissions
                        .filter((p) => p.group === group)
                        .map((perm) => (
                          <tr
                            key={perm.key}
                            className="border-t border-gray-50 dark:border-gray-800/60 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                          >
                            <td className="px-5 py-2.5">
                              <p className="text-sm text-gray-700 dark:text-gray-200">{perm.label}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{perm.description}</p>
                            </td>
                            {roles.map((role) => {
                              const has = role.permissions.includes(perm.key);
                              return (
                                <td key={role.id} className="px-4 py-2.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={has}
                                    disabled={role.isSystem}
                                    onChange={() => handleToggle(role, perm.key)}
                                    title={role.isSystem ? 'System roles cannot be modified' : undefined}
                                    className={cn(
                                      'w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500',
                                      role.isSystem ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                                    )}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Role SlideOver */}
      <SlideOver
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        title="Add New Role"
        description="Define a custom role with specific permissions."
      >
        <AddRoleForm permissions={permissions} onClose={() => setSlideOverOpen(false)} />
      </SlideOver>

      {/* Delete Confirmation */}
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
