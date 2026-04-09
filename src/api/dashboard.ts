import type { ActivityEvent } from '@/types/activity';

export interface DashboardKpis {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newThisMonth: number;
  totalAccounts: number;
  activeAccounts: number;
}

export interface DashboardStats {
  kpis: DashboardKpis;
  registrationsByMonth: { month: string; registrations: number }[];
  usersByRole: { role: string; count: number }[];
  usersByStatus: { status: string; count: number }[];
  accountsByPlan: { plan: string; count: number }[];
  activityByDay: { date: string; events: number }[];
  activityByDayOfWeek: { day: string; events: number }[];
  recentActivity: ActivityEvent[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch('/api/dashboard/stats');
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json() as Promise<DashboardStats>;
}
