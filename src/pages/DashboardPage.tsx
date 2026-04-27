import { Users, UserCheck, UserPlus, UserX, UserRoundPlus, Building2, ShieldPlus, ScrollText, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import type { ActivityEvent } from '@/types/activity';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboard';
import ErrorState from '@/components/ui/ErrorState';

const ROLE_COLORS: Record<string, string> = {
  super_admin: '#f43f5e',
  admin:       '#6366f1',
  manager:     '#8b5cf6',
  editor:      '#f59e0b',
  viewer:      '#10b981',
  guest:       '#94a3b8',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  manager:     'Manager',
  editor:      'Editor',
  viewer:      'Viewer',
  guest:       'Guest',
};

type KpiTrend = {
  delta: string;
  direction: 'up' | 'down';
  label: string;
};

type KpiSparklinePoint = {
  value: number;
};

type KpiAccent = {
  border: string;
  glow: string;
  icon: string;
  line: string;
  gradient: string;
};

const QUICK_ACTIONS = [
  {
    label: 'Invite User',
    description: 'Add a new team member',
    to: '/users',
    icon: UserRoundPlus,
    color: 'bg-indigo-500',
  },
  {
    label: 'New Account',
    description: 'Create an organization',
    to: '/accounts',
    icon: Building2,
    color: 'bg-violet-500',
  },
  {
    label: 'Add Role',
    description: 'Define permissions',
    to: '/roles',
    icon: ShieldPlus,
    color: 'bg-emerald-500',
  },
  {
    label: 'View Logs',
    description: 'Browse audit trail',
    to: '/activity',
    icon: ScrollText,
    color: 'bg-amber-500',
  },
];

const ACTION_LABEL: Record<string, string> = {
  'user:created':        'Created user',
  'user:updated':        'Updated user',
  'user:deleted':        'Deleted user',
  'user:suspended':      'Suspended user',
  'user:reactivated':    'Reactivated user',
  'user:password_reset': 'Reset password',
  'user:role_changed':   'Changed role',
  'account:created':     'Created account',
  'account:updated':     'Updated account',
  'account:suspended':   'Suspended account',
  'account:deleted':     'Deleted account',
  'role:created':        'Created role',
  'role:updated':        'Updated role',
  'role:deleted':        'Deleted role',
  'auth:login':          'Logged in',
  'auth:logout':         'Logged out',
  'settings:updated':    'Updated settings',
};

const ACTION_COLOR: Record<string, string> = {
  'user:deleted':     'bg-rose-500',
  'user:suspended':   'bg-amber-500',
  'account:deleted':  'bg-rose-500',
  'account:suspended':'bg-amber-500',
  'role:deleted':     'bg-rose-500',
  'auth:login':       'bg-emerald-500',
  'auth:logout':      'bg-gray-400',
};

function activityDot(action: ActivityEvent['action']) {
  return ACTION_COLOR[action] ?? 'bg-indigo-500';
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ChartSkeleton({ variant = 'line' }: { variant?: 'line' | 'bar' | 'donut' }) {
  if (variant === 'donut') {
    return (
      <div className="h-52 flex items-center justify-center gap-6">
        <div className="w-28 h-28 rounded-full border-[14px] border-gray-100 dark:border-gray-800 animate-pulse" />
        <div className="space-y-2.5">
          {[80, 60, 72, 48, 56, 40].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
              <div className={`h-2.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse`} style={{ width: w }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'bar') {
    const heights = [55, 80, 40, 90, 65, 75, 50];
    return (
      <div className="h-52 flex items-end justify-around gap-2 px-4 pb-6 pt-4">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }

  // line
  return (
    <div className="h-52 px-4 pb-6 pt-4 space-y-3">
      {[45, 55, 35, 65, 50, 70, 40].map((_, i) => (
        <div key={i} className="h-2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: `${60 + (i * 7) % 35}%` }} />
      ))}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  accent: KpiAccent;
  trend: KpiTrend;
  sparkline: KpiSparklinePoint[];
  loading: boolean;
}

function KpiCard({ label, value, icon: Icon, accent, trend, sparkline, loading }: KpiCardProps) {
  const TrendIcon = trend.direction === 'up' ? TrendingUp : TrendingDown;
  const gradientId = `sparkline-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 p-5 shadow-sm',
      accent.border,
    )}>
      <div className={cn('absolute inset-y-0 left-0 w-1', accent.glow)} />
      <div className={cn('absolute inset-x-0 top-0 h-20 bg-gradient-to-br opacity-70 dark:opacity-35', accent.gradient)} />
      <div className="flex items-start gap-5">
        <div className={cn('relative flex-shrink-0 rounded-xl p-3 shadow-sm ring-1 ring-white/50 dark:ring-white/10', accent.icon)}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
          {loading ? (
            <div className="mt-1 space-y-2">
              <div className="h-7 w-16 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
              <div className="h-5 w-28 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
              <span
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  trend.direction === 'up'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
                )}
              >
                <TrendIcon size={12} />
                {trend.delta} {trend.label}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 h-10">
        {loading ? (
          <div className="h-full rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent.line} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={accent.line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={accent.line}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();
  const registrationSparkline = data?.registrationsByMonth.map((entry) => ({ value: entry.registrations })) ?? [];

  const cards: Array<Omit<KpiCardProps, 'loading'>> = [
    {
      label: 'Total Users',
      value: data?.kpis.totalUsers,
      icon: Users,
      accent: {
        border: 'border-indigo-200 dark:border-indigo-900/60',
        glow: 'bg-indigo-500',
        icon: 'bg-indigo-600',
        line: '#6366f1',
        gradient: 'from-indigo-50 via-indigo-50/70 to-transparent dark:from-indigo-950/50 dark:via-indigo-950/25 dark:to-transparent',
      },
      trend: { delta: '+12%', direction: 'up', label: 'vs last month' },
      sparkline: registrationSparkline,
    },
    {
      label: 'Active',
      value: data?.kpis.activeUsers,
      icon: UserCheck,
      accent: {
        border: 'border-emerald-200 dark:border-emerald-900/60',
        glow: 'bg-emerald-500',
        icon: 'bg-emerald-600',
        line: '#10b981',
        gradient: 'from-emerald-50 via-emerald-50/70 to-transparent dark:from-emerald-950/50 dark:via-emerald-950/25 dark:to-transparent',
      },
      trend: { delta: '+8%', direction: 'up', label: 'vs last month' },
      sparkline: [
        { value: 18 },
        { value: 21 },
        { value: 20 },
        { value: 24 },
        { value: 26 },
        { value: 29 },
        { value: 31 },
      ],
    },
    {
      label: 'New This Month',
      value: data?.kpis.newThisMonth,
      icon: UserPlus,
      accent: {
        border: 'border-violet-200 dark:border-violet-900/60',
        glow: 'bg-violet-500',
        icon: 'bg-violet-600',
        line: '#8b5cf6',
        gradient: 'from-violet-50 via-violet-50/70 to-transparent dark:from-violet-950/50 dark:via-violet-950/25 dark:to-transparent',
      },
      trend: { delta: '+24%', direction: 'up', label: 'vs last month' },
      sparkline: registrationSparkline,
    },
    {
      label: 'Suspended',
      value: data?.kpis.suspendedUsers,
      icon: UserX,
      accent: {
        border: 'border-rose-200 dark:border-rose-900/60',
        glow: 'bg-rose-500',
        icon: 'bg-rose-600',
        line: '#f43f5e',
        gradient: 'from-rose-50 via-rose-50/70 to-transparent dark:from-rose-950/50 dark:via-rose-950/25 dark:to-transparent',
      },
      trend: { delta: '-5%', direction: 'down', label: 'vs last month' },
      sparkline: [
        { value: 9 },
        { value: 8 },
        { value: 8 },
        { value: 7 },
        { value: 6 },
        { value: 6 },
        { value: 5 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your users and accounts.
        </p>
      </div>

      {isError && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      )}

      {/* KPI Cards */}
      {!isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <KpiCard key={card.label} {...card} loading={isLoading} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, description, to, icon: Icon, color }) => (
            <Link
              key={label}
              to={to}
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all"
            >
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', color)}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts — fit in one row on desktop, stack on mobile */}
      {!isError && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Registrations Line Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              User Registrations
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">New sign-ups over the last 12 months</p>

            {isLoading ? (
              <ChartSkeleton variant="line" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
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
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
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

          {/* Users by Role Donut Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Users by Role
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Distribution across permission levels</p>

            {isLoading ? (
              <ChartSkeleton variant="donut" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={data?.usersByRole}
                    dataKey="count"
                    nameKey="role"
                    innerRadius="52%"
                    outerRadius="74%"
                    paddingAngle={3}
                  >
                    {data?.usersByRole.map((entry) => (
                      <Cell key={entry.role} fill={ROLE_COLORS[entry.role] ?? '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      Number(value ?? 0),
                      ROLE_LABELS[String(name)] ?? String(name),
                    ]}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: '0.75rem', color: 'inherit' }}>
                        {ROLE_LABELS[value] ?? value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Activity by Day of Week Bar Chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Activity by Day of Week
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Total audit events per weekday</p>

            {isLoading ? (
              <ChartSkeleton variant="bar" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data?.activityByDayOfWeek} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" vertical={false} />
                  <XAxis
                    dataKey="day"
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
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                    }}
                    labelStyle={{ fontWeight: 600 }}
                    cursor={{ fill: 'rgb(243 244 246)' }}
                  />
                  <Bar dataKey="events" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      {!isError && <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Latest 10 audit events</p>
          </div>
          <Link
            to="/activity"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-48 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                </div>
                <div className="h-3 w-12 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (data?.recentActivity?.length ?? 0) === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2 text-center">
            <ScrollText size={24} className="text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {data?.recentActivity.map((event) => (
              <li key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${activityDot(event.action)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    <span className="font-medium">{event.actorName}</span>
                    {' '}
                    <span className="text-gray-500 dark:text-gray-400">{ACTION_LABEL[event.action] ?? event.action}</span>
                    {event.targetName && (
                      <> <span className="font-medium">{event.targetName}</span></>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{event.actorEmail}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
                  {formatRelative(event.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>}
    </div>
  );
}
