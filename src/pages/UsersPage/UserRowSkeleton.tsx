import { USER_GRID_COLUMNS } from "./users.constants";

export function UserRowSkeleton() {
  return (
    <div
      className="grid border-b border-gray-100 dark:border-gray-800 last:border-b-0"
      style={{ gridTemplateColumns: USER_GRID_COLUMNS }}
    >
      <div className="pl-4 pr-2 py-3">
        <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
      {[40, 56, 24, 20, 32].map((width, index) => (
        <div key={index} className="px-3 py-3 min-w-0">
          <div
            className="h-3.5 max-w-full rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ width: `${width * 2}px` }}
          />
        </div>
      ))}
      <div className="px-3 py-3">
        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>
  );
}
