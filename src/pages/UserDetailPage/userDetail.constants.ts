import type { UserRole, UserStatus } from "@/types/user";

export const ROLES: { value: UserRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "guest", label: "Guest" },
];

export const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  ROLES.map((role) => [role.value, role.label]),
);

export const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  manager: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  editor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  viewer: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  guest: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

export const STATUS_STYLES: Record<UserStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  pending: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export const ACTION_LABELS: Record<string, string> = {
  "user:created": "created a user",
  "user:updated": "updated a user",
  "user:deleted": "deleted a user",
  "user:suspended": "suspended a user",
  "user:reactivated": "reactivated a user",
  "user:password_reset": "reset a password",
  "user:role_changed": "changed a role",
  "account:created": "created an account",
  "account:updated": "updated an account",
  "account:suspended": "suspended an account",
  "account:deleted": "deleted an account",
  "role:created": "created a role",
  "role:updated": "updated a role",
  "role:deleted": "deleted a role",
  "auth:login": "logged in",
  "auth:logout": "logged out",
  "settings:updated": "updated settings",
};

export const DOT_COLORS: Record<string, string> = {
  "user:deleted": "bg-rose-500",
  "user:suspended": "bg-amber-500",
  "account:deleted": "bg-rose-500",
  "account:suspended": "bg-amber-500",
  "role:deleted": "bg-rose-500",
  "auth:login": "bg-emerald-500",
  "auth:logout": "bg-gray-400",
};

export const USER_DETAIL_TABS = [
  { key: "profile", label: "Profile" },
  { key: "activity", label: "Activity" },
  { key: "sessions", label: "Sessions" },
  { key: "permissions", label: "Permissions" },
  { key: "security", label: "Security" },
] as const;

export const userDetailInputClass =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

export const userDetailLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
