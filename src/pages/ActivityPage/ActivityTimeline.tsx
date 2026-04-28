import { ClipboardList } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";
import { ActivityEventRow } from "./ActivityEventRow";
import { ActivityRowSkeleton } from "./ActivityRowSkeleton";
import type { ActivityEvent } from "@/types/activity";

interface ActivityTimelineProps {
  error: unknown;
  events: ActivityEvent[];
  hasFilters: boolean;
  isError: boolean;
  isLoading: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
}

export function ActivityTimeline({
  error,
  events,
  hasFilters,
  isError,
  isLoading,
  onClearFilters,
  onRetry,
}: ActivityTimelineProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => <ActivityRowSkeleton key={index} />)
      ) : isError ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : events.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <ClipboardList size={22} />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No events found</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {hasFilters ? "Try adjusting your filters" : "Activity will appear here as users take actions"}
          </p>
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {events.map((event) => (
            <ActivityEventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
