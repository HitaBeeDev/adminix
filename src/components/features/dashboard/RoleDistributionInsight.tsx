import { Crown } from "lucide-react";
import type { RoleDistributionDatum } from "./roleDistribution.types";

interface RoleDistributionInsightProps {
  isLoading: boolean;
  topRole: RoleDistributionDatum | null;
}

export function RoleDistributionInsight({ isLoading, topRole }: RoleDistributionInsightProps) {
  if (isLoading || !topRole) return null;

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <div
        className="rounded-xl px-3 py-2.5"
        style={{ background: topRole.color.bar + "0f" }}
      >
        <div className="flex items-center gap-1 mb-1.5">
          <Crown size={9} style={{ color: topRole.color.bar }} />
          <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8]">
            Top Role
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: topRole.color.bar }}
          />
          <span className="text-[0.8125rem] font-bold text-[#0f172a] dark:text-white leading-none">
            {topRole.name}
          </span>
        </div>
      </div>

      <div className="rounded-xl px-3 py-2.5 bg-[#f8fafc] dark:bg-[#1e293b]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#94a3b8] mb-1.5">
          Coverage
        </p>
        <div className="flex items-baseline gap-1">
          <span
            className="text-[0.8125rem] font-bold leading-none"
            style={{ color: topRole.color.bar }}
          >
            {topRole.pct}%
          </span>
          <span className="text-[0.625rem] text-[#94a3b8] leading-none">of all users</span>
        </div>
      </div>
    </div>
  );
}
