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
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              <Check size={13} /> {updateUser.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Full name</p>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Email</p>
            <p className="mt-2 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Role</p>
            <div className="mt-2">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", ROLE_COLORS[user.role])}>
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Account ID</p>
            <p className="mt-2 font-mono text-xs font-semibold text-gray-600 dark:text-gray-300">{user.accountId ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 md:col-span-2 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Member since</p>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{fmt(user.dateJoined)}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
