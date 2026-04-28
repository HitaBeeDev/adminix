export function UserDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-40 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-4 w-52 rounded bg-gray-100 dark:bg-gray-800" />
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
