import { RoleDistributionBars } from "./RoleDistributionBars";
import { RoleDistributionHeader } from "./RoleDistributionHeader";
import { RoleDistributionInsight } from "./RoleDistributionInsight";
import { RoleDistributionLegend } from "./RoleDistributionLegend";
import type { RoleDistributionChartProps } from "./roleDistribution.types";
import {
  buildRoleDistributionData,
  getTopRole,
} from "./roleDistribution.utils";

export function RoleDistributionChart({
  data,
  isLoading,
}: RoleDistributionChartProps) {
  const { total, roleData } = buildRoleDistributionData(data?.usersByRole);
  const topRole = getTopRole(roleData);

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-[1.25rem] border border-[#e2e8f0] dark:border-[#1e293b] p-5 flex flex-col gap-0 transition-all duration-200 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(15,23,42,0.13)]">
      <RoleDistributionHeader isLoading={isLoading} total={total} />

      <RoleDistributionBars isLoading={isLoading} roleData={roleData} />

      <RoleDistributionLegend isLoading={isLoading} roleData={roleData} />

      <RoleDistributionInsight isLoading={isLoading} topRole={topRole} />
    </div>
  );
}
