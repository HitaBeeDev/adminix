import { TABS } from "./settings.constants";
import type { TabId } from "./settings.types";

export function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getInitialSettingsTab() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab") as TabId | null;

  return tab && TABS.some((item) => item.id === tab) ? tab : "profile";
}
