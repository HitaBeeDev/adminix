interface ReportsHeaderProps {
  filteredCount: number;
  isLoading: boolean;
  totalCount: number;
}

export function ReportsHeader({ filteredCount, isLoading, totalCount }: ReportsHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {isLoading ? (
          <span className="block h-4 w-28 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : `${filteredCount} of ${totalCount} reports`}
      </p>
    </div>
  );
}
