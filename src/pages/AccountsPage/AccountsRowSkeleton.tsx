import { ACCOUNT_GRID_COLUMNS } from "./accounts.constants";

export function AccountsRowSkeleton() {
  return (
    <div
      className="grid border-b border-gray-100 dark:border-gray-800 last:border-b-0"
      style={{ gridTemplateColumns: ACCOUNT_GRID_COLUMNS }}
    >
      {[48, 32, 56, 20, 24, 36].map((width, index) => (
        <div key={index} className="px-3 py-3.5 min-w-0">
          <div
            className="h-3.5 max-w-full rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ width: width * 2 }}
          />
        </div>
      ))}
      <div className="px-3 py-3.5">
        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>
  );
}
