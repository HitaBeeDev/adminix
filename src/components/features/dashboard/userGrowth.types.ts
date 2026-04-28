import type { DashboardStats } from "@/api/dashboard";

export interface UserGrowthDataPoint {
  label: string;
  current: number;
  previous: number;
}

export interface UserGrowthPeriodMeta {
  secondKpi: string;
  footerAvgLabel: string;
  rangeLabel: string;
  xInterval: number;
}

export interface UserGrowthStats {
  peak: number;
  avg: number;
  latest: number;
  momPct: string | null;
}

export interface UserGrowthChartProps {
  data: DashboardStats | undefined;
  isLoading: boolean;
  period: string;
  onPeriodChange: (value: string) => void;
}
