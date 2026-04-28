import { UserGrowthAreaChart } from "./UserGrowthAreaChart";
import { UserGrowthFooter } from "./UserGrowthFooter";
import { UserGrowthHeader } from "./UserGrowthHeader";
import { UserGrowthLegend } from "./UserGrowthLegend";
import type { UserGrowthChartProps } from "./userGrowth.types";
import {
  buildMonthlyGrowthData,
  getUserGrowthChartData,
  getUserGrowthMeta,
  getUserGrowthStats,
} from "./userGrowth.utils";

export function UserGrowthChart({ data, isLoading, period, onPeriodChange }: UserGrowthChartProps) {
  const monthlyData = buildMonthlyGrowthData(data?.registrationsByMonth);
  const chartData = getUserGrowthChartData(period, monthlyData);
  const meta = getUserGrowthMeta(period);
  const stats = getUserGrowthStats(chartData);
  const totalUsers = data?.kpis.totalUsers ?? 8_234;

  return (
    <div className="xl:col-span-2 bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] pt-5 px-6 pb-5 flex flex-col transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none">
      <UserGrowthHeader
        meta={meta}
        onPeriodChange={onPeriodChange}
        period={period}
        stats={stats}
        totalUsers={totalUsers}
      />
      <UserGrowthLegend />
      <UserGrowthAreaChart avg={stats.avg} chartData={chartData} isLoading={isLoading} meta={meta} />
      <UserGrowthFooter isLoading={isLoading} meta={meta} stats={stats} />
    </div>
  );
}
