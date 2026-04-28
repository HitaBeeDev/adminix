import type { USER_DETAIL_TABS } from "./userDetail.constants";

export type UserDetailTab = (typeof USER_DETAIL_TABS)[number]["key"];

export type SessionIcon = "desktop" | "mobile" | "globe";

export interface MockSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  icon: SessionIcon;
}
