import { PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, MoreHorizontal, ShieldCheck } from "lucide-react";
import type { DashboardStats } from "@/api/dashboard";
import { ROLE_COLORS } from "./roleDistribution.constants";

const STATUS_COLORS: Record<string, { bar: string; chipBg: string; chipText: string }> = {
  Active: {
    bar: ROLE_COLORS[3].bar,
    chipBg: ROLE_COLORS[3].bg,
    chipText: ROLE_COLORS[3].text,
  },
  Pending: {
    bar: ROLE_COLORS[2].bar,
    chipBg: ROLE_COLORS[2].bg,
    chipText: ROLE_COLORS[2].text,
  },
  Suspended: {
    bar: ROLE_COLORS[4].bar,
    chipBg: ROLE_COLORS[4].bg,
    chipText: ROLE_COLORS[4].text,
  },
  Invited: {
    bar: ROLE_COLORS[3].bar,
    chipBg: ROLE_COLORS[3].bg,
    chipText: ROLE_COLORS[3].text,
  },
};
const FALLBACK_COLOR = { bar: "#94a3b8", chipBg: "#f8fafc", chipText: "#64748b" };

const MOCK_TRENDS: Record<string, { up: boolean; pct: string }> = {
  Active:    { up: true,  pct: "2.1" },
  Pending:   { up: false, pct: "0.4" },
  Suspended: { up: true,  pct: "1.8" },
};

const FALLBACK_STATUS = [
  { name: "Active",    value: 5176 },
  { name: "Pending",   value: 1134 },
  { name: "Suspended", value: 768  },
];

function getColor(name: string) {
  return STATUS_COLORS[name] ?? FALLBACK_COLOR;
}

function getTrend(name: string) {
  return MOCK_TRENDS[name] ?? { up: true, pct: "0.0" };
}

interface Props {
  data: DashboardStats | undefined;
  isLoading: boolean;
}

export default function AccountStatusChart({ data, isLoading }: Props) {
  const statusData = data?.usersByStatus?.length
    ? data.usersByStatus.map((d) => ({
        name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
        value: d.count,
      }))
    : FALLBACK_STATUS;

  const total = statusData.reduce((s, d) => s + d.value, 0);
  const sorted = [...statusData].sort((a, b) => b.value - a.value);
  const dominant = sorted[0];

  const atRisk = statusData
    .filter((d) => d.name === "Pending" || d.name === "Suspended")
    .reduce((s, d) => s + d.value, 0);
  const atRiskPct = total > 0 ? Math.round((atRisk / total) * 100) : 0;

  const totalLabel = total >= 1000 ? `${(total / 1000).toFixed(1)}k` : String(total);
  const maxValue = sorted[0]?.value ?? 1;

  return (
    <div className="bg-white rounded-[1.25rem] border border-[#e2e8f0] p-5 flex flex-col transition-all duration-200 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(15,23,42,0.13)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[#0f172a] dark:text-white leading-snug">
            Account Status
          </h3>
          <p className="text-[0.75rem] text-[#94a3b8] mt-0.5">User account health</p>
        </div>
        <button
          type="button"
          aria-label="Account status options"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors dark:hover:bg-[#1e293b] dark:hover:text-white"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-5">
            <div className="h-[150px] w-[150px] shrink-0 rounded-full animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
            <div className="flex-1 flex flex-col gap-4 justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
                    <div className="h-3 w-10 rounded animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
                  </div>
                  <div className="h-1.5 w-full rounded-full animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-[#f1f5f9] pt-4 dark:border-[#1e293b]">
            <div className="h-16 rounded-xl animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
            <div className="h-16 rounded-xl animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
          </div>
        </div>
      ) : (
        <>
          {/* ── Donut chart + status summary ── */}
          <div className="mt-4 flex flex-1 flex-col justify-center">
            <div className="flex flex-col items-center gap-5">
              <div className="relative h-[170px] w-[170px] shrink-0">
                <PieChart width={170} height={170}>
                  <Pie
                    data={sorted}
                    cx={85}
                    cy={85}
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {sorted.map((d) => (
                      <Cell key={d.name} fill={getColor(d.name).bar} />
                    ))}
                  </Pie>
                  <text
                    x={85}
                    y={85}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-[#0f172a] text-[1.5rem] font-[800] tabular-nums dark:fill-white"
                  >
                    {totalLabel}
                  </text>
                </PieChart>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-3.5">
                {sorted.map((d) => {
                  const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                  const { bar, chipBg, chipText } = getColor(d.name);
                  const trend = getTrend(d.name);
                  const TrendIcon = trend.up ? ArrowUpRight : ArrowDownRight;

                  return (
                    <div key={d.name} className="min-w-0">
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: bar }} />
                          <span className="text-[0.73rem] font-medium text-[#64748b] dark:text-[#94a3b8] leading-none truncate">
                            {d.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[0.73rem] font-bold text-[#1e293b] dark:text-white tabular-nums">
                            {d.value.toLocaleString()}
                          </span>
                          <span
                            className="inline-flex h-4 items-center justify-center gap-0.5 rounded-full px-1.5 text-[0.6rem] font-semibold tabular-nums"
                            style={{
                              background: trend.up ? "#ecfdf5" : "#fff1f2",
                              color:      trend.up ? "#059669" : "#f43f5e",
                            }}
                          >
                            <TrendIcon size={9} strokeWidth={2.5} />
                            {trend.pct}%
                          </span>
                          <span
                            className="w-[2.25rem] rounded-full px-1.5 py-0.5 text-center text-[0.6rem] font-semibold tabular-nums leading-none"
                            style={{ background: chipBg, color: chipText }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#f1f5f9] dark:bg-[#1e293b] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${(d.value / maxValue) * 100}%`, background: bar, opacity: 0.85 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Insight grid — pinned to bottom ── */}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#f1f5f9] pt-4 dark:border-[#1e293b]">
            {dominant && (
              <div
                className="rounded-xl px-3 py-2.5"
                style={{ background: getColor(dominant.name).bar + "0f" }}
              >
                <div className="flex items-center gap-1 mb-1.5">
                  <ShieldCheck size={9} style={{ color: getColor(dominant.name).bar }} />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8]">
                    Dominant
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: getColor(dominant.name).bar }} />
                  <span className="text-[0.8125rem] font-bold text-[#0f172a] dark:text-white leading-none">
                    {dominant.name}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-xl px-3 py-2.5 bg-[#f8fafc] dark:bg-[#1e293b]">
              <div className="flex items-center gap-1 mb-1.5">
                <AlertTriangle size={9} className="text-[#f43f5e]" />
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8]">
                  At Risk
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[0.8125rem] font-bold text-[#f43f5e] leading-none">
                  {atRiskPct}%
                </span>
                <span className="text-[0.625rem] text-[#94a3b8] leading-none">
                  pending + suspended
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
