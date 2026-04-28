import type { RoleDistributionDatum } from "./roleDistribution.types";

interface RoleDistributionLegendProps {
  isLoading: boolean;
  roleData: RoleDistributionDatum[];
}

export function RoleDistributionLegend({ isLoading, roleData }: RoleDistributionLegendProps) {
  if (isLoading || roleData.length === 0) return null;

  return (
    <div className="grid grid-cols-5 gap-1.5 mt-3">
      {roleData.map((role) => (
        <div
          key={role.name}
          className="flex flex-col items-center gap-1 rounded-xl py-2 px-1 transition-colors"
          style={{ background: role.color.bg }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: role.color.bar }} />
          <span className="text-[0.625rem] font-medium text-[#64748b] leading-none">
            {role.name}
          </span>
          <span className="text-[0.75rem] font-bold leading-none" style={{ color: role.color.text }}>
            {role.value.toLocaleString()}
          </span>
          <span
            className="text-[0.625rem] font-semibold px-1.5 py-0.5 rounded-full leading-none"
            style={{ background: role.color.bar + "22", color: role.color.bar }}
          >
            {role.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}
