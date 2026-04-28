import { MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { DashboardStats } from "@/api/dashboard";

const DONUT_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

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

  return (
    <div className="bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-7 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.375rem] font-bold tracking-tight text-[#0f172a]">Account Status</h3>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="h-[320px] rounded-3xl animate-pulse bg-[#f1f5f9]" />
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                stroke="none"
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  color: "#0f172a",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[0.75rem]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                <span className="text-[#64748b]">{d.name}</span>
                <span className="font-medium text-[#0f172a]">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[0.75rem] text-[#94a3b8]">
            Total Accounts: {total.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
