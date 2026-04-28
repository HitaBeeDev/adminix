import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/toastStore";
import { ROLES, ROLE_COLORS, ROLE_LABELS, userDetailInputClass, userDetailLabelClass } from "./userDetail.constants";
import { editUserSchema, type EditUserValues } from "./userDetail.schema";
import { fmt } from "./userDetail.utils";
import { UserDetailInfoRow } from "./UserDetailInfoRow";
import { useUserDetailContext } from "./UserDetailContext";

export function ProfileTab() {
  const { user, refreshUser } = useUserDetailContext();
  const [isEditing, setIsEditing] = useState(false);
  const updateUser = useUpdateUser(user.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { name: user.name, email: user.email, role: user.role as EditUserValues["role"] },
  });

  async function onSubmit(values: EditUserValues) {
    try {
      await updateUser.mutateAsync(values);
      toast.success("Profile updated.");
      setIsEditing(false);
      refreshUser();
    } catch {
      toast.error("Failed to update profile.");
    }
  }

  function handleCancel() {
    reset({ name: user.name, email: user.email, role: user.role as EditUserValues["role"] });
    setIsEditing(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818]">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updateUser.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[#4fc4cf] hover:brightness-105 text-[#181818] font-medium disabled:opacity-50 transition-colors"
            >
              <Check size={13} /> {updateUser.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div>
          <UserDetailInfoRow label="Full name" value={user.name} />
          <UserDetailInfoRow label="Email" value={user.email} />
          <UserDetailInfoRow
            label="Role"
            value={
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", ROLE_COLORS[user.role])}>
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            }
          />
          <UserDetailInfoRow
            label="Account ID"
            value={<span className="font-mono text-xs text-gray-500 dark:text-gray-400">{user.accountId ?? "-"}</span>}
          />
          <UserDetailInfoRow label="Member since" value={fmt(user.dateJoined)} />
        </div>
      ) : (
        <div className="space-y-4 max-w-md">
          <div>
            <label className={userDetailLabelClass}>Full name</label>
            <input {...register("name")} className={userDetailInputClass} />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className={userDetailLabelClass}>Email</label>
            <input {...register("email")} type="email" className={userDetailInputClass} />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className={userDetailLabelClass}>Role</label>
            <select {...register("role")} className={cn(userDetailInputClass, "appearance-none cursor-pointer")}>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-rose-500">{errors.role.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
