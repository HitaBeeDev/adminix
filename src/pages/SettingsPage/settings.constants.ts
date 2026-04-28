import { Bell, Monitor, Moon, Palette, Shield, Sun, User } from "lucide-react";
import type { ThemeOption } from "@/lib/theme";
import type { NotifGroup, Session } from "./settings.types";

export const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
] as const;

export const settingsFieldClass =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

export const settingsLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

export const settingsErrorClass = "mt-1 text-xs text-rose-500";

export const settingsSectionClass =
  "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6";

export const NOTIF_GROUPS: NotifGroup[] = [
  {
    group: "User Activity",
    items: [
      { key: "user_invite", label: "User invitations", description: "When a new user is invited to the platform" },
      { key: "user_joined", label: "New user joined", description: "When an invitation is accepted" },
      { key: "user_suspended", label: "User suspended", description: "When a user account is suspended" },
    ],
  },
  {
    group: "Account Events",
    items: [
      { key: "account_created", label: "Account created", description: "When a new organization account is added" },
      { key: "account_suspended", label: "Account suspended", description: "When an account is suspended" },
    ],
  },
  {
    group: "Security",
    items: [
      { key: "new_login", label: "New sign-in detected", description: "When your account is accessed from a new device" },
      { key: "password_changed", label: "Password changed", description: "When your password is updated" },
      { key: "role_changed", label: "Role changed", description: "When your role or permissions change" },
    ],
  },
];

export const THEMES: { value: ThemeOption; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "light", label: "Light", icon: Sun, desc: "Classic light background" },
  { value: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
  { value: "system", label: "System", icon: Monitor, desc: "Follow OS preference" },
];

export const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact", desc: "More content, less space" },
  { value: "comfortable", label: "Comfortable", desc: "Balanced spacing (default)" },
  { value: "spacious", label: "Spacious", desc: "More breathing room" },
] as const;

export const MOCK_SESSIONS: Session[] = [
  { id: "s1", device: "Chrome on macOS", location: "San Francisco, CA", ip: "192.168.1.42", lastActive: "Active now", current: true, icon: "desktop" },
  { id: "s2", device: "Safari on iPhone", location: "San Francisco, CA", ip: "192.168.1.55", lastActive: "2h ago", current: false, icon: "mobile" },
  { id: "s3", device: "Firefox on Windows", location: "New York, NY", ip: "203.0.113.12", lastActive: "3 days ago", current: false, icon: "desktop" },
  { id: "s4", device: "Unknown browser", location: "London, UK", ip: "198.51.100.74", lastActive: "12 days ago", current: false, icon: "globe" },
];
