import { AlertTriangle, MoreHorizontal, ShieldCheck } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardStats } from "@/api/dashboard";

const STATUS_COLORS: Record<string, { bar: string; bg: string }> = {
  Active:    { bar: "#10b981", bg: "#ecfdf5" },
  Pending:   { bar: "#f59e0b", bg: "#fffbeb" },
  Suspended: { bar: "#f43f5e", bg: "#fff1f2" },
  Invited:   { bar: "#6366f1", bg: "#eef2ff" },
};
const FALLBACK_COLOR = { bar: "#94a3b8", bg: "#f8fafc" };

const FALLBACK_STATUS = [
  { name: "Active",    value: 5176 },
  { name: "Pending",   value: 1134 },
  { name: "Suspended", value: 768  },
];

function getColor(name: string) {
  return STATUS_COLORS[name] ?? FALLBACK_COLOR;
}

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = getColor(d.name).bar;

  return (
    <div className="bg-[#0f172a] rounded-xl px-3 py-2.5 shadow-2xl border border-white/[0.06] min-w-[130px]">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-[#64748b]">
          {d.name}
        </span>
      </div>
      <p className="text-white text-[1rem] font-bold leading-none tabular-nums">
        {d.value.toLocaleString()}
        <span className="text-[#475569] font-normal text-[0.625rem] ml-1.5">users</span>
      </p>
    </div>
  );
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
  const maxValue = sorted[0]?.value ?? 1;
  const dominant = sorted[0];

  const atRisk = statusData
    .filter((d) => d.name === "Pending" || d.name === "Suspended")
    .reduce((s, d) => s + d.value, 0);
  const atRiskPct = total > 0 ? Math.round((atRisk / total) * 100) : 0;

  return (
    <div className="bg-white rounded-[1.2rem] border border-[#e2e8f0] pt-4 px-5 pb-4 transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)] dark:border-[#1e293b] dark:bg-[#0f172a] dark:shadow-none">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[#0f172a] dark:text-white leading-snug">
            Account Status
          </h3>
          <p className="text-[0.75rem] text-[#94a3b8] mt-0.5">User account health breakdown</p>
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
        <div className="h-[340px] rounded-xl animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
      ) : (
        <>
          {/* Donut chart */}
          <div className="relative w-full">
            <ResponsiveContainer width="100%" height={196}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={2.5}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {statusData.map((d, i) => (
                    <Cell key={i} fill={getColor(d.name).bar} />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[1.75rem] font-[800] leading-none tracking-tight text-[#0f172a] dark:text-white tabular-nums">
                {total.toLocaleString()}
              </span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8] mt-1">
                Total Users
              </span>
            </div>
          </div>

          {/* Ranked legend */}
          <div className="mt-3 pt-3.5 border-t border-[#f1f5f9] dark:border-[#1e293b] flex flex-col gap-2">
            {sorted.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              const color = getColor(d.name).bar;
              return (
                <div key={d.name} className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-[0.73rem] font-medium text-[#64748b] dark:text-[#94a3b8] w-[4.25rem] truncate">
                    {d.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-[#f1f5f9] dark:bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(d.value / maxValue) * 100}%`,
                        background: color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-[0.73rem] font-bold text-[#1e293b] dark:text-white tabular-nums w-[2.75rem] text-right">
                    {d.value.toLocaleString()}
                  </span>
                  <span
                    className="text-[0.6rem] font-semibold tabular-nums px-1.5 py-0.5 rounded-full w-[2.25rem] text-center flex-shrink-0 leading-none"
                    style={{ background: color + "1a", color }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Insight: 2-stat grid */}
          <div className="mt-3 grid grid-cols-2 gap-2">
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
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: getColor(dominant.name).bar }}
                  />
                  <span className="text-[0.8125rem] font-bold text-[#0f172a] dark:text-white leading-none">
                    {dominant.name}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-xl px-3 py-2.5 bg-[#f8fafc] dark:bg-[#1e293b]">
              <div className="flex items-center gap-1 mb-1.5">
                <AlertTriangle size={9} className="text-[#f59e0b]" />
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8]">
                  At Risk
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[0.8125rem] font-bold text-[#f43f5e] leading-none">
                  {atRiskPct}%
                </span>
                <span className="text-[0.6rem] text-[#94a3b8] leading-none">
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
