import { useState } from "react";
import { useSearchParams } from "react-router";
import { useActivity } from "@/hooks/useActivity";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "@/stores/toastStore";
import type { ActionType } from "@/types/activity";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityHeader } from "./ActivityHeader";
import { ActivityPagination } from "./ActivityPagination";
import { ActivityTimeline } from "./ActivityTimeline";
import { exportActivityCsv } from "./activity.export";

export function ActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const userId = searchParams.get("userId") ?? "";
  const actionType = searchParams.get("actionType") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const { data, isLoading, isError, error, refetch } = useActivity({
    userId,
    actionType: actionType as ActionType | "",
    dateFrom,
    dateTo,
    page,
    pageSize: 20,
  });
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers({ pageSize: 100 });

  const events = data?.data ?? [];
  const hasFilters = Boolean(userId || actionType || dateFrom || dateTo);

  function setParam(key: string, value: string | null) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }

  function handleFilter(key: string, value: string) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page");
      return next;
    });
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams());
  }

  async function handleExport() {
    setIsExporting(true);

    try {
      const count = await exportActivityCsv({
        userId,
        actionType: actionType as ActionType | "",
        dateFrom,
        dateTo,
      });
      toast.success(`Exported ${count} event${count === 1 ? "" : "s"}.`);
    } catch {
      toast.error("Failed to export activity.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <ActivityHeader
        isExporting={isExporting}
        isLoading={isLoading}
        onExport={() => void handleExport()}
        total={data?.total ?? 0}
      />
      <ActivityFilters
        actionType={actionType}
        dateFrom={dateFrom}
        dateTo={dateTo}
        hasFilters={hasFilters}
        isUsersError={isUsersError}
        isUsersLoading={isUsersLoading}
        onClearFilters={clearFilters}
        onFilterChange={handleFilter}
        onRetryUsers={() => void refetchUsers()}
        userId={userId}
        users={usersData?.data ?? []}
        usersError={usersError}
      />
      <ActivityTimeline
        error={error}
        events={events}
        hasFilters={hasFilters}
        isError={isError}
        isLoading={isLoading}
        onClearFilters={clearFilters}
        onRetry={() => void refetch()}
      />
      <ActivityPagination data={data} onPageChange={(nextPage) => setParam("page", String(nextPage))} />
    </div>
  );
}
