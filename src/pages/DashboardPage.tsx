import { useState } from "react";
import { Users, UserCheck, Star, Repeat } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import ErrorState from "@/components/ui/ErrorState";
import KpiCard from "@/components/features/dashboard/KpiCard";
import UserGrowthChart from "@/components/features/dashboard/UserGrowthChart";
import RoleDistributionChart from "@/components/features/dashboard/RoleDistributionChart";
import AccountStatusChart from "@/components/features/dashboard/AccountStatusChart";
import ActivityFeed from "@/components/features/dashboard/ActivityFeed";
import QuickActions from "@/components/features/dashboard/QuickActions";

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();
  const [period, setPeriod] = useState("Monthly");

  const months = data?.registrationsByMonth ?? [];
  const currentMonthReg = months[months.length - 1]?.registrations ?? 0;
  const prevMonthReg = months[months.length - 2]?.registrations ?? 0;
  const regGrowthPct = prevMonthReg > 0
    ? Math.abs(((currentMonthReg - prevMonthReg) / prevMonthReg) * 100).toFixed(1)
    : "0";
  const regGrowthUp = currentMonthReg >= prevMonthReg;

  const retentionPct = data
    ? Math.round((data.kpis.activeAccounts / data.kpis.totalAccounts) * 100)
    : undefined;

  return (
    <div className="space-y-7 pt-1 lg:pt-2">
      {isError && (
        <div className="rounded-3xl border border-[#e2e8f0] bg-[#ffffff]">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      )}

      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard
            label="Total Users"
            value={data?.kpis.totalUsers}
            description="All registered users"
            trend={{ pct: `${regGrowthPct}%`, up: regGrowthUp }}
            icon={Users}
            iconClassName="bg-[#eef2ff] text-[#6366f1]"
            to="/users"
            loading={isLoading}
          />
          <KpiCard
            label="New This Month"
            value={data?.kpis.newThisMonth}
            description="Registrations this month"
            trend={{ pct: `${regGrowthPct}%`, up: regGrowthUp }}
            icon={UserCheck}
            iconClassName="bg-[#eef2ff] text-[#6366f1]"
            to="/users"
            loading={isLoading}
          />
          <KpiCard
            label="Avg. Session Rating"
            value={data?.kpis.sessionRating}
            description="Recent session score"
            trend={{ pct: "0.3%", up: true }}
            icon={Star}
            iconClassName="bg-[#fffbeb] text-[#f59e0b]"
            to="/reports"
            loading={isLoading}
          />
          <KpiCard
            label="Account Retention"
            value={retentionPct}
            description={`${data?.kpis.activeAccounts ?? 0} of ${data?.kpis.totalAccounts ?? 0} accounts active`}
            trend={{ pct: `${retentionPct ?? 0}%`, up: true }}
            icon={Repeat}
            iconClassName="bg-[#ecfdf5] text-[#059669]"
            to="/accounts"
            loading={isLoading}
          />
        </div>
      )}

      {!isError && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <UserGrowthChart data={data} isLoading={isLoading} period={period} onPeriodChange={setPeriod} />
          <RoleDistributionChart data={data} isLoading={isLoading} />
        </div>
      )}

      {!isError && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AccountStatusChart data={data} isLoading={isLoading} />
          <ActivityFeed data={data} isLoading={isLoading} />
        </div>
      )}

      {!isError && <QuickActions />}
    </div>
  );
}
