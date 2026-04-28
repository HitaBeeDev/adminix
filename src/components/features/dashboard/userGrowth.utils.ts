import { DAILY_DATA, PERIOD_META, WEEKLY_DATA } from "./userGrowth.constants";
import type { UserGrowthDataPoint } from "./userGrowth.types";

export function buildMonthlyGrowthData(
  registrationsByMonth: Array<{ month: string; registrations: number }> = [],
) {
  return registrationsByMonth.map((month) => ({
    label: month.month,
    current: month.registrations,
    previous: Math.max(
      0,
      Math.round(month.registrations * 0.76 + Math.sin(month.registrations * 0.1) * 55),
    ),
  }));
}

export function getUserGrowthChartData(period: string, monthlyData: UserGrowthDataPoint[]) {
  if (period === "Daily") return DAILY_DATA;
  if (period === "Weekly") return WEEKLY_DATA;
  return monthlyData;
}

export function getUserGrowthMeta(period: string) {
  return PERIOD_META[period] ?? PERIOD_META.Monthly;
}

export function getUserGrowthStats(chartData: UserGrowthDataPoint[]) {
  const currentValues = chartData.map((point) => point.current);
  const peak = Math.max(...currentValues, 0);
  const avg = currentValues.length
    ? Math.round(currentValues.reduce((sum, value) => sum + value, 0) / currentValues.length)
    : 0;
  const latest = currentValues[currentValues.length - 1] ?? 0;
  const previous = currentValues[currentValues.length - 2] ?? 0;
  const momPct = previous > 0 ? (((latest - previous) / previous) * 100).toFixed(1) : null;

  return { peak, avg, latest, momPct };
}
