import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AccountActivityChartProps {
  weeklyData: Array<{ day: string; events: number }>;
}

export function AccountActivityChart({ weeklyData }: AccountActivityChartProps) {
  return (
    <div className="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-[#181818] mb-0.5">Weekly Activity</h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Audit events by day of week</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: "0.6875rem", fill: "currentColor" }}
            className="text-gray-400 dark:text-gray-500"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: "0.6875rem", fill: "currentColor" }}
            className="text-gray-400 dark:text-gray-500"
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid rgb(229 231 235)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
            }}
            cursor={{ fill: "rgb(243 244 246 / 0.5)" }}
          />
          <Bar dataKey="events" fill="#4fc4cf" radius={[3, 3, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
