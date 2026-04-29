export function AccountDetailSkeleton() {
  return (
    <div className="mt-4 space-y-5 animate-pulse">
      <div className="h-4 w-44 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
