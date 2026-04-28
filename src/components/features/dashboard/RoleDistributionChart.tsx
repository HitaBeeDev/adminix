import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MoreHorizontal, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, Tooltip,
} from "recharts";
import type { DashboardStats } from "@/api/dashboard";

const ROLE_COLORS = [
  { bar: "#6366f1", barEnd: "#818cf8", bg: "#eef2ff", text: "#4338ca" },
  { bar: "#8b5cf6", barEnd: "#a78bfa", bg: "#f5f3ff", text: "#6d28d9" },
  { bar: "#06b6d4", barEnd: "#22d3ee", bg: "#ecfeff", text: "#0e7490" },
  { bar: "#10b981", barEnd: "#34d399", bg: "#ecfdf5", text: "#065f46" },
  { bar: "#f59e0b", barEnd: "#fbbf24", bg: "#fffbeb", text: "#92400e" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; pct: number; color: (typeof ROLE_COLORS)[0] } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0f172a] rounded-xl px-3.5 py-2.5 shadow-xl border border-white/10 min-w-[120px]">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: d.color.bar }} />
        <span className="text-[#94a3b8] text-[0.6875rem] font-medium">{d.name}</span>
      </div>
      <p className="text-white text-[0.9375rem] font-bold leading-none">
        {d.value.toLocaleString()}
        <span className="text-[#94a3b8] font-normal text-[0.6875rem] ml-1">users</span>
      </p>
      <p className="text-[0.6875rem] font-semibold mt-1" style={{ color: d.color.bar }}>
        {d.pct}% of total
      </p>
    </div>
  );
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  value?: number;
}

function CustomBar({ x = 0, y = 0, width = 0, height = 0, index = 0, value = 0 }: CustomBarProps) {
  const radius = 7;
  const colors = ROLE_COLORS[index % ROLE_COLORS.length];
  const gradId = `rbar-grad-${index}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bar} stopOpacity={1} />
          <stop offset="100%" stopColor={colors.barEnd} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={`url(#${gradId})`}
      />
      {/* clamp the flat bottom edge */}
      <rect
        x={x}
        y={y + height - radius}
        width={width}
        height={radius}
        fill={`url(#${gradId})`}
      />
      {/* value label above bar */}
      <text
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="#475569"
        className="dark-label"
      >
        {value.toLocaleString()}
      </text>
    </g>
  );
}

interface Props {
  data: DashboardStats | undefined;
  isLoading: boolean;
}

export default function RoleDistributionChart({ data, isLoading }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const raw = data?.usersByRole ?? [];
  const total = raw.reduce((s, d) => s + d.count, 0);

  const roleData = raw.map((d, i) => ({
    name: d.role.charAt(0).toUpperCase() + d.role.slice(1).replace(/_/g, " "),
    value: d.count,
    pct: total > 0 ? Math.round((d.count / total) * 100) : 0,
    color: ROLE_COLORS[i % ROLE_COLORS.length],
  }));

  const topRole = roleData.length
    ? roleData.reduce((a, b) => (a.value > b.value ? a : b))
    : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-[1.25rem] border border-[#e2e8f0] dark:border-[#1e293b] p-5 flex flex-col gap-0 transition-all duration-200 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(15,23,42,0.13)]">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-tight text-[#0f172a] dark:text-white leading-snug">
            Role Distribution
          </h3>
          <p className="text-[0.75rem] text-[#94a3b8] mt-0.5">
            {isLoading ? "—" : `${total.toLocaleString()} users across all roles`}
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Role distribution options"
            aria-expanded={menuOpen}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] hover:text-[#64748b] dark:hover:text-white transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-[#e2e8f0] bg-white p-1 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] dark:border-[#1e293b] dark:bg-[#111827]">
              <Link
                to="/roles"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-[0.75rem] font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
              >
                View roles
              </Link>
              <Link
                to="/users"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-[0.75rem] font-medium text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] dark:text-[#94a3b8] dark:hover:bg-[#1e293b] dark:hover:text-white"
              >
                View users
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Chart ── */}
      {isLoading ? (
        <div className="h-[200px] rounded-xl animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b] mt-4" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={roleData} margin={{ top: 28, right: 6, left: 6, bottom: 0 }} barCategoryGap="30%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.06)", radius: 8 }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="value"
              shape={(props) => {
                const barProps = props as CustomBarProps & { index?: number };
                return (
                  <CustomBar
                    {...barProps}
                    index={barProps.index ?? 0}
                    value={Number(barProps.value ?? 0)}
                  />
                );
              }}
              maxBarSize={48}
            >
              {roleData.map((_, i) => (
                <Cell key={i} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* ── Legend strip ── */}
      {!isLoading && roleData.length > 0 && (
        <div className="grid grid-cols-5 gap-1.5 mt-3">
          {roleData.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 rounded-xl py-2 px-1 transition-colors"
              style={{ background: d.color.bg }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: d.color.bar }}
              />
              <span className="text-[0.625rem] font-medium text-[#64748b] leading-none">
                {d.name}
              </span>
              <span className="text-[0.75rem] font-bold leading-none" style={{ color: d.color.text }}>
                {d.value.toLocaleString()}
              </span>
              <span
                className="text-[0.625rem] font-semibold px-1.5 py-0.5 rounded-full leading-none"
                style={{ background: d.color.bar + "22", color: d.color.bar }}
              >
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Insight footer ── */}
      {!isLoading && topRole && (
        <div className="flex items-center gap-2 mt-3 bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl px-3.5 py-2.5">
          <div
            className="w-1 h-8 rounded-full flex-shrink-0"
            style={{ background: topRole.color.bar }}
          />
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <TrendingUp size={12} className="text-[#94a3b8] flex-shrink-0" />
            <p className="text-[0.6875rem] text-[#64748b] dark:text-[#94a3b8] leading-snug">
              <span className="font-semibold" style={{ color: topRole.color.bar }}>
                {topRole.name}
              </span>{" "}
              is the largest group at{" "}
              <span className="font-semibold text-[#334155] dark:text-[#cbd5e1]">
                {topRole.pct}%
              </span>{" "}
              of all users
            </p>
          </div>
          <span
            className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: topRole.color.bar + "18", color: topRole.color.bar }}
          >
            #{1}
          </span>
        </div>
      )}
    </div>
  );
}
