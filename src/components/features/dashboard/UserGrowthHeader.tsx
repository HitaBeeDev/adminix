import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import SegmentedControl from "./SegmentedControl";
import { PERIOD_OPTIONS } from "./userGrowth.constants";
import type { UserGrowthPeriodMeta, UserGrowthStats } from "./userGrowth.types";

interface UserGrowthHeaderProps {
  meta: UserGrowthPeriodMeta;
  onPeriodChange: (value: string) => void;
  period: string;
  stats: UserGrowthStats;
  totalUsers: number;
}

function GrowthBadge({ pct, color }: { pct: string; color: "green" | "indigo" }) {
  const isPositive = parseFloat(pct) >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  const styles =
    color === "green"
      ? isPositive
        ? "bg-[#ecfdf5] text-[#059669]"
        : "bg-[#fef2f2] text-[#dc2626]"
      : isPositive
        ? "bg-[#eef2ff] text-[#6366f1]"
        : "bg-[#fef2f2] text-[#dc2626]";

  return (
    <span className={`inline-flex items-center gap-0.5 h-[1.25rem] px-1.5 rounded-full text-[0.625rem] font-bold mb-1 ${styles}`}>
      <Icon size={10} strokeWidth={2.5} />
      {Math.abs(parseFloat(pct)).toFixed(1)}%
    </span>
  );
}

export function UserGrowthHeader({
  meta,
  onPeriodChange,
  period,
  stats,
  totalUsers,
}: UserGrowthHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-start gap-5">
        <div>
          <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-1.5">
            Total Users
          </p>
          <div className="flex items-end gap-2">
            <span className="text-[2rem] leading-none font-[800] tracking-tight text-[#0f172a] dark:text-white tabular-nums">
              {totalUsers.toLocaleString()}
            </span>
            <GrowthBadge pct="6.2" color="green" />
          </div>
          <p className="text-[0.625rem] text-[#94a3b8] mt-1">All registered users</p>
        </div>

        <div className="w-px self-stretch bg-[#e2e8f0] dark:bg-[#1e293b] mx-1" />

        <div>
          <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-1.5">
            {meta.secondKpi}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-[2rem] leading-none font-[800] tracking-tight text-[#0f172a] dark:text-white tabular-nums">
              {stats.latest.toLocaleString()}
            </span>
            {stats.momPct && <GrowthBadge pct={stats.momPct} color="indigo" />}
          </div>
          <p className="text-[0.625rem] text-[#94a3b8] mt-1">vs. previous period</p>
        </div>
      </div>

      <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
    </div>
  );
}
