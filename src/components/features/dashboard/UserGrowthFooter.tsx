import type { UserGrowthPeriodMeta, UserGrowthStats } from "./userGrowth.types";

interface UserGrowthFooterProps {
  isLoading: boolean;
  meta: UserGrowthPeriodMeta;
  stats: UserGrowthStats;
}

export function UserGrowthFooter({ isLoading, meta, stats }: UserGrowthFooterProps) {
  if (isLoading) return null;

  return (
    <div className="flex items-center gap-8 mt-4 pt-4 border-t border-[#f1f5f9] dark:border-[#1e293b]">
      <div>
        <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-0.5">Peak</p>
        <p className="text-[0.875rem] font-[700] text-[#0f172a] tabular-nums dark:text-white">
          {stats.peak.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-0.5">
          {meta.footerAvgLabel}
        </p>
        <p className="text-[0.875rem] font-[700] text-[#0f172a] tabular-nums dark:text-white">
          {stats.avg.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-[0.625rem] font-semibold text-[#94a3b8] uppercase tracking-widest mb-0.5">Latest</p>
        <p className="text-[0.875rem] font-[700] text-[#0f172a] tabular-nums dark:text-white">
          {stats.latest.toLocaleString()}
        </p>
      </div>
      <p className="ml-auto text-[0.7rem] text-[#c8d3df]">{meta.rangeLabel}</p>
    </div>
  );
}
