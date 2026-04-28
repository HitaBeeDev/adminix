import { ROLE_COLORS } from "./roleDistribution.constants";
import type { RoleDistributionDatum } from "./roleDistribution.types";

export function formatRoleName(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
}

export function buildRoleDistributionData(
  usersByRole: Array<{ role: string; count: number }> = [],
) {
  const total = usersByRole.reduce((sum, role) => sum + role.count, 0);
  const roleData = usersByRole.map((role, index) => ({
    name: formatRoleName(role.role),
    value: role.count,
    pct: total > 0 ? Math.round((role.count / total) * 100) : 0,
    color: ROLE_COLORS[index % ROLE_COLORS.length],
  }));

  return { total, roleData };
}

export function getTopRole(roleData: RoleDistributionDatum[]) {
  return roleData.length
    ? roleData.reduce((current, next) => (current.value > next.value ? current : next))
    : null;
}
