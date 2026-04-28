import { Link } from "react-router";
import { Clock } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";
import { useActivity } from "@/hooks/useActivity";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/types/activity";
import { ACTION_LABELS, DOT_COLORS } from "./userDetail.constants";
import { fmt, fmtRelative } from "./userDetail.utils";
import { useUserDetailContext } from "./UserDetailContext";

function ActivityItem({ event }: { event: ActivityEvent }) {
  const dot = DOT_COLORS[event.action] ?? "bg-indigo-500";

  return (
    <div className="flex gap-3 py-3 first:pt-0">
      <div className="flex flex-col items-center pt-1">
        <span className={cn("w-2 h-2 rounded-full shrink-0", dot)} />
        <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 mt-1.5" />
      </div>
      <div className="flex-1 min-w-0 pb-1">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          {ACTION_LABELS[event.action] ?? event.action}
          {event.targetName && <> - <span className="font-medium">{event.targetName}</span></>}
        </p>
        {event.ipAddress && (
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{event.ipAddress}</span>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-400 dark:text-gray-500">{fmtRelative(event.timestamp)}</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{fmt(event.timestamp)}</p>
      </div>
    </div>
  );
}

export function ActivityTab() {
  const { user } = useUserDetailContext();
  const userId = user.id;
  const { data, isLoading, isError, error, refetch } = useActivity({ userId, page: 1, pageSize: 10 });
  const events = data?.data ?? [];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818]">Recent Activity</h2>
        <Link to={`/activity?userId=${userId}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          View all →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800 mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-56 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} className="py-12" />
      ) : events.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-2 text-center">
          <Clock size={28} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No activity recorded yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {events.map((event) => (
            <ActivityItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
