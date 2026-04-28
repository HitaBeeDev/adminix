import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/toastStore";
import {
  settingsErrorClass,
  settingsFieldClass,
  settingsLabelClass,
  settingsSectionClass,
} from "./settings.constants";
import { profileSchema, type ProfileValues } from "./settings.schema";
import { initials } from "./settings.utils";

export function ProfileTab() {
  const user = useAuthStore((state) => state.user);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      title: "Product Manager",
      bio: "Building great admin interfaces, one component at a time.",
    },
  });

  async function onSubmit() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaving(false);
    toast.success("Profile updated.");
  }

  return (
    <div className="space-y-6">
      <div className={settingsSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Avatar</h3>
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-[#4fc4cf] flex items-center justify-center text-xl font-bold text-[#181818] select-none">
              {user ? initials(user.name) : "AU"}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user?.email}</p>
            <button className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              Upload photo
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(JPG, PNG - max 2 MB)</span>
          </div>
        </div>
      </div>

      <div className={settingsSectionClass}>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={settingsLabelClass}>Full Name</label>
              <input {...register("name")} className={settingsFieldClass} />
              {errors.name && <p className={settingsErrorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={settingsLabelClass}>Email Address</label>
              <input {...register("email")} type="email" className={settingsFieldClass} />
              {errors.email && <p className={settingsErrorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <label className={settingsLabelClass}>Job Title</label>
              <input {...register("title")} className={settingsFieldClass} placeholder="e.g. Product Manager" />
            </div>
          </div>
          <div>
            <label className={settingsLabelClass}>Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className={cn(settingsFieldClass, "resize-none")}
              placeholder="A short description about yourself"
            />
            {errors.bio && <p className={settingsErrorClass}>{errors.bio.message}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[#4fc4cf] text-[#181818] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
