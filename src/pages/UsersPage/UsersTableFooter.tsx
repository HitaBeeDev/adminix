import type { PaginatedUsers } from "@/types/user";

interface UsersTableFooterProps {
  data: PaginatedUsers | undefined;
}

export function UsersTableFooter({ data }: UsersTableFooterProps) {
  if (!data) return null;

  const start = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const end = Math.min(data.page * data.pageSize, data.total);

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      <span>
        Showing {start.toLocaleString()}-{end.toLocaleString()} of {data.total.toLocaleString()} users
      </span>
    </div>
  );
}
