import type { User } from "@/types/user";
import type { MockSession } from "./userDetail.types";

export function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildMockSessions(user: User): MockSession[] {
  return [
    {
      id: `${user.id}-s1`,
      device: "Chrome on macOS",
      location: "San Francisco, CA",
      ip: user.lastIp ?? "192.168.1.42",
      lastActive: user.lastActive,
      current: true,
      icon: "desktop",
    },
    {
      id: `${user.id}-s2`,
      device: "Safari on iPhone",
      location: "San Francisco, CA",
      ip: "192.168.1.55",
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current: false,
      icon: "mobile",
    },
    {
      id: `${user.id}-s3`,
      device: "Firefox on Windows",
      location: "New York, NY",
      ip: "203.0.113.12",
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      current: false,
      icon: "desktop",
    },
  ];
}
