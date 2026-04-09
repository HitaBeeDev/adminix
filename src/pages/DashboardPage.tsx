import { Users, UserCheck, UserPlus, UserX } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboard';

interface KpiCardProps {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}

function KpiCard({ label, value, icon: Icon, color, loading }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex items-center gap-5">
      <div className={cn('flex-shrink-0 rounded-xl p-3', color)}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-16 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  const cards = [
    {
      label: 'Total Users',
      value: data?.kpis.totalUsers,
      icon: Users,
      color: 'bg-indigo-500',
    },
    {
      label: 'Active',
      value: data?.kpis.activeUsers,
      icon: UserCheck,
      color: 'bg-emerald-500',
    },
    {
      label: 'New This Month',
      value: data?.kpis.newThisMonth,
      icon: UserPlus,
      color: 'bg-violet-500',
    },
    {
      label: 'Suspended',
      value: data?.kpis.suspendedUsers,
      icon: UserX,
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your users and accounts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} loading={isLoading} />
        ))}
      </div>

      {/* Registrations Line Chart */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          User Registrations
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">New sign-ups over the last 12 months</p>

        {isLoading ? (
          <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data?.registrationsByMonth} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-400 dark:text-gray-500"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-400 dark:text-gray-500"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                }}
                labelStyle={{ fontWeight: 600 }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
