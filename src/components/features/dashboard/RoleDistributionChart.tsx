import { MoreHorizontal } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, LabelList,
} from "recharts";
import type { DashboardStats } from "@/api/dashboard";

const BAR_GRADIENTS: [string, string][] = [
  ["#6366f1", "#a5b4fc"],
  ["#8b5cf6", "#c4b5fd"],
  ["#06b6d4", "#67e8f9"],
  ["#10b981", "#6ee7b7"],
  ["#f59e0b", "#fcd34d"],
];

interface Props {
  data: DashboardStats | undefined;
  isLoading: boolean;
}

export default function RoleDistributionChart({ data, isLoading }: Props) {
  const roleData = (data?.usersByRole ?? []).map((d) => ({
    name: d.role.charAt(0).toUpperCase() + d.role.slice(1).replace(/_/g, " "),
    value: d.count,
  }));

  return (
    <div className="bg-[#ffffff] rounded-[1.2rem] border border-[#e2e8f0] pt-3 pl-5 pr-5 pb-3 transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[1.05rem] font-[600] tracking-tight text-[#0f172a]">Role Distribution</h3>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="h-[300px] rounded-[1.2rem] animate-pulse bg-[#f1f5f9]" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roleData} margin={{ top: 28, right: 4, left: 4, bottom: 4 }}>
            <defs>
              {BAR_GRADIENTS.map(([from, to], i) => (
                <linearGradient key={i} id={`rbar${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={from} stopOpacity={1} />
                  <stop offset="100%" stopColor={to} stopOpacity={0.65} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: "0.6875rem", fill: "#94a3b8", fillOpacity: 1 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "#f8fafc", radius: 8 }}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 10,
                fontSize: "0.75rem",
                color: "#f8fafc",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#cbd5e1" }}
              formatter={(value: number) => [value.toLocaleString(), "Users"]}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={44}>
              {roleData.map((_, i) => (
                <Cell key={i} fill={`url(#rbar${i})`} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: "0.6875rem", fontWeight: 700, fill: "#64748b" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
