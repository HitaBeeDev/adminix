import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCreateRole } from "@/hooks/useRoles";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import type { Permission, PermissionKey } from "@/types/role";
import { roleErrorClass, roleFieldClass, roleLabelClass } from "./roles.constants";
import { addRoleSchema, type AddRoleValues } from "./roles.schema";
import { getPermissionGroups } from "./roles.utils";

interface AddRoleFormProps {
  onClose: () => void;
  permissions: Permission[];
}

export function AddRoleForm({ onClose, permissions }: AddRoleFormProps) {
  const createRole = useCreateRole();
  const groups = getPermissionGroups(permissions);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddRoleValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: { permissions: [] },
  });

  const selected = (useWatch({ control, name: "permissions" }) ?? []) as PermissionKey[];

  function togglePerm(key: PermissionKey) {
    const next = selected.includes(key)
      ? selected.filter((selectedKey) => selectedKey !== key)
      : [...selected, key];
    setValue("permissions", next, { shouldValidate: true });
  }

  async function onSubmit(values: AddRoleValues) {
    try {
      const role = await createRole.mutateAsync({
        name: values.name,
        description: values.description,
        permissions: values.permissions as PermissionKey[],
      });
      toast.success(`"${role.name}" role created.`);
      onClose();
    } catch {
      toast.error("Failed to create role.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={roleLabelClass}>Role name</label>
        <input
          {...register("name")}
          placeholder="e.g. Billing Admin"
          className={cn(roleFieldClass, errors.name && "border-rose-400 dark:border-rose-600")}
        />
        {errors.name && <p className={roleErrorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label className={roleLabelClass}>Description</label>
        <textarea
          {...register("description")}
          rows={2}
          placeholder="What can this role do?"
          className={cn(roleFieldClass, "resize-none", errors.description && "border-rose-400 dark:border-rose-600")}
        />
        {errors.description && <p className={roleErrorClass}>{errors.description.message}</p>}
      </div>

      <div>
        <label className={roleLabelClass}>Permissions</label>
        {errors.permissions && <p className={cn(roleErrorClass, "mb-2")}>{errors.permissions.message}</p>}
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">{group}</p>
              <div className="space-y-1.5">
                {permissions
                  .filter((permission) => permission.group === group)
                  .map((permission) => (
                    <label key={permission.key} className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selected.includes(permission.key)}
                        onChange={() => togglePerm(permission.key)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {permission.label}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] font-medium disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create role"}
        </button>
      </div>
    </form>
  );
}
