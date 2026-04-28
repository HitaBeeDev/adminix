import { http, HttpResponse } from 'msw';
import { mockUsers, mockAccounts, mockActivity } from '@/mocks/seeds';

// Synthetic totals consistent with the 12-month registration series (sum = 7,078)
const SYNTHETIC = {
  totalUsers:     7_078,
  newThisMonth:     841,
  activeUsers:    5_167,
  suspendedUsers:   779,
  totalAccounts:  1_240,
  activeAccounts: 1_092,
  usersByRole: [
    { role: 'super_admin', count: 142  },
    { role: 'admin',       count: 1_274 },
    { role: 'manager',     count: 991  },
    { role: 'editor',      count: 1_557 },
    { role: 'viewer',      count: 2_265 },
    { role: 'guest',       count: 849  },
  ],
  usersByStatus: [
    { status: 'active',    count: 5_167 },
    { status: 'pending',   count: 1_132 },
    { status: 'suspended', count: 779  },
  ],
};

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () => {
    const { totalUsers, newThisMonth, activeUsers, suspendedUsers,
            totalAccounts, activeAccounts, usersByRole, usersByStatus } = SYNTHETIC;

    // --- Accounts by plan (for bar chart) ---
    const accountsByPlan = ['free', 'starter', 'pro', 'enterprise'].map((plan) => ({
      plan,
      count: mockAccounts.filter((a) => a.plan === plan).length,
    }));

    // --- Registrations over last 12 months (for line chart) ---
    // Synthetic growth series: realistic SaaS ramp with seasonal variation
    const MONTHLY_REGS = [382, 418, 445, 523, 487, 561, 624, 598, 689, 712, 798, 841];
    const registrationsByMonth: { month: string; registrations: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date('2026-04-01T00:00:00Z');
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      registrationsByMonth.push({ month: label, registrations: MONTHLY_REGS[11 - i] });
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
