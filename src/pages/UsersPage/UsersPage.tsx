import { useState } from "react";
import { useSearchParams } from "react-router";
import InviteUserModal from "@/components/features/InviteUserModal";
import { useDeleteUser, useUpdateUserInline, useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/stores/toastStore";
import type { User, UserRole, UserStatus } from "@/types/user";
import { DEFAULT_USER_PAGE_SIZE, USER_PAGE_SIZE_OPTIONS } from "./users.constants";
import type { SortableColumn, SortDirection } from "./users.types";
import { UsersBulkActions } from "./UsersBulkActions";
import { UsersPagination } from "./UsersPagination";
import { UsersTable } from "./UsersTable";
import { UsersTableFooter } from "./UsersTableFooter";
import { UsersToolbar } from "./UsersToolbar";

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [rowState, setRowState] = useState<{
    expanded: Set<string>;
    key: string;
    selected: Set<string>;
  }>({
    expanded: new Set(),
    key: "",
    selected: new Set(),
  });

  const searchInput = searchParams.get("search") ?? "";
  const role = (searchParams.get("role") ?? "") as UserRole | "";
  const status = (searchParams.get("status") ?? "") as UserStatus | "";
  const sortBy = (searchParams.get("sortBy") ?? "name") as SortableColumn;
  const sortDir = (searchParams.get("sortDir") ?? "asc") as SortDirection;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const requestedPageSize = Number(searchParams.get("pageSize") ?? DEFAULT_USER_PAGE_SIZE);
  const pageSize = USER_PAGE_SIZE_OPTIONS.includes(requestedPageSize as (typeof USER_PAGE_SIZE_OPTIONS)[number])
    ? requestedPageSize
    : DEFAULT_USER_PAGE_SIZE;
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useUsers({
    search: debouncedSearch,
    role,
    status,
    sortBy,
    sortDir,
    page,
    pageSize,
  });

  const updateUser = useUpdateUserInline();
  const deleteUser = useDeleteUser();
  const users: User[] = data?.data ?? [];

  const pageKey = searchParams.toString();
  const selected = rowState.key === pageKey ? rowState.selected : new Set<string>();
  const expanded = rowState.key === pageKey ? rowState.expanded : new Set<string>();

  const allLoadedSelected = users.length > 0 && users.every((user) => selected.has(user.id));
  const someLoadedSelected = users.some((user) => selected.has(user.id)) && !allLoadedSelected;

  function handleSearch(value: string) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");
      return next;
    });
  }

  function handlePageChange(nextPage: number) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("page", String(nextPage));
      return next;
    });
  }

  function handlePageSizeChange(nextPageSize: number) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set("pageSize", String(nextPageSize));
      next.delete("page");
      return next;
    });
  }

  function handleFilter(key: "role" | "status", value: string) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      return next;
    });
  }

  function handleSort(column: SortableColumn) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (column === sortBy) {
        next.set("sortDir", sortDir === "asc" ? "desc" : "asc");
      } else {
        next.set("sortBy", column);
        next.set("sortDir", "asc");
      }
      next.delete("page");
      return next;
    });
  }

  async function handleBulkDelete() {
    try {
      await Promise.all([...selected].map((id) => deleteUser.mutateAsync(id)));
      setRowState((current) => ({ ...current, key: pageKey, selected: new Set() }));
      toast.success("Selected users deleted.");
    } catch {
      toast.error("Failed to delete selected users.");
    }
  }

  async function handleBulkSuspend() {
    try {
      await Promise.all(
        [...selected].map((id) => updateUser.mutateAsync({ id, payload: { status: "suspended" } })),
      );
      setRowState((current) => ({ ...current, key: pageKey, selected: new Set() }));
      toast.success("Selected users suspended.");
    } catch {
      toast.error("Failed to suspend selected users.");
    }
  }

  function toggleAll() {
    setRowState((current) => {
      const previous = current.key === pageKey ? current.selected : new Set<string>();
      const next = new Set(previous);
      if (allLoadedSelected) {
        users.forEach((user) => next.delete(user.id));
      } else {
        users.forEach((user) => next.add(user.id));
      }
      return {
        expanded: current.key === pageKey ? current.expanded : new Set(),
        key: pageKey,
        selected: next,
      };
    });
  }

  function toggleOne(id: string) {
    setRowState((current) => {
      const previous = current.key === pageKey ? current.selected : new Set<string>();
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return {
        expanded: current.key === pageKey ? current.expanded : new Set(),
        key: pageKey,
        selected: next,
      };
    });
  }

  function toggleExpanded(id: string) {
    setRowState((current) => {
      const previous = current.key === pageKey ? current.expanded : new Set<string>();
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return {
        expanded: next,
        key: pageKey,
        selected: current.key === pageKey ? current.selected : new Set(),
      };
    });
  }

  return (
    <div className="space-y-6 mt-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#181818]">Users</h1>
      </div>

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <UsersToolbar
        onFilter={handleFilter}
        onInvite={() => setInviteOpen(true)}
        onSearch={handleSearch}
        role={role}
        searchInput={searchInput}
        status={status}
      />
      <UsersBulkActions
        deletePending={deleteUser.isPending}
        onClear={() => setRowState((current) => ({ ...current, key: pageKey, selected: new Set() }))}
        onDelete={handleBulkDelete}
        onSuspend={handleBulkSuspend}
        selectedCount={selected.size}
        updatePending={updateUser.isPending}
      />
      <UsersTable
        allLoadedSelected={allLoadedSelected}
        debouncedSearch={debouncedSearch}
        error={error}
        expanded={expanded}
        isError={isError}
        isLoading={isLoading}
        onClearFilters={() => setSearchParams(new URLSearchParams())}
        onDeleteUser={(id, user) => {
          deleteUser.mutate(id, {
            onSuccess: () => toast.success(`${user.name} deleted.`),
            onError: () => toast.error(`Failed to delete ${user.name}.`),
          });
        }}
        onRetry={() => void refetch()}
        onSort={handleSort}
        onToggleAll={toggleAll}
        onToggleExpanded={toggleExpanded}
        onToggleOne={toggleOne}
        onUpdateUser={(args, user) => {
          updateUser.mutate(args, {
            onSuccess: () => toast.success(`${user.name} updated.`),
            onError: () => toast.error(`Failed to update ${user.name}.`),
          });
        }}
        role={role}
        selected={selected}
        someLoadedSelected={someLoadedSelected}
        sortBy={sortBy}
        sortDir={sortDir}
        status={status}
        users={users}
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <UsersTableFooter data={data} />
        <UsersPagination
          data={data}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
