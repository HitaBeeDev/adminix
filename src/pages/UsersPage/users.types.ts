import type { UserFilters } from "@/types/user";

export type SortableColumn = NonNullable<UserFilters["sortBy"]>;
export type SortDirection = "asc" | "desc";
