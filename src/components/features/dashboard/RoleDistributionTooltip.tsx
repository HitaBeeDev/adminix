import type { RoleDistributionDatum } from "./roleDistribution.types";

interface RoleDistributionTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RoleDistributionDatum }>;
}

export function RoleDistributionTooltip({ active, payload }: RoleDistributionTooltipProps) {
  if (!active || !payload?.length) return null;

  const role = payload[0].payload;

  return (
    <div className="bg-[#0f172a] rounded-xl px-3 py-2.5 shadow-2xl border border-white/[0.06] min-w-[130px]">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: role.color.bar }} />
        <span className="text-[#64748b] text-[0.625rem] font-semibold uppercase tracking-widest">
          {role.name}
        </span>
      </div>
      <p className="text-white text-[1rem] font-bold leading-none tabular-nums">
        {role.value.toLocaleString()}
        <span className="text-[#475569] font-normal text-[0.625rem] ml-1.5">users</span>
      </p>
      <div
        className="mt-2 pt-2 border-t border-white/[0.06] text-[0.625rem] font-semibold tabular-nums"
        style={{ color: role.color.bar }}
      >
        {role.pct}% of total
      </div>
    </div>
  );
}
