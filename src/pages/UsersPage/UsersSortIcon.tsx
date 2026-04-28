import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { SortableColumn, SortDirection } from "./users.types";

interface UsersSortIconProps {
  col: SortableColumn;
  sortBy: SortableColumn;
  sortDir: SortDirection;
}

export function UsersSortIcon({ col, sortBy, sortDir }: UsersSortIconProps) {
  if (col !== sortBy) {
    return <ChevronsUpDown size={13} className="text-gray-300 dark:text-gray-600" />;
  }

  return sortDir === "asc" ? (
    <ChevronUp size={13} className="text-indigo-500" />
  ) : (
    <ChevronDown size={13} className="text-indigo-500" />
  );
}
