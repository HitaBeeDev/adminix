import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtNum } from "@/lib/dashboardUtils";
import GrowthTooltip from "./GrowthTooltip";
import type { UserGrowthDataPoint, UserGrowthPeriodMeta } from "./userGrowth.types";

interface UserGrowthAreaChartProps {
  avg: number;
  chartData: UserGrowthDataPoint[];
  isLoading: boolean;
  meta: UserGrowthPeriodMeta;
}

export function UserGrowthAreaChart({ avg, chartData, isLoading, meta }: UserGrowthAreaChartProps) {
  if (isLoading) {
    return <div className="h-[220px] rounded-[1.2rem] animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 6, right: 2, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
            <stop offset="55%" stopColor="#6366f1" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" strokeOpacity={1} />

        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: "0.6875rem", fill: "#94a3b8", dy: 8 }}
          interval={meta.xInterval}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: "0.6875rem", fill: "#94a3b8" }}
          tickFormatter={fmtNum}
          width={34}
          domain={[0, "auto"]}
        />

        <Tooltip
          content={<GrowthTooltip />}
          cursor={{ stroke: "#6366f1", strokeOpacity: 0.15, strokeWidth: 1 }}
        />

        <ReferenceLine
          y={avg}
          stroke="#cbd5e1"
          strokeDasharray="4 4"
          strokeWidth={1}
          label={{
            value: `avg ${fmtNum(avg)}`,
            position: "insideTopRight",
            fontSize: 10,
            fill: "#94a3b8",
            dy: -4,
          }}
        />

        <Area
          type="monotone"
          dataKey="previous"
          stroke="#c7d2fe"
          strokeOpacity={0.9}
          strokeWidth={1.5}
          strokeDasharray="5 3"
          fill="none"
          isAnimationActive={false}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="current"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#gc1)"
          isAnimationActive={false}
          dot={false}
          activeDot={{ r: 5, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2.5, filter: "url(#dot-glow)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
