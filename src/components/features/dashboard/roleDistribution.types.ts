import type { ROLE_COLORS } from "./roleDistribution.constants";

export type RoleColor = (typeof ROLE_COLORS)[number];

export interface RoleDistributionDatum {
  name: string;
  value: number;
  pct: number;
  color: RoleColor;
}

export interface RoleDistributionChartProps {
  data:
    | {
        usersByRole?: Array<{ role: string; count: number }>;
      }
    | undefined;
  isLoading: boolean;
}

export interface RoleDistributionBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  value?: number;
}
