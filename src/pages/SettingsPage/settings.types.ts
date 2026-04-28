import type { TABS } from "./settings.constants";

export type TabId = (typeof TABS)[number]["id"];

export interface NotifGroup {
  group: string;
  items: { key: string; label: string; description: string }[];
}

export interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  icon: "desktop" | "mobile" | "globe";
}
