import type { RoleDistributionDatum } from "./roleDistribution.types";

interface RoleDistributionTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RoleDistributionDatum }>;
}

export function RoleDistributionTooltip({ active, payload }: RoleDistributionTooltipProps) {
  if (!active || !payload?.length) return null;

  const role = payload[0].payload;

  return (
    <div className="bg-[#0f172a] rounded-xl px-3.5 py-2.5 shadow-xl border border-white/10 min-w-[120px]">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: role.color.bar }} />
        <span className="text-[#94a3b8] text-[0.6875rem] font-medium">{role.name}</span>
      </div>
      <p className="text-white text-[0.9375rem] font-bold leading-none">
        {role.value.toLocaleString()}
        <span className="text-[#94a3b8] font-normal text-[0.6875rem] ml-1">users</span>
      </p>
      <p className="text-[0.6875rem] font-semibold mt-1" style={{ color: role.color.bar }}>
        {role.pct}% of total
      </p>
    </div>
  );
}
