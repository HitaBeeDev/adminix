import { MoreHorizontal } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, LabelList,
} from "recharts";
import type { DashboardStats } from "@/api/dashboard";

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
    <div className="bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-7 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[22px] font-bold tracking-tight text-[#0f172a]">Role Distribution</h3>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {isLoading ? (
        <div className="h-[300px] rounded-3xl animate-pulse bg-[#f1f5f9]" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roleData} margin={{ top: 24, right: 0, left: 0, bottom: 4 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8", fillOpacity: 1 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "#f1f5f9" }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 12,
                color: "#0f172a",
              }}
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={48}>
              {roleData.map((_, i) => (
                <Cell key={i} fill={i === 1 ? "#a5b4fc" : "#6366f1"} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
