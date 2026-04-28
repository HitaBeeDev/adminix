import { TrendingUp } from "lucide-react";
import type { RoleDistributionDatum } from "./roleDistribution.types";

interface RoleDistributionInsightProps {
  isLoading: boolean;
  topRole: RoleDistributionDatum | null;
}

export function RoleDistributionInsight({ isLoading, topRole }: RoleDistributionInsightProps) {
  if (isLoading || !topRole) return null;

  return (
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
        #1
      </span>
    </div>
  );
}
