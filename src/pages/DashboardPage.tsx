import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Users, UserCheck, Star, Repeat, UserPlus, FileText,
  ScrollText, Key, MoreHorizontal, ArrowRight, Cog, ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  LabelList,
} from "recharts";
import { useDashboardStats } from "@/hooks/useDashboard";
import ErrorState from "@/components/ui/ErrorState";
import type { ActivityEvent } from "@/types/activity";

// ── Helpers ──────────────────────────────────────────────────

function useCountUp(target: number | undefined, duration = 600) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (target === undefined) return;
    let raf = 0;
    if (done.current) {
      raf = requestAnimationFrame(() => setVal(target));
      return () => cancelAnimationFrame(raf);
    }
    done.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      raf = requestAnimationFrame(() => setVal(target));
      return () => cancelAnimationFrame(raf);
    }
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(target! * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function fmtRelative(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// Static sparklines (stable, no random)
const SPARK_UP   = [28,30,31,34,36,38,37,42,44,48,50,54];
const SPARK_FLAT = [44,46,43,47,45,46,44,48,45,47,46,45];

// Action labels for activity feed
const ACTION_LABEL: Record<string, string> = {
  "user:created":        "invited",
  "user:updated":        "updated",
  "user:deleted":        "removed",
  "user:suspended":      "suspended",
  "user:reactivated":    "reactivated",
  "user:role_changed":   "changed role for",
  "account:created":     "created account",
  "account:updated":     "updated account",
  "account:suspended":   "suspended account",
  "account:deleted":     "deleted account",
  "role:created":        "created role",
  "role:updated":        "updated role",
  "role:deleted":        "deleted role",
  "auth:login":          "logged in",
  "auth:logout":         "logged out",
  "settings:updated":    "updated settings",
};

function activityBadge(action: ActivityEvent["action"]) {
  if (action.includes("delete") || action.includes("suspend"))
    return { label: "Suspend", className: "bg-[#fff1f2] text-[#f43f5e]" };
  if (action.includes("role"))
    return { label: "Role", className: "bg-[#fffbeb] text-[#d97706]" };
  if (action.includes("created") || action.includes("invited"))
    return { label: "Invite", className: "bg-[#eef2ff] text-[#6366f1]" };
  return { label: "System", className: "border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]" };
}

function activityIcon(action: ActivityEvent["action"]) {
  if (action.startsWith("role")) return ShieldCheck;
  if (action.startsWith("settings")) return Cog;
  return null; // null → use avatar
}

// ── KPI Card ─────────────────────────────────────────────────

interface KpiProps {
  label: string;
  value: number | undefined;
  subtext: string;
  trend: { pct: string; up: boolean };
  sparkline: number[];
  icon: React.ElementType;
  iconClassName: string;
  loading: boolean;
}

function KpiCard({ label, value, subtext, trend, sparkline, icon: Icon, iconClassName, loading }: KpiProps) {
  const animated = useCountUp(value);
  const sparkData = sparkline.map((v) => ({ v }));
  const trendColor = trend.up ? "#6366f1" : "#f43f5e";

  return (
    <div className="bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-6 cursor-pointer transition-all duration-200 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-52px_rgba(15,23,42,0.14)]">
      {/* Icon + label */}
      <div className="flex items-start justify-between">
        <p className="text-[15px] font-semibold text-[#0f172a]">
          {label}
        </p>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconClassName}`}>
          <Icon size={16} />
        </div>
      </div>

      {/* Value + trend */}
      <div className="flex items-end gap-2.5 mt-5">
        {loading ? (
          <div className="h-8 w-20 rounded-md animate-pulse bg-[#f1f5f9]" />
        ) : (
          <>
            <span
              className="text-[38px] leading-none font-bold tracking-tight text-[#0f172a]"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {value !== undefined ? animated.toLocaleString() : "—"}
            </span>
            <span className={`mb-1 inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[12px] font-semibold ${trend.up ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fff1f2] text-[#f43f5e]"}`}>
              {trend.up ? "▲" : "▼"} {trend.pct}
            </span>
          </>
        )}
      </div>

      {/* Subtext + sparkline */}
      <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#e2e8f0]">
        <p className="text-[13px] text-[#64748b]">
          {subtext}
        </p>
        <div className="w-[88px] h-7">
          <ResponsiveContainer width={88} height={28}>
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trendColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={trendColor}
                strokeWidth={1.5}
                fill={`url(#sg-${label})`}
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Segmented control ─────────────────────────────────────────

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#f1f5f9]">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`h-8 px-4 text-xs font-semibold rounded-full transition-colors duration-150 ${opt === value ? "bg-[#ffffff] text-[#0f172a] shadow-[0_10px_22px_-18px_rgba(15,23,42,0.25)]" : "text-[#64748b] hover:text-[#0f172a]"}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Custom tooltip for growth chart ──────────────────────────

function GrowthTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#6366f1] text-white shadow-[0_4px_12px_-4px_rgba(99,102,241,0.4)]">
      {payload[0].value.toLocaleString()}
    </div>
  );
}

