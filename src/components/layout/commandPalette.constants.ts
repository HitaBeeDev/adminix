import {
  Activity,
  Building2,
  FileText,
  LayoutGrid,
  LogOut,
  Moon,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { PaletteItem } from "./commandPalette.types";

export const NAV_ITEMS: PaletteItem[] = [
  { label: "Go to Dashboard", path: "/dashboard", icon: LayoutGrid, kbd: "" },
  { label: "Go to Users", path: "/users", icon: Users, kbd: "" },
  { label: "Go to Accounts", path: "/accounts", icon: Building2, kbd: "" },
  { label: "Go to Activity", path: "/activity", icon: Activity, kbd: "" },
  { label: "Go to Settings", path: "/settings", icon: Settings, kbd: "" },
];

export const ACTION_ITEMS: PaletteItem[] = [
  { label: "Invite user", path: "/users", icon: UserPlus, kbd: "" },
  { label: "Generate report", path: "/reports", icon: FileText, kbd: "" },
  { label: "Toggle theme", path: null, icon: Moon, kbd: "" },
  { label: "Sign out", path: "/login", icon: LogOut, kbd: "" },
];

export const ALL_PALETTE_ITEMS = [...NAV_ITEMS, ...ACTION_ITEMS];
