import type { TopbarNotification } from "./topbar.types";

export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  accounts: "Accounts",
  roles: "Roles",
  activity: "Activity",
  reports: "Reports",
  settings: "Settings",
};

export const INITIAL_NOTIFICATIONS: TopbarNotification[] = [
  {
    id: 1,
    title: "New user registered",
    description: "sarah.k@example.com joined as Viewer",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    title: "Account suspended",
    description: "Acme Corp account was suspended",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    title: "Role updated",
    description: "Manager permissions were changed",
    time: "3h ago",
    read: false,
  },
  {
    id: 4,
    title: "User deleted",
    description: "john.doe@example.com was removed",
    time: "5h ago",
    read: true,
  },
];
