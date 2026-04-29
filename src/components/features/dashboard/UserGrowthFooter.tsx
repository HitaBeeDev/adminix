import { TrendingUp, Minus, Dot } from "lucide-react";
import type { UserGrowthPeriodMeta, UserGrowthStats } from "./userGrowth.types";

interface UserGrowthFooterProps {
  isLoading: boolean;
  meta: UserGrowthPeriodMeta;
  stats: UserGrowthStats;
}

interface StatChipProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}

function StatChip({ label, value, icon, accent }: StatChipProps) {
  return (
    <div className={`flex-1 rounded-xl px-3 py-2.5 ${accent ? "bg-[#eef2ff] dark:bg-[#1e293b]" : "bg-[#f8fafc] dark:bg-[#1e293b]"}`}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8]">
          {label}
        </span>
      </div>
      <span className={`text-[0.875rem] font-[800] tabular-nums leading-none ${accent ? "text-[#6366f1]" : "text-[#0f172a] dark:text-white"}`}>
        {value}
      </span>
    </div>
  );
}

export function UserGrowthFooter({ isLoading, meta, stats }: UserGrowthFooterProps) {
  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-[#f1f5f9] dark:border-[#1e293b] flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-[3.25rem] rounded-xl animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b]" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#f1f5f9] dark:border-[#1e293b] flex items-center gap-2">
      <StatChip
        label="Peak"
        value={stats.peak.toLocaleString()}
        icon={<TrendingUp size={9} className="text-[#6366f1]" />}
      />
      <StatChip
        label={meta.footerAvgLabel}
        value={stats.avg.toLocaleString()}
        icon={<Minus size={9} className="text-[#94a3b8]" />}
      />
      <StatChip
        label="Latest"
        value={stats.latest.toLocaleString()}
        icon={<Dot size={12} className="text-[#10b981] -ml-1" />}
        accent
      />
      <span className="ml-1 flex-shrink-0 text-[0.6rem] font-medium text-[#94a3b8] bg-[#f1f5f9] dark:bg-[#1e293b] px-2.5 py-1 rounded-full whitespace-nowrap">
        {meta.rangeLabel}
      </span>
    </div>
  );
}
