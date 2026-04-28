import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";
import type { DashboardStats } from "@/api/dashboard";
import { fmtNum } from "@/lib/dashboardUtils";
import SegmentedControl from "./SegmentedControl";
import GrowthTooltip from "./GrowthTooltip";

interface DataPoint { label: string; current: number; previous: number }

const DAILY_DATA: DataPoint[] = [
  { label: "Apr 1",  current: 34, previous: 27 },
  { label: "Apr 2",  current: 41, previous: 33 },
  { label: "Apr 3",  current: 38, previous: 30 },
  { label: "Apr 4",  current: 22, previous: 18 },
  { label: "Apr 5",  current: 18, previous: 15 },
  { label: "Apr 6",  current: 37, previous: 29 },
  { label: "Apr 7",  current: 44, previous: 35 },
  { label: "Apr 8",  current: 39, previous: 31 },
  { label: "Apr 9",  current: 46, previous: 37 },
  { label: "Apr 10", current: 42, previous: 34 },
  { label: "Apr 11", current: 19, previous: 16 },
  { label: "Apr 12", current: 16, previous: 13 },
  { label: "Apr 13", current: 41, previous: 33 },
  { label: "Apr 14", current: 48, previous: 38 },
  { label: "Apr 15", current: 45, previous: 36 },
  { label: "Apr 16", current: 51, previous: 41 },
  { label: "Apr 17", current: 47, previous: 38 },
  { label: "Apr 18", current: 21, previous: 17 },
  { label: "Apr 19", current: 17, previous: 14 },
  { label: "Apr 20", current: 44, previous: 35 },
  { label: "Apr 21", current: 52, previous: 42 },
  { label: "Apr 22", current: 49, previous: 39 },
  { label: "Apr 23", current: 55, previous: 44 },
  { label: "Apr 24", current: 50, previous: 40 },
  { label: "Apr 25", current: 23, previous: 18 },
  { label: "Apr 26", current: 19, previous: 15 },
  { label: "Apr 27", current: 47, previous: 38 },
  { label: "Apr 28", current: 54, previous: 43 },
  { label: "Apr 29", current: 51, previous: 41 },
  { label: "Apr 30", current: 58, previous: 46 },
];

const WEEKLY_DATA: DataPoint[] = [
  { label: "W1",  current: 182, previous: 148 },
  { label: "W2",  current: 201, previous: 163 },
  { label: "W3",  current: 195, previous: 158 },
  { label: "W4",  current: 218, previous: 177 },
  { label: "W5",  current: 234, previous: 190 },
  { label: "W6",  current: 221, previous: 179 },
  { label: "W7",  current: 248, previous: 201 },
  { label: "W8",  current: 241, previous: 195 },
  { label: "W9",  current: 263, previous: 213 },
  { label: "W10", current: 258, previous: 209 },
  { label: "W11", current: 274, previous: 222 },
  { label: "W12", current: 291, previous: 236 },
];

const PERIOD_META: Record<string, {
  secondKpi: string;
  footerAvgLabel: string;
  rangeLabel: string;
  xInterval: number;
}> = {
  Monthly: { secondKpi: "This Month",  footerAvgLabel: "Monthly Avg", rangeLabel: "12 months", xInterval: 0 },
  Weekly:  { secondKpi: "This Week",   footerAvgLabel: "Weekly Avg",  rangeLabel: "12 weeks",  xInterval: 1 },
  Daily:   { secondKpi: "Today",       footerAvgLabel: "Daily Avg",   rangeLabel: "30 days",   xInterval: 4 },
};

interface Props {
  data: DashboardStats | undefined;
  isLoading: boolean;
  period: string;
  onPeriodChange: (v: string) => void;
}

