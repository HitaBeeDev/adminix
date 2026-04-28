export function ActivityRowSkeleton() {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 mt-2" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-64 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-3 w-40 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
      <div className="shrink-0 space-y-1.5">
        <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>
  );
}
