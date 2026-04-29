import { useState } from "react";
import { useSearchParams } from "react-router";
import CreateAccountModal from "@/components/features/CreateAccountModal";
import { useAccounts, useUpdateAccountInline } from "@/hooks/useAccounts";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/stores/toastStore";
import type { Account, AccountPlan, AccountStatus } from "@/types/account";
import { ACCOUNT_PAGE_SIZE_OPTIONS, DEFAULT_ACCOUNT_PAGE_SIZE } from "./accounts.constants";
import { AccountsHeader } from "./AccountsHeader";
import { AccountsPagination } from "./AccountsPagination";
import { AccountsTable } from "./AccountsTable";
import { AccountsToolbar } from "./AccountsToolbar";

export function AccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  const searchInput = searchParams.get("search") ?? "";
  const plan = (searchParams.get("plan") ?? "") as AccountPlan | "";
  const status = (searchParams.get("status") ?? "") as AccountStatus | "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const requestedPageSize = Number(searchParams.get("pageSize") ?? DEFAULT_ACCOUNT_PAGE_SIZE);
  const pageSize = ACCOUNT_PAGE_SIZE_OPTIONS.includes(requestedPageSize as (typeof ACCOUNT_PAGE_SIZE_OPTIONS)[number])
    ? requestedPageSize
    : DEFAULT_ACCOUNT_PAGE_SIZE;
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useAccounts({
    search: debouncedSearch,
    plan,
    status,
    page,
    pageSize,
  });

  const updateAccount = useUpdateAccountInline();
  const accounts = data?.data ?? [];
  const hasFilters = Boolean(debouncedSearch || plan || status);

  function setParam(key: string, value: string | null) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }

  function handleSearch(value: string | null) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("page");
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

  function handleFilter(key: "plan" | "status", value: string) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      return next;
    });
  }

  async function handleToggleSuspend(account: Account) {
    const newStatus = account.status === "suspended" ? "active" : "suspended";

    try {
      await updateAccount.mutateAsync({ id: account.id, payload: { status: newStatus } });
      toast.success(`"${account.name}" ${newStatus === "suspended" ? "suspended" : "reactivated"}.`);
    } catch {
      toast.error("Failed to update account.");
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <AccountsHeader />
      <CreateAccountModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <AccountsToolbar
        onFilterChange={handleFilter}
        onCreateAccount={() => setCreateOpen(true)}
        onSearchChange={handleSearch}
        plan={plan}
        searchInput={searchInput}
        status={status}
      />
      <AccountsTable
        accounts={accounts}
        debouncedSearch={debouncedSearch}
        error={error}
        hasFilters={hasFilters}
        isError={isError}
        isLoading={isLoading}
        onClearFilters={() => setSearchParams(new URLSearchParams())}
        onRetry={() => void refetch()}
        onToggleSuspend={handleToggleSuspend}
      />
      <AccountsPagination
        data={data}
        onPageChange={(nextPage) => setParam("page", String(nextPage))}
        onPageSizeChange={handlePageSizeChange}
        pageSize={pageSize}
      />
    </div>
  );
}
