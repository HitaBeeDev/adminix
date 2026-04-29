import type { UserRole, UserStatus } from "@/types/user";
import type { SortableColumn } from "./users.types";

export const ROLE_OPTIONS: { value: UserRole | ""; label: string }[] = [
  { value: "", label: "All roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "guest", label: "Guest" },
];

export const STATUS_OPTIONS: { value: UserStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "pending", label: "Pending" },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  editor: "Editor",
  viewer: "Viewer",
  guest: "Guest",
};

export const STATUS_STYLES: Record<UserStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  suspended: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export const USER_COLUMNS: { key: SortableColumn; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "dateJoined", label: "Joined" },
];

export const USER_GRID_COLUMNS =
  "44px minmax(150px, 1.15fr) minmax(170px, 1.45fr) minmax(92px, 0.65fr) minmax(88px, 0.55fr) minmax(104px, 0.65fr) 48px";

export const USER_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_USER_PAGE_SIZE = 10;
