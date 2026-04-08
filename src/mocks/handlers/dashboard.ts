import { http, HttpResponse } from 'msw';
import { mockUsers, mockAccounts, mockActivity } from '@/mocks/seeds';

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () => {
    // --- KPI counts ---
    const totalUsers    = mockUsers.length;
    const activeUsers   = mockUsers.filter((u) => u.status === 'active').length;
    const totalAccounts = mockAccounts.length;
    const activeAccounts = mockAccounts.filter((a) => a.status === 'active').length;

    // --- Users by role (for pie/bar chart) ---
    const usersByRole = ['super_admin', 'admin', 'manager', 'editor', 'viewer', 'guest'].map(
      (role) => ({
        role,
        count: mockUsers.filter((u) => u.role === role).length,
      }),
    );

    // --- Users by status (for pie chart) ---
    const usersByStatus = ['active', 'suspended', 'pending'].map((status) => ({
      status,
      count: mockUsers.filter((u) => u.status === status).length,
    }));

    // --- Accounts by plan (for bar chart) ---
    const accountsByPlan = ['free', 'starter', 'pro', 'enterprise'].map((plan) => ({
      plan,
      count: mockAccounts.filter((a) => a.plan === plan).length,
    }));

    // --- Activity over the last 14 days (for line chart) ---
    const activityByDay: { date: string; events: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date('2026-04-08T00:00:00Z');
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const events = mockActivity.filter((e) => e.timestamp.slice(0, 10) === dateStr).length;
      activityByDay.push({ date: dateStr, events });
    }

    // --- Recent activity (latest 5 events) ---
    const recentActivity = [...mockActivity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return HttpResponse.json({
      kpis: {
        totalUsers,
        activeUsers,
        totalAccounts,
        activeAccounts,
      },
      usersByRole,
      usersByStatus,
      accountsByPlan,
      activityByDay,
      recentActivity,
    });
  }),
];
