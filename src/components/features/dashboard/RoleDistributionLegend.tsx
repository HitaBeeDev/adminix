import type { RoleDistributionDatum } from "./roleDistribution.types";

interface RoleDistributionLegendProps {
  isLoading: boolean;
  roleData: RoleDistributionDatum[];
}

export function RoleDistributionLegend({ isLoading, roleData }: RoleDistributionLegendProps) {
  if (isLoading || roleData.length === 0) return null;

  const sorted = [...roleData].sort((a, b) => b.value - a.value);
  const maxValue = sorted[0].value;

  return (
    <div className="mt-4 pt-3.5 border-t border-[#f1f5f9] dark:border-[#1e293b] flex flex-col gap-2">
      {sorted.map((role, i) => (
        <div key={role.name} className="flex items-center gap-2.5">
          <span className="text-[0.625rem] font-semibold text-[#cbd5e1] dark:text-[#334155] w-3 text-right tabular-nums select-none">
            {i + 1}
          </span>
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: role.color.bar }}
          />
          <span className="text-[0.73rem] font-medium text-[#64748b] dark:text-[#94a3b8] w-[3.5rem] truncate leading-none">
            {role.name}
          </span>
          <div className="flex-1 h-1.5 bg-[#f1f5f9] dark:bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(role.value / maxValue) * 100}%`,
                background: role.color.bar,
                opacity: 0.82,
              }}
            />
          </div>
          <span className="text-[0.73rem] font-bold text-[#1e293b] dark:text-white tabular-nums w-[2.5rem] text-right leading-none">
            {role.value.toLocaleString()}
          </span>
          <span
            className="text-[0.6rem] font-semibold tabular-nums px-1.5 py-0.5 rounded-full w-[2.25rem] text-center flex-shrink-0 leading-none"
            style={{
              background: role.color.bar + "1a",
              color: role.color.bar,
            }}
          >
            {role.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}
