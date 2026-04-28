import { http, HttpResponse } from 'msw';
import { mockUsers, mockAccounts, mockActivity } from '@/mocks/seeds';

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () => {
    // --- KPI counts ---
    const totalUsers     = mockUsers.length;
    const activeUsers    = mockUsers.filter((u) => u.status === 'active').length;
    const suspendedUsers = mockUsers.filter((u) => u.status === 'suspended').length;
    const totalAccounts  = mockAccounts.length;
    const activeAccounts = mockAccounts.filter((a) => a.status === 'active').length;

    const now = new Date('2026-04-08T00:00:00Z');
    const newThisMonth = mockUsers.filter((u) => {
      const d = new Date(u.dateJoined);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;

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

    // --- Registrations over last 12 months (for line chart) ---
    const registrationsByMonth: { month: string; registrations: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date('2026-04-01T00:00:00Z');
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      const registrations = mockUsers.filter((u) => {
        const joined = new Date(u.dateJoined);
        return joined.getFullYear() === year && joined.getMonth() === month;
      }).length;
      registrationsByMonth.push({ month: label, registrations });
    }

    // --- Activity over the last 14 days (for line chart) ---
    const activityByDay: { date: string; events: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date('2026-04-08T00:00:00Z');
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const events = mockActivity.filter((e) => e.timestamp.slice(0, 10) === dateStr).length;
      activityByDay.push({ date: dateStr, events });
    }

    // --- Activity by day of week (Mon–Sun) ---
    const dowLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityByDayOfWeek = dowLabels.map((day, i) => ({
      day,
      // getDay(): 0=Sun … 6=Sat  →  map to Mon=1 … Sun=0
      events: mockActivity.filter((e) => {
        const d = new Date(e.timestamp).getDay();
        return d === (i + 1) % 7;
      }).length,
    }));

    // --- Recent activity (latest 5 events) ---
    const recentActivity = [...mockActivity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return HttpResponse.json({
      kpis: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        newThisMonth,
        totalAccounts,
        activeAccounts,
        sessionRating: 4.7,
      },
      usersByRole,
      usersByStatus,
      accountsByPlan,
      registrationsByMonth,
      activityByDay,
      activityByDayOfWeek,
      recentActivity,
    });
  }),
];
