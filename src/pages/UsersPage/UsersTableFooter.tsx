import type { Virtualizer } from "@tanstack/react-virtual";
import type { PaginatedUsers, User } from "@/types/user";

interface UsersTableFooterProps {
  data: PaginatedUsers | undefined;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  users: User[];
}

export function UsersTableFooter({ data, rowVirtualizer, users }: UsersTableFooterProps) {
  if (!data) return null;

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>
        Showing {users.length.toLocaleString()} of {data.total.toLocaleString()} users
      </span>
      <span>
        Rendering {rowVirtualizer.getVirtualItems().length.toLocaleString()} visible rows
      </span>
    </div>
  );
}
