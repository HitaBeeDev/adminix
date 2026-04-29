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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 self-start sticky top-4">
      <h2 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">Weekly Activity</h2>
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
          <Bar dataKey="events" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
