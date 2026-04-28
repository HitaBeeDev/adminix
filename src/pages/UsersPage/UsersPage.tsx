import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import InviteUserModal from "@/components/features/InviteUserModal";
import { useDeleteUser, useUpdateUserInline, useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/stores/toastStore";
import type { User, UserRole, UserStatus } from "@/types/user";
import { USER_ROW_HEIGHT, VIRTUAL_PAGE_SIZE } from "./users.constants";
import type { SortableColumn, SortDirection } from "./users.types";
import { UsersBulkActions } from "./UsersBulkActions";
import { UsersTableFooter } from "./UsersTableFooter";
import { UsersToolbar } from "./UsersToolbar";
import { UsersVirtualTable } from "./UsersVirtualTable";

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const searchInput = searchParams.get("search") ?? "";
  const role = (searchParams.get("role") ?? "") as UserRole | "";
  const status = (searchParams.get("status") ?? "") as UserStatus | "";
  const sortBy = (searchParams.get("sortBy") ?? "name") as SortableColumn;
  const sortDir = (searchParams.get("sortDir") ?? "asc") as SortDirection;
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useUsers({
    search: debouncedSearch,
    role,
    status,
    sortBy,
    sortDir,
    page: 1,
    pageSize: VIRTUAL_PAGE_SIZE,
  });

  const updateUser = useUpdateUserInline();
  const deleteUser = useDeleteUser();
  const users: User[] = data?.data ?? [];

  // TanStack Virtual intentionally returns imperative helpers that React Compiler flags.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => tableScrollRef.current,
    estimateSize: () => USER_ROW_HEIGHT,
    overscan: 12,
    getItemKey: (index) => users[index]?.id ?? index,
  });

  const pageKey = searchParams.toString();
  useEffect(() => {
    setSelected(new Set());
    setExpanded(new Set());
  }, [pageKey]);

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
      setSelected(new Set());
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
      setSelected(new Set());
      toast.success("Selected users suspended.");
    } catch {
      toast.error("Failed to suspend selected users.");
    }
  }

  function toggleAll() {
    setSelected((previous) => {
      const next = new Set(previous);
      if (allLoadedSelected) {
        users.forEach((user) => next.delete(user.id));
      } else {
        users.forEach((user) => next.add(user.id));
      }
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    window.requestAnimationFrame(() => rowVirtualizer.measure());
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
        onClear={() => setSelected(new Set())}
        onDelete={handleBulkDelete}
        onSuspend={handleBulkSuspend}
        selectedCount={selected.size}
        updatePending={updateUser.isPending}
      />
      <UsersVirtualTable
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
        rowVirtualizer={rowVirtualizer}
        scrollRef={tableScrollRef}
        selected={selected}
        someLoadedSelected={someLoadedSelected}
        sortBy={sortBy}
        sortDir={sortDir}
        status={status}
        users={users}
      />
      <UsersTableFooter data={data} rowVirtualizer={rowVirtualizer} users={users} />
    </div>
  );
}
