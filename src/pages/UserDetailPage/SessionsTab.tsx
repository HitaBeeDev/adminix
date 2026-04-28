import { useState } from "react";
import { Globe, Monitor, Smartphone } from "lucide-react";
import { toast } from "@/stores/toastStore";
import { fmtRelative, buildMockSessions } from "./userDetail.utils";
import type { SessionIcon } from "./userDetail.types";
import { useUserDetailContext } from "./UserDetailContext";

function SessionDeviceIcon({ type }: { type: SessionIcon }) {
  if (type === "mobile") return <Smartphone size={15} className="text-gray-500 dark:text-gray-400" />;
  if (type === "globe") return <Globe size={15} className="text-gray-500 dark:text-gray-400" />;
  return <Monitor size={15} className="text-gray-500 dark:text-gray-400" />;
}

export function SessionsTab() {
  const { user } = useUserDetailContext();
  const [sessions, setSessions] = useState(() => buildMockSessions(user));
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function revokeSession(id: string) {
    setRevokingId(id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSessions((current) => current.filter((session) => session.id !== id));
    setRevokingId(null);
    toast.success("Session revoked.");
  }

  if (user.status === "suspended") {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818] mb-5">Active Sessions</h2>
        <div className="py-10 flex flex-col items-center gap-2 text-center">
          <Monitor size={24} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No active sessions</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">This account is suspended.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818]">Active Sessions</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Devices currently signed in</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={() => {
              setSessions((current) => current.filter((session) => session.current));
              toast.success("All other sessions revoked.");
            }}
            className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition"
          >
            Revoke all others
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2 text-center">
          <Monitor size={24} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">All sessions have been revoked.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <SessionDeviceIcon type={session.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{session.device}</p>
                  {session.current && (
                    <span className="text-[0.625rem] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                  {session.location} - {session.ip} - {fmtRelative(session.lastActive)}
                </p>
              </div>
              {!session.current && (
                <button
                  onClick={() => void revokeSession(session.id)}
                  disabled={revokingId === session.id}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition disabled:opacity-50 shrink-0"
                >
                  {revokingId === session.id ? "Revoking..." : "Revoke"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
