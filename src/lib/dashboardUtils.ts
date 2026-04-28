import { ShieldCheck, Cog } from "lucide-react";
import type { ActivityEvent } from "@/types/activity";

export function fmtRelative(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export const ACTION_LABEL: Record<string, string> = {
  "user:created":      "invited",
  "user:updated":      "updated",
  "user:deleted":      "removed",
  "user:suspended":    "suspended",
  "user:reactivated":  "reactivated",
  "user:role_changed": "changed role for",
  "account:created":   "created account",
  "account:updated":   "updated account",
  "account:suspended": "suspended account",
  "account:deleted":   "deleted account",
  "role:created":      "created role",
  "role:updated":      "updated role",
  "role:deleted":      "deleted role",
  "auth:login":        "logged in",
  "auth:logout":       "logged out",
  "settings:updated":  "updated settings",
};

export function activityBadge(action: ActivityEvent["action"]) {
  if (action.includes("delete") || action.includes("suspend"))
    return { label: "Suspend", className: "bg-[#fff1f2] text-[#f43f5e]" };
  if (action.includes("role"))
    return { label: "Role", className: "bg-[#fffbeb] text-[#d97706]" };
  if (action.includes("created") || action.includes("invited"))
    return { label: "Invite", className: "bg-[#eef2ff] text-[#6366f1]" };
  return { label: "System", className: "border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]" };
}

export function activityIcon(action: ActivityEvent["action"]) {
  if (action.startsWith("role")) return ShieldCheck;
  if (action.startsWith("settings")) return Cog;
  return null;
}
