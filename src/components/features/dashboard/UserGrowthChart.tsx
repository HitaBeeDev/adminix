import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import type { DashboardStats } from "@/api/dashboard";
import { fmtNum } from "@/lib/dashboardUtils";
import SegmentedControl from "./SegmentedControl";
import GrowthTooltip from "./GrowthTooltip";

interface Props {
  data: DashboardStats | undefined;
  isLoading: boolean;
  period: string;
  onPeriodChange: (v: string) => void;
}

export default function UserGrowthChart({ data, isLoading, period, onPeriodChange }: Props) {
  const growthData = (data?.registrationsByMonth ?? []).map((d) => ({
    month: d.month,
    current: d.registrations,
    previous: Math.round(d.registrations * 0.78 + Math.sin(d.registrations) * 40),
  }));

  return (
    <div className="xl:col-span-2 bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-7 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[22px] font-bold tracking-tight text-[#0f172a]">User Growth Trends</h3>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[30px] leading-none font-bold tracking-tight text-[#0f172a]">
              {(data?.kpis.totalUsers ?? 8234).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 h-5 px-2 rounded-full bg-[#ecfdf5] text-[11px] font-medium text-[#059669]">
              ↗ 6.20%
            </span>
          </div>
        </div>
        <SegmentedControl options={["Daily", "Weekly", "Monthly"]} value={period} onChange={onPeriodChange} />
      </div>

      {isLoading ? (
        <div className="h-[300px] rounded-3xl animate-pulse bg-[#f1f5f9]" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={growthData} margin={{ top: 8, right: 0, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeOpacity={1} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8", fillOpacity: 1, dy: 8 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8", fillOpacity: 1 }}
              tickFormatter={fmtNum}
              width={40}
            />
            <Tooltip
              content={<GrowthTooltip />}
              cursor={{ stroke: "#6366f1", strokeOpacity: 0.4, strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#a5b4fc"
              strokeOpacity={0.6}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
              isAnimationActive={false}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#gc1)"
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 5, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
