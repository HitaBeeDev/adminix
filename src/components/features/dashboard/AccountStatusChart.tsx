import { AlertTriangle, MoreHorizontal, ShieldCheck } from "lucide-react";
import type { DashboardStats } from "@/api/dashboard";

// Color tokens — match KPI card delta chip system exactly
const STATUS_COLORS: Record<string, { bar: string; chipBg: string; chipText: string }> = {
  Active:    { bar: "#10b981", chipBg: "#ecfdf5", chipText: "#059669" },
  Pending:   { bar: "#64748b", chipBg: "#f1f5f9", chipText: "#64748b" },
  Suspended: { bar: "#f43f5e", chipBg: "#fff1f2", chipText: "#f43f5e" },
  Invited:   { bar: "#6366f1", chipBg: "#eef2ff", chipText: "#4338ca" },
};
const FALLBACK_COLOR = { bar: "#94a3b8", chipBg: "#f8fafc", chipText: "#64748b" };

// Mock week-over-week trends (no trend endpoint in API)
const MOCK_TRENDS: Record<string, { up: boolean; pct: string }> = {
  Active:    { up: true,  pct: "2.1" },
  Pending:   { up: false, pct: "0.4" },
  Suspended: { up: true,  pct: "1.8" },
  Invited:   { up: true,  pct: "3.2" },
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

  return (
    // self-start prevents this card from stretching to match the taller Activity feed beside it
    <div className="self-start bg-white rounded-[1.25rem] border border-[#e2e8f0] p-5 flex flex-col transition-all duration-200 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(15,23,42,0.13)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
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
        <div className="flex flex-col gap-4 mt-4">
          <div className="h-3 rounded-full animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
          <div className="h-8 w-36 rounded-lg animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
          <div className="h-px bg-[#f1f5f9] dark:bg-[#1e293b]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 rounded-full animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Stacked bar ── 12px tall, rounded ends, segments separated by hairline white border */}
          <div className="mt-4 flex w-full h-3 rounded-full overflow-hidden">
            {sorted.map((d, i) => (
              <div
                key={d.name}
                className={i > 0 ? "border-l-2 border-white dark:border-[#0f172a]" : ""}
                style={{ flex: d.value, background: getColor(d.name).bar }}
              />
            ))}
          </div>

          {/* ── Hero row ── total + overall trend chip (KPI chip recipe) */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.75rem] font-[800] leading-none tracking-tight text-[#0f172a] dark:text-white tabular-nums">
                {total.toLocaleString()}
              </span>
              <span className="text-[0.73rem] font-medium text-[#94a3b8]">total users</span>
            </div>
            <span className="inline-flex items-center gap-1 h-6 px-[0.7rem] rounded-full text-[0.65rem] font-semibold bg-[#ecfdf5] text-[#059669]">
              ▲ 2.1% vs last week
            </span>
          </div>

          {/* ── Legend ── 4 columns: [dot + label] [count] [trend chip] [% chip] */}
          {/* mt-4 pt-3.5 matches Role Distribution legend container exactly */}
          <div className="mt-4 pt-3.5 border-t border-[#f1f5f9] dark:border-[#1e293b] flex flex-col gap-2">
            {sorted.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              const { bar, chipBg, chipText } = getColor(d.name);
              const trend = getTrend(d.name);

              return (
                <div key={d.name} className="flex items-center gap-2.5">

                  {/* Col 1: dot + label — flex-1 so "Suspended" never truncates */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bar }} />
                    <span className="text-[0.73rem] font-medium text-[#64748b] dark:text-[#94a3b8] leading-none">
                      {d.name}
                    </span>
                  </div>

                  {/* Col 2: count — matches Role Distribution count column exactly */}
                  <span className="text-[0.73rem] font-bold text-[#1e293b] dark:text-white tabular-nums w-[2.5rem] text-right leading-none flex-shrink-0">
                    {d.value.toLocaleString()}
                  </span>

                  {/* Col 3: trend chip — KPI delta chip recipe (h-5 scaled for legend context) */}
                  <span
                    className="inline-flex items-center justify-center gap-0.5 h-5 px-2 rounded-full text-[0.625rem] font-semibold tabular-nums flex-shrink-0 w-[3.5rem]"
                    style={{
                      background: trend.up ? "#ecfdf5" : "#fff1f2",
                      color:      trend.up ? "#059669" : "#f43f5e",
                    }}
                  >
                    {trend.up ? "▲" : "▼"} {trend.pct}%
                  </span>

                  {/* Col 4: % chip — Role Distribution chip recipe */}
                  <span
                    className="text-[0.6rem] font-semibold tabular-nums px-1.5 py-0.5 rounded-full w-[2.25rem] text-center flex-shrink-0 leading-none"
                    style={{ background: chipBg, color: chipText }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Insight grid ── mt-3 matches Role Distribution insight gap */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* Dominant — emerald surface, mirrors "▲" KPI chip */}
            {dominant && (
              <div className="rounded-xl px-3 py-2.5 bg-[#ecfdf5]">
                <div className="flex items-center gap-1 mb-1.5">
                  <ShieldCheck size={9} className="text-[#059669]" />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#059669]">
                    Dominant
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#10b981]" />
                  <span className="text-[0.8125rem] font-bold text-[#065f46] leading-none">
                    {dominant.name}
                  </span>
                </div>
              </div>
            )}

            {/* At Risk — rose surface, mirrors "▼" KPI chip */}
            <div className="rounded-xl px-3 py-2.5 bg-[#fff1f2]">
              <div className="flex items-center gap-1 mb-1.5">
                <AlertTriangle size={9} className="text-[#f43f5e]" />
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#f43f5e]">
                  At Risk
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[0.8125rem] font-bold text-[#f43f5e] leading-none">
                  {atRiskPct}%
                </span>
                <span className="text-[0.6rem] text-[#fb7185] leading-none">
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
