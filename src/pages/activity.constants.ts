import type { ActionType } from "@/types/activity";

export const ACTION_OPTIONS: { value: ActionType | ""; label: string }[] = [
  { value: "", label: "All actions" },
  { value: "user:created", label: "User created" },
  { value: "user:updated", label: "User updated" },
  { value: "user:deleted", label: "User deleted" },
  { value: "user:suspended", label: "User suspended" },
  { value: "user:reactivated", label: "User reactivated" },
  { value: "user:password_reset", label: "Password reset" },
  { value: "user:role_changed", label: "Role changed" },
  { value: "account:created", label: "Account created" },
  { value: "account:updated", label: "Account updated" },
  { value: "account:suspended", label: "Account suspended" },
  { value: "account:deleted", label: "Account deleted" },
  { value: "role:created", label: "Role created" },
  { value: "role:updated", label: "Role updated" },
  { value: "role:deleted", label: "Role deleted" },
  { value: "auth:login", label: "Login" },
  { value: "auth:logout", label: "Logout" },
  { value: "settings:updated", label: "Settings updated" },
];

export const ACTION_LABEL: Record<string, string> = Object.fromEntries(
  ACTION_OPTIONS.filter((option) => option.value).map((option) => [option.value, option.label]),
);

export const DOT_COLOR: Record<string, string> = {
  "user:deleted": "bg-rose-500",
  "user:suspended": "bg-amber-500",
  "account:deleted": "bg-rose-500",
  "account:suspended": "bg-amber-500",
  "role:deleted": "bg-rose-500",
  "auth:login": "bg-emerald-500",
  "auth:logout": "bg-gray-400",
};

export const activitySelectClass =
  "py-2 pl-3 pr-8 text-[0.85rem] font-[400] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer";