// ── Dashboard page ────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: "Invite User",       icon: UserPlus,    to: "/users" },
  { label: "Generate Report",   icon: FileText,    to: "/reports" },
  { label: "Audit Log",         icon: ScrollText,  to: "/activity" },
  { label: "API Keys",          icon: Key,         to: "/settings" },
];

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();
  const [period, setPeriod] = useState("Monthly");

  // Derived chart data
  const growthData = (data?.registrationsByMonth ?? []).map((d) => ({
    month: d.month,
    current: d.registrations,
    previous: Math.round(d.registrations * 0.78 + Math.sin(d.registrations) * 40),
  }));

  const roleData = (data?.usersByRole ?? []).map((d) => ({
    name: d.role.charAt(0).toUpperCase() + d.role.slice(1).replace(/_/g, " "),
    value: d.count,
  }));

  const statusData = data?.usersByStatus?.length
    ? data.usersByStatus.map((d) => ({
        name: d.status.charAt(0).toUpperCase() + d.status.slice(1),
        value: d.count,
      }))
    : [
        { name: "Active",    value: 2856 },
        { name: "Pending",   value: 2134 },
        { name: "Suspended", value: 1247 },
        { name: "Invited",   value: 541 },
      ];

  const totalStatusCount = statusData.reduce((s, d) => s + d.value, 0);

  const DONUT_COLORS = [
    "#6366f1",
    "#818cf8",
    "#a5b4fc",
    "#c7d2fe",
  ];

  return (
    <div className="space-y-7 pt-1 lg:pt-2">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] leading-10 font-bold tracking-tight text-[#0f172a]">
            Dashboard Overview
          </h1>
          <p className="mt-1.5 text-[15px] text-[#64748b]">
            Snapshot of activity across your workspace.
          </p>
        </div>
      </div>

      {isError && (
        <div className="rounded-3xl border border-[#e2e8f0] bg-[#ffffff]">
          <ErrorState error={error} onRetry={() => void refetch()} />
        </div>
      )}

      {/* ── KPI row ──────────────────────────────────────────── */}
      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <KpiCard
            label="Total Users"
            value={data?.kpis.totalUsers}
            subtext="Total users last month"
            trend={{ pct: "8.2%", up: true }}
            sparkline={SPARK_UP}
            icon={Users}
            iconClassName="bg-[#eef2ff] text-[#6366f1]"
            loading={isLoading}
          />
          <KpiCard
            label="Active This Month"
            value={data?.kpis.activeUsers}
            subtext="Activated last month"
            trend={{ pct: "24%", up: true }}
            sparkline={SPARK_UP}
            icon={UserCheck}
            iconClassName="bg-[#eef2ff] text-[#6366f1]"
            loading={isLoading}
          />
          <KpiCard
            label="Avg. Session Rating"
            value={4.7}
            subtext="Avg. rating last month"
            trend={{ pct: "0.3%", up: true }}
            sparkline={SPARK_FLAT}
            icon={Star}
            iconClassName="bg-[#fffbeb] text-[#f59e0b]"
            loading={isLoading}
          />
          <KpiCard
            label="Account Retention"
            value={67}
            subtext="Repeat logins last month"
            trend={{ pct: "8.2%", up: true }}
            sparkline={SPARK_FLAT}
            icon={Repeat}
            iconClassName="bg-[#ecfdf5] text-[#059669]"
            loading={isLoading}
          />
        </div>
      )}

      {/* ── Charts row 1: Growth + Role ──────────────────────── */}
      {!isError && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* User Growth Trends */}
          <div className="xl:col-span-2 bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-7 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)]">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-[22px] font-bold tracking-tight text-[#0f172a]">User Growth Trends</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[30px] leading-none font-bold tracking-tight text-[#0f172a]">
                    {(data?.kpis.totalUsers ?? 8234).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-0.5 h-5 px-2 rounded-full bg-[#ecfdf5] text-[11px] font-medium text-[#059669]">
                    ↗ 6.20%
                  </span>
                </div>
              </div>
              <SegmentedControl options={["Daily", "Weekly", "Monthly"]} value={period} onChange={setPeriod} />
            </div>

            {isLoading ? (
              <div className="h-[300px] rounded-3xl animate-pulse bg-[#f1f5f9]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growthData} margin={{ top: 8, right: 0, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeOpacity={1} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8", fillOpacity: 1, dy: 8 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8", fillOpacity: 1 }}
                    tickFormatter={fmtNum}
                    width={40}
                  />
                  <Tooltip
                    content={<GrowthTooltip />}
                    cursor={{ stroke: "#6366f1", strokeOpacity: 0.4, strokeDasharray: "3 3" }}
                  />
                  {/* Previous period */}
                  <Area
                    type="monotone"
                    dataKey="previous"
                    stroke="#a5b4fc"
                    strokeOpacity={0.6}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                    isAnimationActive={false}
                    dot={false}
                  />
                  {/* Current period */}
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#gc1)"
                    isAnimationActive={false}
                    dot={false}
                    activeDot={{ r: 5, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Role Distribution */}
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
        </div>
      )}

      {/* ── Charts row 2: Donut + Activity ───────────────────── */}
      {!isError && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Account Status donut */}
          <div className="bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-7 shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[22px] font-bold tracking-tight text-[#0f172a]">Account Status</h3>
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
                        fontSize: 12,
                        color: "#0f172a",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
                  {statusData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-[12px]">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                      />
                      <span className="text-[#64748b]">
                        {d.name}
                      </span>
                      <span className="font-medium text-[#0f172a]">{d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-[#94a3b8]">
                  Total Accounts: {totalStatusCount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Recent Activity feed */}
          <div className="bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-7 flex flex-col shadow-[0_22px_60px_-50px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between mb-0">
              <h3 className="text-[22px] font-bold tracking-tight text-[#0f172a]">Recent Activity</h3>
              <Link
                to="/activity"
                className="flex items-center gap-1 text-sm font-medium text-[#6366f1] hover:underline underline-offset-4 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex-1 space-y-3 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-start py-3 border-t border-[#e2e8f0]">
                    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-48 rounded bg-[#f1f5f9] animate-pulse" />
                      <div className="h-3 w-28 rounded bg-[#f1f5f9] animate-pulse" />
                    </div>
                    <div className="h-5 w-14 rounded-full bg-[#f1f5f9] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : !data?.recentActivity?.length ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center">
                <ScrollText size={24} className="text-[#94a3b8]" />
                <p className="text-sm text-[#64748b]">
                  Nothing's happened yet. Activity will show up here as your team uses the app.
                </p>
              </div>
            ) : (
              <>
                <ul className="flex-1">
                  {data.recentActivity.slice(0, 6).map((event) => {
                    const badge = activityBadge(event.action);
                    const IconComp = activityIcon(event.action);
                    return (
                      <li key={event.id} className="flex items-start gap-3 py-4 border-t border-[#e2e8f0]">
                        {/* Avatar or icon tile */}
                        {IconComp ? (
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-[#fffbeb]">
                            <IconComp size={16} className="text-[#d97706]" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#eef2ff] text-[#6366f1] flex items-center justify-center text-[12px] font-bold shrink-0">
                            {event.actorName?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                        )}

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#64748b] leading-snug">
                            <span className="font-medium text-[#0f172a]">{event.actorName}</span>
                            {" "}
                            <span>{ACTION_LABEL[event.action] ?? event.action}</span>
                            {event.targetName && (
                              <> <span className="font-medium text-[#0f172a]">{event.targetName}</span></>
                            )}
                          </p>
                          <p className="text-[12px] mt-0.5 text-[#94a3b8]">
                            {fmtRelative(event.timestamp)}
                          </p>
                        </div>

                        {/* Badge */}
                        <span className={`shrink-0 inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium uppercase tracking-wide ${badge.className}`}>
                          {badge.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="mt-4 w-full h-11 rounded-2xl text-sm font-semibold text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                >
                  Load more
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Quick Actions ─────────────────────────────────────── */}
      {!isError && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col justify-between h-28 bg-[#ffffff] rounded-3xl border border-[#e2e8f0] p-5 cursor-pointer transition-all duration-200 shadow-[0_22px_60px_-54px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:bg-[#fafbff] hover:border-[#6366f1]/25 hover:shadow-[0_28px_70px_-52px_rgba(99,102,241,0.15)]"
              >
                <Icon size={20} className="text-[#94a3b8]" />
                <span className="text-sm font-medium text-[#0f172a]">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
