export function RolesMatrixSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-4 items-center">
          <div className="h-3.5 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          {Array.from({ length: 4 }).map((_, itemIndex) => (
            <div key={itemIndex} className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ))}
    </div>
  );
}
