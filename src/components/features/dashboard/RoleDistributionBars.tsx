import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { RoleDistributionBarShape } from "./RoleDistributionBarShape";
import { RoleDistributionTooltip } from "./RoleDistributionTooltip";
import type {
  RoleDistributionBarProps,
  RoleDistributionDatum,
} from "./roleDistribution.types";

interface RoleDistributionBarsProps {
  isLoading: boolean;
  roleData: RoleDistributionDatum[];
}

export function RoleDistributionBars({ isLoading, roleData }: RoleDistributionBarsProps) {
  if (isLoading) {
    return <div className="h-[200px] rounded-xl animate-pulse bg-[#f1f5f9] dark:bg-[#1e293b] mt-4" />;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={roleData} margin={{ top: 28, right: 6, left: 6, bottom: 0 }} barCategoryGap="30%">
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <Tooltip
          cursor={{ fill: "rgba(148,163,184,0.06)", radius: 8 }}
          content={<RoleDistributionTooltip />}
        />
        <Bar
          dataKey="value"
          shape={(props) => {
            const barProps = props as RoleDistributionBarProps & { index?: number };
            return (
              <RoleDistributionBarShape
                {...barProps}
                index={barProps.index ?? 0}
                value={Number(barProps.value ?? 0)}
              />
            );
          }}
          maxBarSize={48}
        >
          {roleData.map((role) => (
            <Cell key={role.name} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
