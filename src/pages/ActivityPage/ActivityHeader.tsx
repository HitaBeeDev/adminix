interface ActivityHeaderProps {
  isLoading: boolean;
  total: number;
}

export function ActivityHeader({ isLoading, total }: ActivityHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-[#181818]">Activity Log</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {isLoading ? (
          <span className="block h-4 w-20 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : `${total} events`}
      </p>
    </div>
  );
}
