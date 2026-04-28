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

export function UserGrowthHeader({
  meta,
  onPeriodChange,
  period,
  stats,
  totalUsers,
}: UserGrowthHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-start gap-6">
        <div>
          <p className="text-[0.7rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Total Users</p>
          <div className="flex items-end gap-2">
            <span className="text-[2rem] leading-none font-[700] tracking-tight text-[#0f172a] dark:text-white">
              {totalUsers.toLocaleString()}
            </span>
            <span className="inline-flex items-center h-[1.375rem] px-2 rounded-full bg-[#ecfdf5] text-[0.6rem] font-bold text-[#059669] mb-0.5 tracking-wide">
              {"\u2197"} 6.2%
            </span>
          </div>
        </div>

        <div className="w-px self-stretch bg-[#e2e8f0] mx-1 dark:bg-[#1e293b]" />

        <div>
          <p className="text-[0.7rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">
            {meta.secondKpi}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-[2rem] leading-none font-[700] tracking-tight text-[#0f172a] dark:text-white">
              {stats.latest.toLocaleString()}
            </span>
            {stats.momPct && (
              <span className="inline-flex items-center h-[1.375rem] px-2 rounded-full bg-[#eef2ff] text-[0.6rem] font-bold text-[#6366f1] mb-0.5 tracking-wide">
                {"\u2197"} {stats.momPct}%
              </span>
            )}
          </div>
        </div>
      </div>

      <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
    </div>
  );
}
