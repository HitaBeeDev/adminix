import { ROLE_COLORS } from "./roleDistribution.constants";
import type { RoleDistributionBarProps } from "./roleDistribution.types";

export function RoleDistributionBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  value = 0,
}: RoleDistributionBarProps) {
  const radius = 7;
  const colors = ROLE_COLORS[index % ROLE_COLORS.length];
  const gradId = `rbar-grad-${index}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bar} stopOpacity={1} />
          <stop offset="100%" stopColor={colors.barEnd} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={`url(#${gradId})`}
      />
      <rect
        x={x}
        y={y + height - radius}
        width={width}
        height={radius}
        fill={`url(#${gradId})`}
      />
      <text
        x={x + width / 2}
        y={y - 6}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill="#94a3b8"
      >
        {value.toLocaleString()}
      </text>
    </g>
  );
}
