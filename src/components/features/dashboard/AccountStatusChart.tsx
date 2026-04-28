import { MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { DashboardStats } from "@/api/dashboard";

const DONUT_COLORS = ["#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

const FALLBACK_STATUS = [
  { name: "Active",    value: 2856 },
  { name: "Pending",   value: 2134 },
  { name: "Suspended", value: 1247 },
  { name: "Invited",   value: 541 },
];

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
  const dominant = statusData[0];

  return (
    <div className="bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] pt-3 pl-5 pr-5 pb-3 transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.05rem] font-[600] tracking-tight text-[#0f172a]">Account Status</h3>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="h-[320px] rounded-[1.2rem] animate-pulse bg-[#f1f5f9]" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-full">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={98}
                  paddingAngle={3}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 10,
                    fontSize: "0.75rem",
                    color: "#f8fafc",
                    padding: "8px 12px",
                  }}
                  itemStyle={{ color: "#cbd5e1" }}
                  formatter={(value: number) => [value.toLocaleString(), ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[1.6rem] font-[700] leading-none tracking-tight text-[#0f172a]">
                {total.toLocaleString()}
              </span>
              <span className="text-[0.7rem] text-[#94a3b8] mt-1 font-medium">Total Users</span>
            </div>
          </div>

          <div className="w-full mt-1 space-y-2">
            {statusData.map((d, i) => {
              const pct = Math.round((d.value / total) * 100);
              return (
                <div key={d.name} className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                  />
                  <span className="text-[0.75rem] text-[#64748b] flex-1 min-w-0 truncate">{d.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden max-w-[80px]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: DONUT_COLORS[i % DONUT_COLORS.length],
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-[0.75rem] font-semibold text-[#0f172a] w-12 text-right tabular-nums">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {dominant && (
            <p className="mt-3 text-[0.7rem] text-[#94a3b8]">
              Largest segment: <span className="font-semibold text-[#10b981]">{dominant.name}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
