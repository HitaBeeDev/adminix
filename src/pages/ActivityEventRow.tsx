import { ACTION_LABEL } from "./activity.constants";
import { dotColor, formatActivityDate, formatActivityRelative } from "./activity.utils";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/types/activity";

interface ActivityEventRowProps {
  event: ActivityEvent;
}

export function ActivityEventRow({ event }: ActivityEventRowProps) {
  return (
    <div className="flex gap-4 py-4 first:pt-0">
      <div className="flex flex-col items-center">
        <span className={cn("w-2.5 h-2.5 rounded-full shrink-0 mt-1", dotColor(event.action))} />
        <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 mt-2" />
      </div>

      <div className="flex-1 min-w-0 pb-2">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <span className="font-medium">{event.actorName}</span>{" "}
          <span className="text-gray-500 dark:text-gray-400">{ACTION_LABEL[event.action] ?? event.action}</span>
          {event.targetName && <> <span className="font-medium">{event.targetName}</span></>}
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-gray-400 dark:text-gray-500">{event.actorEmail}</span>
          {event.ipAddress && (
            <span className="text-xs text-gray-300 dark:text-gray-600 font-mono">{event.ipAddress}</span>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatActivityRelative(event.timestamp)}</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{formatActivityDate(event.timestamp)}</p>
      </div>
    </div>
  );
}