export default function UserGrowthChart({ data, isLoading, period, onPeriodChange }: Props) {
  const monthlyData: DataPoint[] = (data?.registrationsByMonth ?? []).map((d) => ({
    label: d.month,
    current: d.registrations,
    previous: Math.max(0, Math.round(d.registrations * 0.76 + Math.sin(d.registrations * 0.1) * 55)),
  }));

  const chartData = period === "Daily" ? DAILY_DATA : period === "Weekly" ? WEEKLY_DATA : monthlyData;
  const meta = PERIOD_META[period] ?? PERIOD_META.Monthly;

  const currentValues = chartData.map((d) => d.current);
  const peak    = Math.max(...currentValues, 0);
  const avg     = currentValues.length ? Math.round(currentValues.reduce((a, b) => a + b, 0) / currentValues.length) : 0;
  const latest  = currentValues[currentValues.length - 1] ?? 0;
  const prev    = currentValues[currentValues.length - 2] ?? 0;
  const momPct  = prev > 0 ? (((latest - prev) / prev) * 100).toFixed(1) : null;

  return (
    <div className="xl:col-span-2 bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] pt-5 px-6 pb-5 flex flex-col transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-6">
          <div>
            <p className="text-[0.7rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Total Users</p>
            <div className="flex items-end gap-2">
              <span className="text-[2rem] leading-none font-[700] tracking-tight text-[#0f172a]">
                {(data?.kpis.totalUsers ?? 8_234).toLocaleString()}
              </span>
              <span className="inline-flex items-center h-[1.375rem] px-2 rounded-full bg-[#ecfdf5] text-[0.6rem] font-bold text-[#059669] mb-0.5 tracking-wide">
                ↗ 6.2%
              </span>
            </div>
          </div>

          <div className="w-px self-stretch bg-[#e2e8f0] mx-1" />

          <div>
            <p className="text-[0.7rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">
              {meta.secondKpi}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-[2rem] leading-none font-[700] tracking-tight text-[#0f172a]">
                {latest.toLocaleString()}
              </span>
              {momPct && (
                <span className="inline-flex items-center h-[1.375rem] px-2 rounded-full bg-[#eef2ff] text-[0.6rem] font-bold text-[#6366f1] mb-0.5 tracking-wide">
                  ↗ {momPct}%
                </span>
              )}
            </div>
          </div>
        </div>

        <SegmentedControl
          options={["Daily", "Weekly", "Monthly"]}
          value={period}
          onChange={onPeriodChange}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-[2px] rounded-full bg-[#6366f1] inline-block" />
          <span className="text-[0.7rem] text-[#64748b] font-medium">Current period</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="22" height="2" viewBox="0 0 22 2" fill="none">
            <line x1="0" y1="1" x2="22" y2="1" stroke="#c7d2fe" strokeWidth="2" strokeDasharray="5 3" />
          </svg>
          <span className="text-[0.7rem] text-[#94a3b8] font-medium">Previous period</span>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="h-[220px] rounded-[1.2rem] animate-pulse bg-[#f1f5f9]" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 6, right: 2, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.45} />
                <stop offset="55%"  stopColor="#6366f1" stopOpacity={0.12} />
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

            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeOpacity={1} />

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
              label={{ value: `avg ${fmtNum(avg)}`, position: "insideTopRight", fontSize: 10, fill: "#94a3b8", dy: -4 }}
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
      )}

      {/* Footer stats */}
      {!isLoading && (
        <div className="flex items-center gap-8 mt-4 pt-4 border-t border-[#f1f5f9]">
          <div>
            <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-0.5">Peak</p>
            <p className="text-[0.875rem] font-[700] text-[#0f172a] tabular-nums">{peak.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-0.5">{meta.footerAvgLabel}</p>
            <p className="text-[0.875rem] font-[700] text-[#0f172a] tabular-nums">{avg.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-0.5">Latest</p>
            <p className="text-[0.875rem] font-[700] text-[#0f172a] tabular-nums">{latest.toLocaleString()}</p>
          </div>
          <p className="ml-auto text-[0.7rem] text-[#c8d3df]">{meta.rangeLabel}</p>
        </div>
      )}
    </div>
  );
}
